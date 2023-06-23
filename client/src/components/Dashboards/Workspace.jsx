import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import '../../styling/gstyles.css';
import plus from '../../resources/plus.svg'

const Workspace = () => {

    const [dashboards, setDashboards] = useState([]);
    const [selectedDashboards, setSelectedDashboards] = useState([]);
    const [sortOrder, setSortOrder] = useState({ attribute: 'dashboardName', ascending: true });

    const isDeleteButtonVisible = selectedDashboards.length > 0;

    const history = useHistory();

    useEffect(() => {
        getDashboards();
    }, []);

    // Function that gets all dashboards from the MongoDB and saves them in the dashboards useState
    const getDashboards = async () => {
        const response = await fetch(
            "http://localhost:5555/dashboards/getDashboards",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + window.localStorage.getItem("token"),
                },
            }
        )
        const jsonResponse = await response.json();
        setDashboards(jsonResponse);
    }

    // Function that deletes selected dashboards from the database
    const deleteDashboards = async () => {
        for (let i = 0; i < selectedDashboards.length; i++) {
            const id = selectedDashboards[i];
            await fetch(
                "http://localhost:5555/dashboards/" + id,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + window.localStorage.getItem("token"),
                    },
                }
            );
            console.log("Deleted Dashboard: " + selectedDashboards[i]);
        }
        setSelectedDashboards([]);
        getDashboards();
    }

    // Function that adds selected dashboards to selectedDashboards state variable
    const handleSelectedDashboards = (dashboardID) => {
        const isSelected = selectedDashboards.includes(dashboardID);
        if (isSelected) {
            setSelectedDashboards(selectedDashboards.filter((id) => id !== dashboardID));
        } else {
            setSelectedDashboards([...selectedDashboards, dashboardID])
        }
        getDashboards();
    }

    const handleSelectAll = () => {
        if (selectedDashboards.length === dashboards.length) {
            // If all dashboards are selected, deselect all dashboards
            setSelectedDashboards([]);
        } else {
            // Select all dashboards
            const allDashboards = dashboards.map((dashboard) => dashboard._id);
            setSelectedDashboards(allDashboards);
        }
    }

    const handleSort = (attribute) => {
        let ascending = true;

        if (sortOrder.attribute === attribute) {
            ascending = !sortOrder.ascending;
        }

        setSortOrder({ attribute, ascending });
    }

    const compareValues = (valueA, valueB) => {
        // Handle undefined values
        if (typeof valueA === 'undefined') return -1;
        if (typeof valueB === 'undefined') return 1;

        // Compare the values based on sort order and attribute type
        if (sortOrder.ascending) {
            return valueA.localeCompare(valueB);
        } else {
            return valueB.localeCompare(valueA);
        }
    };

    const sortedDashboards = dashboards.sort((a, b) => {
        const valueA = a[sortOrder.attribute];
        const valueB = b[sortOrder.attribute];

        return compareValues(valueA, valueB);
    })

    const renderEntries = () => {
        return (
            <div className="page-body">
                <div className="page-header-container flex">
                    <div className="page-header-content flex">
                        <h1>Dashboards</h1>
                        <button className="icon-button" onClick={() => history.push("/CreateDashboard/")}>
                            <img src={plus} alt="" />
                            <p>New Dashboard</p>
                        </button>
                    </div>
                    <div className="workspace-table-head flex">
                        <div className="workspace-checkbox flex">
                            <input
                                type="checkbox"
                                checked={selectedDashboards.length === dashboards.length}
                                onChange={handleSelectAll}
                            />
                        </div>
                        <div className="workspace-dashboard-name">
                            <button onClick={() => handleSort('dashboardName')}>Name {sortOrder.attribute === 'dashboardName' && (sortOrder.ascending ? '▼' : '▲')}</button>
                        </div>
                        <div className="workspace-creation-date">
                            <button onClick={() => handleSort('creationDate')}>Date added {sortOrder.attribute === 'creationDate' && (sortOrder.ascending ? '▼' : '▲')}</button>
                        </div>
                        <div className="workspace-property-name">
                            <button onClick={() => handleSort('dataSource')}>Property(Events) {sortOrder.attribute === 'dataSource' && (sortOrder.ascending ? '▼' : '▲')}</button>
                        </div>
                        <div className="workspace-open-button">
                        </div>
                    </div>
                </div>
                {isDeleteButtonVisible && (
                    <button onClick={() => deleteDashboards()}>Delete Selected</button>
                )}
                <div className="dashboard-list-container">
                    {
                        sortedDashboards.map(dashboard =>
                            // ####### Use HTML Grid to display list items in a table --> Better alignments
                            <div className="workspace-table-head dashboard-list-item flex" key={dashboard._id}>
                                <div className="workspace-checkbox flex">
                                    <input
                                        type="checkbox"
                                        checked={selectedDashboards.includes(dashboard._id)}
                                        onChange={() => handleSelectedDashboards(dashboard._id)}
                                    />
                                </div>
                                <div className="workspace-dashboard-name flex">
                                    {dashboard.dashboardName}
                                </div>
                                <div className="workspace-creation-date flex">
                                    {dashboard.creationDate}
                                </div>
                                <div className="workspace-property-name flex">
                                    {dashboard.dataSource}
                                </div>
                                <div className="workspace-open-button flex">
                                    <button className="menu-button" onClick={() => history.push("./dashboards/" + dashboard._id)}>
                                        Open
                                    </button>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        )
    }
    return <div>{renderEntries()}</div>;
};

export default Workspace;