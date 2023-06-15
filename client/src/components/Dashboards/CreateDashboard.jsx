import { useState } from "react";


const CreateDashboard = () => {

    const [kpiList, setKpiList] = useState();
    const [dashboardName, setDashboardName] = useState("");
    const [selectedOption, setSelectedOption] = useState('');

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

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
                <h3>Available SEO Metrics</h3>
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