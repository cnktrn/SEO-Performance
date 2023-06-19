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
    const bucket_name =  req.body.bucket_name;
    const metric_name =  req.body.metric_name;
    const query=  `from(bucket: "${bucket_name}")|> range(start: 0)|> filter(fn: (r) => r["_measurement"] != "_start" and r["_measurement"] != "_stop")|> filter(fn: (r) => r["_field"] == "${metric_name}")|> group() |> mean()`
    console.log(query)

    for await (const {values, tableMeta} of queryApi.iterateRows(query)) {
    const o = tableMeta.toObject(values)
    console.log(o)
    res.status(200).json(o)
  }
}

const fluxQuery2= 'from(bucket: "Analytica") |> range(start: time(v:"2023-04-01T00:00:00Z"), stop: time(v:"2023-06-05T00:00:00Z"))|> filter(fn: (r) => r["_measurement"] == "https://analytica.de/de/")|> filter(fn: (r) => r["_field"] == "server_load_time")|> aggregateWindow(every: 10d, fn: mean, createEmpty: false)|> yield(name: "mean")'

const myQuery = async () => {
    for await (const {values, tableMeta} of queryApi.iterateRows(fluxQuery2)) {
        const o = tableMeta.toObject(values)
        console.log(o)
    }
  }
  


/** Execute a query and receive line table metadata and rows. */
myQuery()



