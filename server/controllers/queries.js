'use strict'
/** @module query 
 * Queries a data point in InfluxDB using the Javascript client library with Node.js.
**/

import { InfluxDB, Point } from '@influxdata/influxdb-client'

/* Environment variables */
const url = "http://20.160.222.178:8086/";
const token = "C_YCM_dHzdvVl0GTWXTcVwvth6HT8I5-K4gkALGhwGdzMRhoawGEnkGD41yU2gQz64CYVGkdAhGSIfWqJU_2lQ==";
const org = "MM";
const client = new InfluxDB({url: url, token: token, org: org})

/**
 * Instantiate the InfluxDB client
 * with a configuration object.
 *
 * Get a query client configured for your org.
 **/
const queryApi = client.getQueryApi(org)

/** To avoid SQL injection, use a string literal for the query. */
const fluxQuery = 'from(bucket:"Analytica") |> range(start: 0) |> filter(fn: (r) => r._measurement == "https://analytica.de/de/")'
const flux= 'from(bucket: "Analytica")|> range(start: 0)|> filter(fn: (r) => r["_measurement"] != "_start" and r["_measurement"] != "_stop")|> filter(fn: (r) => r["_field"] == "server_load_time")|> mean()'

export const metricMean_bucket = async (req, res) => {
    const bucket_name = req.query.bucket_name;
    const metric_name = req.query.metric_name;
    const query =  `from(bucket: "${bucket_name}")
    |> range(start: 0)
    |> filter(fn: (r) => r["_measurement"] != "_start" and r["_measurement"] != "_stop")
    |> filter(fn: (r) => r["_field"] == "${metric_name}")
    |> group()
    |> mean()`
    console.log(query)

    for await (const {values, tableMeta} of queryApi.iterateRows(query)) {
    const o = tableMeta.toObject(values)
    console.log(o)
    res.status(200).json(o)
  }
}

export const metricMean_pages_bucket = async (req, res) => {

  let list = [];

  const bucket_name =  req.query.bucket_name;
  const metric_name =  req.query.metric_name;

  const query=  `from(bucket: "${bucket_name}")
  |> range(start: 0)
  |> filter(fn: (r) => r["_field"] == "${metric_name}")
  |> mean()
  |> sort(columns: ["_value"], desc: false) 
  |> group(columns: ["_measurement","_field"], mode:"except")`
  console.log(query.length)

  for await (const {values, tableMeta} of queryApi.iterateRows(query)) {
  list.push(tableMeta.toObject(values));
  //console.log(list)
}
res.status(200).json(list)
}

export const metricMean_page_time = async (req, res) => {
  const bucket_name =  req.query.bucket_name;
  const metric_name =  req.query.metric_name;
  const time_start = req.query.time_start;
  const time_end = req.query.time_end;
  const web_page = req.query.web_page;

  const query=  `from(bucket: "${bucket_name}")
  |> range(start: time(v:"${time_start}"), stop: time(v:"${time_end}"))
  |> filter(fn: (r) => r["_measurement"] == "${web_page}")
  |> filter(fn: (r) => r["_field"] == "${metric_name}")
  |> aggregateWindow(every: 10d, fn: mean, createEmpty: false)
  |> mean()`
  console.log(query)

  for await (const {values, tableMeta} of queryApi.iterateRows(query)) {
  var o = tableMeta.toObject(values)
  console.log(o)
}
res.status(200).json(o)
console.log(o);
}

const fluxQuery2= 'from(bucket: "Analytica") |> range(start: time(v:"2023-04-01T00:00:00Z"), stop: time(v:"2023-06-05T00:00:00Z"))|> filter(fn: (r) => r["_measurement"] == "https://analytica.de/de/")|> filter(fn: (r) => r["_field"] == "${metric_name}")|> aggregateWindow(every: 10d, fn: mean, createEmpty: false)|> yield(name: "mean")'

