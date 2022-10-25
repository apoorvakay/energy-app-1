from asyncio.windows_events import NULL
from flask import Flask, jsonify, render_template
import pandas as pd
import numpy as np
import json

app = Flask(__name__)

#Reading data

energy_acc_df = pd.read_csv("static/data/gtfenergyaccessdata.csv")
energy_acc_filtered_df = energy_acc_df[((energy_acc_df['SeriesCode']=="1.1_ACCESS.ELECTRICITY.TOT"))]

minimum = energy_acc_filtered_df[['y'+str(number) for number in range(1990,2014)]].replace('..',None).astype(float).min()
maximum = energy_acc_filtered_df[['y'+str(number) for number in range(1990,2014)]].replace('..',None).astype(float).max()
mean = energy_acc_filtered_df[['y'+str(number) for number in range(1990,2014)]].replace('..',None).astype(float).mean()
#std = energy_acc_filtered_df[['y'+str(number) for number in range(1990,2014)]].replace('..',None).astype(float).std()

energy_acc_derived_df = pd.concat([minimum,maximum,mean],axis=1)
energy_acc_derived_df.columns = ['min', 'max', 'mean']


with open("static/data/countries-110m.json") as f:
    world_json = json.load(f)

@app.route('/')
def index():
   return render_template('index.html')

def calculate_percentage(val, total):
   """Calculates the percentage of a value over a total"""
   percent = np.round((np.divide(val, total) * 100), 2)
   return percent

def data_creation(data, percent, class_labels, group=None):
   for index, item in enumerate(percent):
       data_instance = {}
       data_instance['category'] = class_labels[index]
       data_instance['value'] = item
       data_instance['group'] = group
       data.append(data_instance)
     
@app.route('/get_energy_access')
def get_energy_access():
    energy_data=energy_acc_filtered_df
    return energy_data.to_json(orient='records')

@app.route('/get_world_data')
def get_world_data():
    return world_json
    
@app.route('/get_line_chart_data')
def get_line_chart_data():
    return energy_acc_derived_df.to_json(orient='records', index=True)


if __name__ == '__main__':
   app.run(debug=True)