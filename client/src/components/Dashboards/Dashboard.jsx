import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const Dashboard = () => {

    const [comparison, setComparison] = useState("");
    const [dataSource, setDataSource] = useState("");
    const [selectedVisualization, setSelectedVisualization] = useState("");
    const {id} = useParams();

    const history = useHistory();

    const getDataSource = async () => {
        const response = await fetch(
            "http://localhost:5555/queries/aE"
        )
    }

    return (
        <div>
            <h1>Dashboard Page</h1>
        </div>
    )

}

export default Dashboard;