export const metricOverall_page_time = async (req, res) => {

  let list = [];

  const bucket_name =  req.query.bucket_name;
  const metric_name =  req.query.metric_name;
  const time_start = req.query.time_start;
  const time_end = req.query.time_end;
  const web_page = req.query.web_page;

  const query=  `from(bucket: "${bucket_name}")
  |> range(start: time(v:"${time_start}"), stop: time(v:"${time_end}"))
  |> filter(fn: (r) => r["_measurement"] == "${web_page}")
  |> filter(fn: (r) => r["_field"] == "${metric_name}")
  |> drop(columns: ["keyword"])
  |> aggregateWindow(every: 1d, fn: sum, createEmpty: false)
  |> group(columns: ["_time"]) `
  //console.log(query.length)

  for await (const {values, tableMeta} of queryApi.iterateRows(query)) {
  list.push(tableMeta.toObject(values))
  //console.log(list.length)
}

res.status(200).json(list);
}


export const available_events = async (req, res) => {

  let list = [];
  
  const query=  `buckets()`
  //console.log(query)

  for await (const {values, tableMeta} of queryApi.iterateRows(query)) {
  
  let obj = tableMeta.toObject(values)
  console.log(obj.name)
  list.push(obj.name);
}
res.status(200).json(list)
}


export const available_subpages = async (req, res) => {

  let list = [];
  const bucket_name =  req.query.bucket_name;
  const query=  `import "influxdata/influxdb/schema" schema.measurements(bucket: "${bucket_name}")`
  //console.log(query)

  for await (const {values, tableMeta} of queryApi.iterateRows(query)) {
  
  let obj = tableMeta.toObject(values)
  console.log(obj.name)
  list.push(obj._value);
}
res.status(200).json(list)
}

export const metricOverall_page_time_sum = async (req, res) => {

  let list = [];

  const bucket_name =  req.query.bucket_name;
  const metric_name =  req.query.metric_name;
  const time_start = req.query.time_start;
  const time_end = req.query.time_end;

  const query=  `from(bucket: "${bucket_name}")
  |> range(start: time(v:"${time_start}"), stop: time(v:"${time_end}"))
  |> filter(fn: (r) => r["_field"] == "${metric_name}")
  |> drop(columns: ["keyword","_measurement"])
  |> aggregateWindow(every: 1d, fn: sum, createEmpty: false)
  |> group(columns: ["_time"]) `
  //console.log(query.length)

  for await (const {values, tableMeta} of queryApi.iterateRows(query)) {
  list.push(tableMeta.toObject(values))
  //console.log(list.length)
}

res.status(200).json(list);
}

export const get_top_keywords_for_metric_per_subpage = async (req, res) => {

  let list = [];

  const bucket_name =  req.query.bucket_name;
  const metric_name =  req.query.metric_name;
  const time_start = req.query.time_start;
  const time_end = req.query.time_end;
  const web_page = req.query.web_page;


  const query=  `from(bucket: "${bucket_name}")
  |> range(start: time(v:"${time_start}"), stop: time(v:"${time_end}"))
  |> filter(fn: (r) => r["_measurement"] == "${web_page}")
  |> filter(fn: (r) => r["_field"] == "${metric_name}")
  |> aggregateWindow(every: 10000d, fn: sum, createEmpty: false)
  |> group()
  |> sort(columns: ["_value"], desc: true)`
  //console.log(query.length)

  for await (const {values, tableMeta} of queryApi.iterateRows(query)) {
  list.push(tableMeta.toObject(values))
  //console.log(list.length)
}

res.status(200).json(list);
}

export const get_top_keywords_for_metric_all_subpages = async (req, res) => {

  let list = [];

  const bucket_name =  req.query.bucket_name;
  const metric_name =  req.query.metric_name;
  const time_start = req.query.time_start;
  const time_end = req.query.time_end;
  const web_page = req.query.web_page;


  const query=  `from(bucket: "${bucket_name}")
  |> range(start: time(v:"${time_start}"), stop: time(v:"${time_end}"))
  |> filter(fn: (r) => r["_field"] == "${metric_name}")
  |> drop(columns: ["_measurement", "col2"])
  |> aggregateWindow(every: 10000d, fn: sum, createEmpty: false)
  |> group()
  |> sort(columns: ["_value"], desc: true)`
  //console.log(query.length)

  for await (const {values, tableMeta} of queryApi.iterateRows(query)) {
  list.push(tableMeta.toObject(values))
  //console.log(list.length)
}

res.status(200).json(list);
}


/** Execute a query and receive line table metadata and rows. */
//myQuery()



