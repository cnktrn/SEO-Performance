import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

const Dashboard = () => {

    const {id} = useParams();

    return (
        <div>
            <h1>Dashboard Page</h1>
        </div>
    )

}

export default Dashboard;