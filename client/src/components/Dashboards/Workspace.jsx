import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

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
            <div>
                <div>
                    <button onClick={() => console.log(selectedDashboards)}>Click</button>
                    <div>
                        <h1>Dashboards</h1>
                        <button onClick={() => history.push("/CreateDashboard/")}>New Dashboard</button>
                    </div>
                    <div>
                        <div>
                            <input
                                type="checkbox"
                                checked={selectedDashboards.length === dashboards.length}
                                onChange={handleSelectAll}
                            />
                            <button onClick={() => handleSort('dashboardName')}>Name {sortOrder.attribute === 'dashboardName' && (sortOrder.ascending ? '▲' : '▼')}</button>
                            <button onClick={() => handleSort('creationDate')}>Date added {sortOrder.attribute === 'creationDate' && (sortOrder.ascending ? '▲' : '▼')}</button>
                            <button onClick={() => handleSort('dataSource')}>Fair {sortOrder.attribute === 'dataSource' && (sortOrder.ascending ? '▲' : '▼')}</button>
                        </div>
                    </div>
                </div>
                {isDeleteButtonVisible && (
                    <button onClick={() => deleteDashboards()}>Delete Selected</button>
                )}
                {
                    sortedDashboards.map(dashboard =>
                        <div key={dashboard._id}>
                            <input
                                type="checkbox"
                                checked={selectedDashboards.includes(dashboard._id)}
                                onChange={() => handleSelectedDashboards(dashboard._id)}
                            />
                            <p>{dashboard.dashboardName}</p>
                            <p>{dashboard.creationDate}</p>
                            <p>{dashboard.dataSource}</p>
                            <button onClick={() => history.push("./dashboards/" + dashboard._id)}>
                                Open
                            </button>
                        </div>
                    )
                }
            </div>
        )
    }
    return <div>{renderEntries()}</div>;
};

export default Workspace;