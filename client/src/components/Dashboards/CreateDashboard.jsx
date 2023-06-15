import { useState } from "react";

const CreateDashboard = () => {

    const [kpiList, setKpiList] = useState();

    const getKpiList = async () => {
        const response = await fetch (
            ""
        )
    }
    

    return (
        <div>
            <h1>Create Dashboard</h1>
        </div>
    )
}

export default CreateDashboard;