import { useState } from "react";

const CreateDashboard = () => {

    const [kpiList, setKpiList] = useState();
    const [dashboardName, setDashboardName] = useState("");

    const getKpiList = async () => {
        const response = await fetch(
            ""
        )
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
            </div>
            <div className="right-column"></div>
        </div>
    )
}

export default CreateDashboard;