import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const Workspace = () => {

    const [dashboards, setDashboards] = useState([]);
    const [numDashboards, setNumDashboards] = useState(0);

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
        const count = jsonResponse.length;
        setNumDashboards(count);
        setDashboards(jsonResponse);
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
                    dashboardName: "Name Placeholder" + numDashboards,
                    dataSource: "Placeholder",
                }),
            }
        );
        getDashboards();
        history.push("/CreateDashboard/")
    }

    const deleteDashboard = async (dashboardID) => {
        await fetch(
            "http://localhost:5555/dashboards" + dashboardID,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + window.localStorage.getItem("token"),
                },
            }
        );
        getDashboards();
    }

    return (
        <div>
            <h1>Workspace</h1>
            <button onClick={e => { createDashboard(e) }}>New Dashboard</button>

            {
                dashboards.map(dashboard =>
                    <div>
                        <button onClick={() => history.push("./dashboards/" + dashboard._id)} key={dashboard._id}>
                            {dashboard.dashboardName}
                        </button>
                    </div>
                )
            }
        </div>
    )

}

export default Workspace;