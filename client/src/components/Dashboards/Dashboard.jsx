import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Chart from "chart.js/auto";
import { Line, Bar, Pie } from "react-chartjs-2";
import Select from 'react-select';
import getKpiList from "./CreateDashboard";

import DateRangePicker from './DateRangePicker';

const Dashboard = () => {

    const {id} = useParams();
    const [metric_name, setMetric] = useState();
    const [labels, setLabels] = useState([]);
    const [values, setValues] = useState([]);
    const [dashboard, setDashboard] = useState();
    const [dataSource, setDataSource] = useState();
    const [subPages, setSubPages] = useState();
    const [events, setEvents] = useState();
    const [selectedEvent, setSelectedEvent] = useState();
    const [selectedDate, setSelectedDate] = useState("");
    const [compareDate, setCompareDate] = useState("");
    const [kpiList, setKpiList] = useState([]);
    const [lineChartDataArray, setLineChartDataArray] = useState([]);
    const [charts, setCharts] = useState([]);
    const [subPageSelected, setSubPageSelected] = useState("all_subpages");
    const [timeStart, setTimeStart] = useState("2020-04-01T00:00:00Z");
    const [timeEnd, setTimeEnd] = useState("2025-06-05T00:00:00Z");
    const [comparedTimeStart, setComparedTimeStart] = useState(null);
    const [comparedTimeEnd, setComparedTimeEnd] = useState(null);
    //console.log(kpiList);


    const fetchChartData = async (kpis, web_page, time_start, time_end) => {
        const chartList = [];
        const promises = []; // Array to hold the promises
      
        console.log(kpis);
        Object.keys(kpis).forEach(async (key) => {
          const value = kpis[key];
          switch (value) {
            case "Line Chart":
              let chartData = []  
              if (web_page == "all_subpages") {
                console.log("all_pages")
                chartData = await getMoptS(key, time_start, time_end);
              }
              else{
                chartData = await getMopT(key, web_page, time_start, time_end);
              }  
              const val = chartData.map((entry) => entry._value);
              const labels = chartData.map((entry) => {
                const date = new Date(entry._time);
                return date.toLocaleDateString('en-US');
            });

              let data = {
                labels: labels,
                datasets: [
                  {
                    label: key,
                    backgroundColor: "rgb(255, 99, 132)",
                    borderColor: "rgb(255, 99, 132)",
                    data: val,
                  },
                ],
              };
              console.log("OGdata");
              console.log(data);
              chartList.push(<div><Line data={data} width={70} height={40} key={key}/></div>);
              break;
      
            case "Average":
              promises.push(
                (async () => {
                  let average = await getMmB(key);
                  const valAvg = average._value;
                  console.log(valAvg);
                  chartList.push(<div><p>Average over time span: {valAvg}</p></div>);
                })()
              );
              break;
            case "Bar Chart Keywords":
                promises.push(
                    (async () => {
                    let barChartData = []
                    if (web_page == "all_subpages") {
                        barChartData = await getGtkfmas(key, time_start, time_end)
                        console.log(barChartData)
                    }
                    else{
                        barChartData = await getGtkfmps(key, web_page, time_start, time_end)
                    }   
                    // Extract the first ten "keyword" values
                    const keywordList = barChartData.slice(0, 20).map(obj => obj.keyword);

                    // Extract the first ten "_value" values
                    const valueList = barChartData.slice(0, 20).map(obj => obj._value);
                    console.log(keywordList);
                    console.log(valueList);
                    let dataBar = {
                        labels: keywordList,
                        datasets: [
                          {
                            label: key,
                            backgroundColor: "rgb(255, 99, 132)",
                            borderColor: "rgb(255, 99, 132)",
                            data: valueList,
                          },
                        ],
                    };
                    chartList.push(<div><Bar data={dataBar} width={70} height={40} key={key}/></div>);
                    })()
                );
                break
                case "Pie Chart Keywords":
                    promises.push(
                        (async () => {
                        let pieChartData = []
                        if (web_page == "all_subpages") {
                            pieChartData = await getGtkfmas(key, time_start, time_end)
                            console.log(pieChartData)
                        }
                        else{
                            pieChartData = await getGtkfmps(key, web_page, time_start, time_end)
                        }   
                        // Extract the first ten "keyword" values
                        const keywordList = pieChartData.slice(0, 20).map(obj => obj.keyword);
    
                        // Extract the first ten "_value" values
                        const valueList = pieChartData.slice(0, 20).map(obj => obj._value);
                        console.log(keywordList);
                        console.log(valueList);
                        const startingColor = "rgb(255, 99, 132)";
                        const colorCodes = generateColorList(valueList.length, startingColor);
                        console.log(colorCodes);
                        let dataBar = {
                            labels: keywordList,
                            datasets: [
                              {
                                label: key,
                                backgroundColor: colorCodes,
                                borderColor: colorCodes,
                                data: valueList,
                              },
                            ],
                        };
                        const options = {
                            plugins: {
                              legend: {
                                display: false, // Disable legend
                              }
                            },
                          };
                        chartList.push(<div><Pie data={dataBar}  options={options} width={50} height={20} key={key}/></div>);
                        })()
                    );
                break
            default:
              break;
          }
        });
      
        // Wait for all promises to resolve
        await Promise.all(promises);
      
        console.log(chartList);
        return chartList;
      };

    const getDashboard = async () => {
        const response = await fetch(
            "http://localhost:5555/dashboards/" + id,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + window.localStorage.getItem("token"),
                },
            }
        )
        const jsonResponse = await response.json();
        //console.log(jsonResponse.dataSource);
        setDashboard(jsonResponse);
        setDataSource(jsonResponse.dataSource);
        setKpiList(jsonResponse.KPIs);
        //console.log(jsonResponse.KPIs)
        const charts = await fetchChartData(jsonResponse.KPIs,"all_subpages", timeStart,timeEnd)
        //console.log("lo2");
        //console.log(charts);
        setCharts(charts);

        
        //const resolvedChartDataArray = await Promise.all(chartDataPromises);
        //setLineChartDataArray(resolvedChartDataArray);

    }

    

    const getEvents = async () => {
        const response = await fetch(
            "http://127.0.0.1:5555/queries/aE",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + window.localStorage.getItem("token"),
                },
            }
        )
        let jsonResponse = await response.json();
        //console.log(jsonResponse);
        let dictList=[];
        dictList.push({ value: "all_events", label: "all events" });
        jsonResponse = jsonResponse.filter(item => !item.includes('?'));
        jsonResponse = jsonResponse.sort();
        jsonResponse.forEach(element => {
            //console.log(element);
            let entry= { value: element, label: element };
            dictList.push(entry);
        });
        setEvents(dictList);
    }


    const getSubPages = async () => {
        const response = await fetch(
            "http://127.0.0.1:5555/queries/aS?bucket_name=Analytica",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + window.localStorage.getItem("token"),
                },
            }
        )
        let jsonResponse = await response.json();
        //console.log(jsonResponse);
        let dictList=[];
        dictList.push({ value: "all_subpages", label: "all subpages" });
        jsonResponse = jsonResponse.filter(item => !item.includes('?'));
        jsonResponse = jsonResponse.sort((a, b) => a.length - b.length);
        jsonResponse.forEach(element => {
            //console.log(element);
            let entry= { value: element, label: element };
            dictList.push(entry);
        });
        setSubPages(dictList);
    }

    const getMmB = async (metric_name) => {
        //if (selectedEvent) {
        const response = await fetch(
            `http://127.0.0.1:5555/queries/mmB?bucket_name=Analytica&metric_name=${metric_name}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + window.localStorage.getItem("token"),
                }
            }
        )
        const jsonResponse = await response.json();
        //console.log(jsonResponse)
        //}
        //else {
        //    console.log("No event selected")
        //}
        return jsonResponse;
    }

    const getMmpB = async () => {
        const response = await fetch(
            "http://127.0.0.1:5555/queries/mmpB?bucket_name=Analytica&metric_name=activeUsers",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + window.localStorage.getItem("token"),
                }
            }
        )
        const jsonResponse = await response.json();
        console.log(jsonResponse)
    }

    const getMmpT = async () => {
        const response = await fetch(
            `http://127.0.0.1:5555/queries/mmpT?bucket_name=Analytica&metric_name=activeUsers&time_start=2023-04-01T00:00:00Z&time_end=2023-06-05T00:00:00Z&web_page=https://analytica.de/de/`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + window.localStorage.getItem("token"),
                }
            }
        )
        const jsonResponse = await response.json();
        //const updatedLabels = jsonResponse.map((entry) => entry._time);
        //const updatedValues = jsonResponse.map((entry) => entry._value);
        //setLabels(updatedLabels);
        //setValues(updatedValues);
    }


    const getMopT = async (metric_name, web_page, time_start, time_end) => {
        const response = await fetch(
            `http://127.0.0.1:5555/queries/mopT?bucket_name=Analytica&metric_name=${metric_name}&time_start=${time_start}&time_end=${time_end}&web_page=${web_page}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + window.localStorage.getItem("token"),
                }
            }
        )
        const jsonResponse = await response.json();
        const updatedLabels = jsonResponse.map((entry) => entry._time);
        const updatedValues = jsonResponse.map((entry) => entry._value);
        setLabels(updatedLabels);
        setValues(updatedValues);
        return jsonResponse
    }

    const getMoptS = async (metric_name, time_start, time_end) => {
        const response = await fetch(
            `http://127.0.0.1:5555/queries/moptS?bucket_name=Analytica&metric_name=${metric_name}&time_start=${time_start}&time_end=${time_end}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + window.localStorage.getItem("token"),
                }
            }
        )
        const jsonResponse = await response.json();
        const updatedLabels = jsonResponse.map((entry) => entry._time);
        const updatedValues = jsonResponse.map((entry) => entry._value);
        setLabels(updatedLabels);
        setValues(updatedValues);
        return jsonResponse
    }

    const getGtkfmps = async (metric_name,  web_page, time_start, time_end) => {
        const response = await fetch(
            `http://127.0.0.1:5555/queries/gtkfmpS?bucket_name=Analytica&metric_name=${metric_name}&time_start=${time_start}&time_end=${time_end}&web_page=${web_page}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + window.localStorage.getItem("token"),
                }
            }
        )
        const jsonResponse = await response.json();
        const updatedLabels = jsonResponse.map((entry) => entry._time);
        const updatedValues = jsonResponse.map((entry) => entry._value);
        setLabels(updatedLabels);
        setValues(updatedValues);
        return jsonResponse
    }
    const getGtkfmas = async (metric_name, time_start, time_end) => {
        console.log(`http://127.0.0.1:5555/queries/gtkfmaS?bucket_name=Analytica&metric_name=${metric_name}&time_start=${time_start}&time_end=${time_end}`)
        const response = await fetch(
            `http://127.0.0.1:5555/queries/gtkfmaS?bucket_name=Analytica&metric_name=${metric_name}&time_start=${time_start}&time_end=${time_end}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + window.localStorage.getItem("token"),
                }
            }
        )
        const jsonResponse = await response.json();
        const updatedLabels = jsonResponse.map((entry) => entry._time);
        const updatedValues = jsonResponse.map((entry) => entry._value);
        setLabels(updatedLabels);
        setValues(updatedValues);
        return jsonResponse
    }

    function getRandomColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgb(${r}, ${g}, ${b})`;
      }
      
      function generateColorList(length, startingColor) {
        const colorList = [startingColor];
        for (let i = 1; i < length; i++) {
          const lastColor = colorList[i - 1];
          const newColor = getRandomColor();
          colorList.push(generateHarmoniousColor(lastColor, newColor));
        }
        return colorList;
      }
      
      function generateHarmoniousColor(color1, color2) {
        const [r1, g1, b1] = color1.match(/\d+/g);
        const [r2, g2, b2] = color2.match(/\d+/g);
      
        const r = Math.floor((parseInt(r1) + parseInt(r2)) / 2);
        const g = Math.floor((parseInt(g1) + parseInt(g2)) / 2);
        const b = Math.floor((parseInt(b1) + parseInt(b2)) / 2);
      
        return `rgb(${r}, ${g}, ${b})`;
      }

    const getSelectedDate = () => {
        console.log("Selected Date:", selectedDate);
    };

    const getCompareDate = () => {
        console.log("Compare Dates:", compareDate);
    };

    const onSubPageSelection = async (choice) => {
        console.log("Compare Dates:", choice.value);
        if(comparedTimeEnd!=null && comparedTimeStart!=null){
            handleDateRangeChangeCompareDates(comparedTimeStart, comparedTimeEnd);
        }
        else{
            const charts = await fetchChartData(kpiList, choice.value, timeStart,timeEnd)
            setCharts(charts);
        }
        
        setSubPageSelected(choice.value);
        
    };

    const handleDateRangeChange = async (startDate, endDate) => {
        //console.log("Start Date:", startDate);
        //console.log("End Date:", endDate);
        if (startDate!=null && endDate!=null) {
            const dateObj = new Date(startDate);
            const convertedTimeStart = dateObj.toISOString();
            console.log(convertedTimeStart);
            const dateObj2 = new Date(endDate);
            const convertedTimeEnd = dateObj2.toISOString();
            console.log(convertedTimeEnd);
            const charts = await fetchChartData(kpiList, subPageSelected, convertedTimeStart,convertedTimeEnd)
            setCharts(charts);
            setTimeStart(convertedTimeStart);
            setTimeEnd(convertedTimeEnd);

        }
      };
      const handleDateRangeChangeCompareDates = async (startDate, endDate) => {
        //console.log(charts[0].props.children.props.data.datasets[0]);
        //console.log(kpiList);
        
        if (startDate!=null && endDate!=null) {
            const promises = []; // Array to hold the promises
            const dateObj = new Date(startDate);
            const convertedTimeStart1 = dateObj.toISOString();
            let chartList= []
            const dateObj2 = new Date(endDate);
            const convertedTimeEnd1 = dateObj2.toISOString();
        
            
            Object.keys(kpiList).forEach(async (key, index) => {
                const value = kpiList[key];
                switch (value) {
                    case "Line Chart":
                        promises.push(
                        (async () => {
                        let chartData1 = []  
                        if (subPageSelected == "all_subpages") {
                            chartData1 = await getMoptS(key, convertedTimeStart1, convertedTimeEnd1);
                        }
                        else{
                            console.log("subpage")
                            console.log(subPageSelected)
                            chartData1 = await getMopT(key, subPageSelected, convertedTimeStart1, convertedTimeEnd1);
                        }      
                        const val1 = chartData1.map((entry) => entry._value);
                        let labelConvertedStartDate = new Date(convertedTimeStart1)
                        labelConvertedStartDate = labelConvertedStartDate.toLocaleDateString('en-US');
                        let labelConvertedSEndDate = new Date(convertedTimeEnd1)
                        labelConvertedSEndDate = labelConvertedSEndDate.toLocaleDateString('en-US');
                        let data1 = {
                        label: key + " " + labelConvertedStartDate + " - " + labelConvertedSEndDate,
                        backgroundColor: "rgb(0, 99, 132)",
                        borderColor: "rgb(0, 99, 132)",
                        data: val1,
                        }
                        let chartData2 = []
                        if (subPageSelected == "all_subpages") {
                            chartData2 = await getMoptS(key, timeStart, timeEnd);
                        }
                        else{
                            chartData2 = await getMopT(key, subPageSelected, timeStart, timeEnd);
                        }  
                        //let chartData2 = await getMopT(key, subPageSelected, timeStart, timeEnd);
                        let labelStartDate = new Date(timeStart)
                        labelStartDate = labelStartDate.toLocaleDateString('en-US');
                        let labelEndDate = new Date(timeEnd)
                        labelEndDate = labelEndDate.toLocaleDateString('en-US');
                        const val2 = chartData2.map((entry) => entry._value);
                        let data2 = {
                        label: key + " " + labelStartDate + " - " + labelEndDate,
                        backgroundColor: "rgb(255, 99, 132)",
                        borderColor: "rgb(255, 99, 132)",
                        data: val2,
                        }
                        let datasetsConc = [data2, data1];
                        const labels = chartData1.map((entry) => {
                            const date = new Date(entry._time);
                            return date.toLocaleDateString('en-US');
                        });
                        let data = {
                            labels: labels,
                            datasets: datasetsConc,
                          };
                        //let chartData2 = charts[index].props.children.props.data.datasets.push(data);
                        const newChart = charts[index].props.children.props.data.datasets
                        console.log("newChart");
                        console.log(charts[index].props.children.props.data.datasets[0]);
                        console.log(data);
                        console.log(newChart);
                        chartList.push(<div><Line data={data} width={70} height={40} key={key}/></div>);
                        })()
                        );
                        break;
                        case "Average":
                            promises.push(
                              (async () => {
                                let average = await getMmB(key);
                                const valAvg = average._value;
                                console.log(valAvg);
                                chartList.push(<div><p>{valAvg}</p></div>);
                              })()
                            );
                            break;
                    
                          default:
                            break;
                        
          }
        });
        await Promise.all(promises);
        console.log("charts");
        //console.log(charts);
        setCharts(chartList);
        setComparedTimeStart(convertedTimeStart1);
        setComparedTimeEnd(convertedTimeEnd1);
    }
    };

    useEffect(() => {
        getDashboard();
        getEvents();
        getSubPages();
    }, []);
    

    return (
        <div>
            <h1>Dashboard Page</h1>
            <h3>Selected Date:</h3>
            <DateRangePicker  onDateRangeChange={handleDateRangeChange}/>
            <h3>Compare Date:</h3>
            <DateRangePicker  onDateRangeChange={handleDateRangeChangeCompareDates}/>
            <Select options={events} defaultValue={{ value: "Analytica", label: "Analytica" }} value={selectedEvent} onChange={setSelectedEvent}  />
            <Select options={subPages} defaultValue={{ value: "all_subpages", label: "all subpages" }} onChange={(choice) => onSubPageSelection(choice)}/>
            <button onClick={getMmB}>Get MMB</button>
            <button onClick={getMmpB}>Get MMPB</button>
            <button onClick={getMmpT}>Get MMPT</button>
            <button onClick={getMopT}>Get MOPT</button>
            <div>
            {charts}
            </div>
            <div style={{ width: 650, textAlign: "center" }}>
            </div>

            
        </div>
        
    )

}

export default Dashboard;