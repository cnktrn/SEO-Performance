import KPI from "../models/kpi.js";

export const getKPIs = async (req,res) => {
    try {
        const KPIs = await KPI.find();
        res.status(200).json(KPIs);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getKPI = async (req, res) => {
    const id = req.body.id;
    try {
        const kpi = await KPI.findById(id);
        res.status(200).json(kpi);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createKPI = async (req,res) => {
    const kpi = req.body;

    const newKPI = new KPI(kpi)
    try {
        await newKPI.save();
        res.status(201).json(newKPI);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const updateKPI = async (req, res) => {
    const id = req.body.id;
    const kpi = req.body;
    try {
        const curKpi = await KPI.findById(id);
        const updatedKPI = await KPI.findByIdAndUpdate(id, kpi);
        res.status(200).json(updatedKPI);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const deleteDashboard = async (req, res) => {
    const id = req.body.id;
    try {
        const dashboard = await Dashboard.findById(id);
        if (dashboard.creator === req.username) {
            await Dashboard.findByIdAndDelete(id);
            res.status(200).json({message: "successfully deleted dashboard"});
        } else {
            res.status(401);
        }
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}
