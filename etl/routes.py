from mock_request_api import update, add_metric_to_bucket
from ryte import extract_data_for_x_days, update_ryte
from ga4 import updateGA4, run_report
from google_search_console import create_gsc
from flask import Flask, request, jsonify
from csv import writer


app = Flask(__name__)

@app.route('/createGA4', methods=['POST'])
def create_ga4():
    data = request.get_json()
    print(data)
    days = data.get('days')
    metricList = data.get('metricList')
    bucket = data.get('bucket')
    property_id = data.get('property_id')
    run_report(metricList, days, bucket, property_id)

    list = ["GA4",metricList,bucket,property_id]
    
    # Create a file object for this file
    with open('data.csv', 'a', newline='') as f_object:
        writer_object = writer(f_object)
        writer_object.writerow(list)
        f_object.close()
    return jsonify({'message': 'Data has been written to InfluxDB'}), 200

@app.route('/createGSC', methods=['POST'])
def create_GSC():
    data = request.get_json()
    print(data)
    date = data.get('date')
    bucket = data.get('bucket')
    domain = data.get('domain')
    create_gsc(date, domain, bucket)
    list = ["GSC","sc-domain:"+domain,bucket]

   # Create a file object for this file
    with open('data.csv', 'a', newline='') as f_object:
        writer_object = writer(f_object)
        writer_object.writerow(list)
        f_object.close()

    return jsonify({'message': 'Data has been written to InfluxDB'}), 200


@app.route('/createRyte', methods=['POST'])
def create_ryte():
    data = request.get_json()
    bucket = data.get('bucket')
    metricList = data.get('metricList')
    days = data.get('days')
    api_key = data.get('api_key')
    project = data.get('project')

    list = ["Ryte",bucket,metricList,api_key,project]

    # Create a file object for this file
    with open('data.csv', 'a', newline='') as f_object:
        writer_object = writer(f_object)
        writer_object.writerow(list)
        f_object.close()

    return jsonify({'message': 'Data has been written to InfluxDB'}), 200
"""
@app.route('/createGA', methods=['POST'])
def timespan_api():
    data = request.get_json()
    print(data)
    days = data.get('days')
    metric = data.get('metric')
    buc = data.get('bucket')
    metricForm = data.get('metricForm')
    displayedDays = data.get('displayedDays')
    add_metric_to_bucket(days, metric, buc, metricForm, displayedDays)
    return jsonify({'message': 'Data has been written to InfluxDB'}), 200

@app.route('/updateGA', methods=['POST'])
def update_metrics():
    data = request.get_json()
    print(data)
    buc = data.get('bucket')
    update(buc)
    return jsonify({'message': 'Data has been written to InfluxDB'}), 200

@app.route('/createRyte', methods=['POST'])
def create_ryte():
    data = request.get_json()
    print(data)
    days = data.get('days')
    bucket = data.get('bucket')
    attributeList = data.get('attributeList')
    api_key = data.get('api_key')
    project = data.get('project')
    extract_data_for_x_days(bucket, attributeList, days, api_key, project)
    return jsonify({'message': 'Data has been written to InfluxDB'}), 200

@app.route('/updateRyte', methods=['POST'])
def update_ryte():
    data = request.get_json()
    print(data)
    bucket = data.get('bucket')
    attributeList = data.get('attributeList')
    api_key = data.get('api_key')
    project = data.get('project')
    update(bucket, attributeList, api_key, project)
    return jsonify({'message': 'Data has been written to InfluxDB'}), 200
"""
if __name__ == '__main__':
  app.run(debug=True)
  