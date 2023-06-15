import React, { useState } from "react";
import { useHistory } from "react-router-dom";

const Workspace = () => {

    const [dashboards, setDashboards] = useState([]);

    const getDashboards = async () => {
        const response = await fetch(
            "http://localhost:5555/dashboards/",
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
}

return (
    <div>
        <h1>Workspace</h1>
        <button>New Dashboard</button>
    </div>
)

}

export default Workspace;