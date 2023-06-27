import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const CreateDashboard = () => {

    const [kpiList, setKpiList] = useState([]);
    const [dashboard, setDashboard] = useState();
    const [dashboardName, setDashboardName] = useState("");
    const [addedKPIs, setAddedKPIs] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const [dataSource, setDataSource] = ("");

    const { id } = useParams();

    const history = useHistory();

    useEffect(() => {
        getKpiList();
    }, []);

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
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
        setDashboard(jsonResponse);
    }

    const getKpiList = async () => {
        const response = await fetch(
            "http://localhost:5555/kpis/getKPIs",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + window.localStorage.getItem("token"),
                },
            }
        )

        const jsonResponse = await response.json();
        setKpiList(jsonResponse);
    }

    const createDashboard = async (e) => {
        e.preventDefault();

        await fetch(
            "http://localhost:5555/dashboards/createDashboard",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + window.localStorage.getItem("token"),
                },
                body: JSON.stringify({
                    dashboardName: dashboardName,
                    dataSource: "Placeholder",
                    KPIs: addedKPIs,
                }),
            }
        );
    }

    // Logic that moves a KPI to the dashboard and deletes it in the list of available KPIs
    const addKPItoList = (e, kpi) => {
        e.preventDefault();
        const newKPIList = [...addedKPIs, kpi];
        const oldKPIList = kpiList.filter((item) => item._id !== kpi._id)
        setKpiList(oldKPIList);
        setAddedKPIs(newKPIList);
    }

    // Logic that deletes a KPI from the dashboard and puts it in the list of available KPIs
    const deleteKPIfromDashboard = (e, kpi) => {
        e.preventDefault();
        const newKPIList = [...kpiList, kpi];
        const oldKPILost = addedKPIs.filter((item) => item._id !== kpi._id);
        setKpiList(newKPIList);
        setAddedKPIs(oldKPILost);
    }

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(addedKPIs);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setAddedKPIs(items);
    }

    return (
        <div className="page-body">
            <div className="col-md-12 page-header-container">
                <div className="page-header-content flex">
                    <h1>Select Metrics for your Dashboard</h1>
                    <button className="icon-button" onClick={e => 
                        createDashboard(e)
                        // history.push(e"/CreateDashboard/")
                    }>
                        <img src="" alt="" />
                        <p>Save Dashboard</p>
                    </button>
                </div>
            </div>
            <div className="grid-row">
                <div className="col-md-6">
                    <button onClick={() => console.log(addedKPIs)}>CLICK</button>
                    <button onClick={() => console.log(kpiList)}>CLICK 2</button>
                    <h3>Name</h3>
                    <input
                        value={dashboardName}
                        type={"text"}
                        onChange={e => setDashboardName(e.target.value)}
                    />
                    <h3>Available SEO Metrics</h3>
                    {
                        kpiList.map(kpi =>
                            <div key={kpi._id}>
                                <div>
                                    {kpi.kpiName}
                                </div>
                                <div>
                                    <button onClick={e => addKPItoList(e, kpi)}>+</button>
                                </div>
                            </div>
                        )
                    }
                </div>
                <div className="col-md-6">
                    <h3>Data Source</h3>
                    <div className="dropdown-menu">
                        <select value={selectedOption} onChange={handleOptionChange}>
                            <option value="">Select an option</option>
                            <option value="option1">Option 1</option>
                            <option value="option2">Option 2</option>
                            <option value="option3">Option 3</option>
                        </select>
                    </div>
                    <h3>Your Dashboard</h3>
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="addedKPIs">
                            {(provided) => (
                                <ul {...provided.droppableProps} ref={provided.innerRef}>
                                    {addedKPIs.map((kpi, index) => (
                                        <Draggable key={kpi._id} draggableId={kpi._id} index={index}>
                                            {(provided) => (
                                                <li
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    {kpi.kpiName}
                                                    <button onClick={e => deleteKPIfromDashboard(e, kpi)}>–</button>
                                                </li>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </ul>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
            </div>
        </div>
    )
}

export default CreateDashboard;