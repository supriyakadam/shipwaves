var mongoose = require('mongoose')
var Schema = mongoose.Schema
containerSchema = new Schema({
    volumeLimit: {
        type: Number,
        default: 25000000
    },
    weightLimit: {
        type: Number,
        default: 3000
    },
    volumeFilled: {
        type: Number,
        required: true,
        default: 0
    },
    weightFilled: {
        type: Number,
        required: true,
        default: 0
    },
    status: {
        type: String,
        enum: ["draft", "transit", "completed"],
        default: "draft"
    },
    shipments: [{
        type: Schema.Types.ObjectId,
        ref: "shipment",
        default: []
    }]
});
var container = mongoose.model('container', containerSchema);
module.exports = container;