var mongoose = require('mongoose');
var Schema = mongoose.Schema
shipmentSchema = new Schema({
    weight: {
        type: Number,
        required: true
    },
    volume: {
        type: Number,
        required: true
    },
    container: {
        type: Schema.Types.ObjectId,
        ref: "container"
    }
});
var shipment = mongoose.model('shipment', shipmentSchema);
module.exports = shipment;