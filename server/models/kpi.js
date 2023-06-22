import mongoose from "mongoose";

const kpiSchema = mongoose.Schema({
    kpiName: {
        type: String,
        unique: true,
        required: true
    },
    influxIdentifier: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    visualizations: {
        type:Object, default: {}
    }
})

const KPI = mongoose.model("KPI", kpiSchema);

export default KPI;