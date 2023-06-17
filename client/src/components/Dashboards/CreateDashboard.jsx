import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const CreateDashboard = () => {

    const [kpiList, setKpiList] = useState([]);
    const [dashboardName, setDashboardName] = useState("");
    const [addedKPIs, setAddedKPIs] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');

    useEffect(() => {
        getKpiList();
    }, []);

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

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

    const createDashboard = () => {

    }


    return (
        <div>
            <h1>Create Dashboard</h1>
            <div className="left-column">
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
                            {kpi.kpiName}
                        </div>
                    )
                }
            </div>
            <div className="right-column">
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
            </div>
        </div>
    )
}

export default CreateDashboard;