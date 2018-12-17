var async = require('async');
var containerModel = require('.././model/container.js');
var shipmentController = require('.././controller/shipment.js');
var controller = {
   checkContainers: function (data, callback) {
      containerModel.aggregate([{
         $match: {
            status: "draft"
         }
      }, {
         $project: {
            remainingWeight: {
               $subtract: ["$weightLimit", "$weightFilled"]
            },
            remainingVolume: {
               $subtract: ["$volumeLimit", "$volumeFilled"]
            }
         }
      }, {
         $match: {
            remainingWeight: {
               $gte: data.weight
            },
            remainingVolume: {
               $gte: data.volume
            },
         }
      }, {
         $limit: 1
      }]).exec(callback)
   },
   addNewShipmentToExistingContainer: function (containerToFill, newShipment, callback) {
      containerModel.findOneAndUpdate({
         _id: containerToFill._id
      }, {
         $inc: {
            volumeFilled: newShipment.volume,
            weightFilled: newShipment.weight
         },
         $push: {
            shipments: newShipment._id
         }
      }, {
         new: true
      }).exec(callback);
   },
   saveContainer: function (data, callback) {
      var containerToSave = new containerModel(data);
      containerToSave.save(callback);
   },
   removeShipmentFromContainer: function (shipment, callback) {
      containerModel.findOneAndUpdate({
         _id: shipment.container
      }, {
         $pullAll: {
            shipments: [shipment._id]
         },
         $inc: {
            weightFilled: shipment.weight * -1,
            volumeFilled: shipment.volume * -1
         }
      }, {
         new: true
      }).exec(callback);
   },
   deleteIfEmptyContainer: function (data, callback) {
      containerModel.findOne({
         _id: data._id
      }, {
         shipments: 1
      }).exec(function (err, container) {
         if (container.shipments.length <= 0) {
            controller.deleteContainer(container, callback);
         } else {
            callback(err, null);
         }
      })
   },
   deleteContainer: function (data, callback) {
      containerModel.remove({
         _id: data._id
      }).exec(callback);
   },
   getContainers: function (data, callback) {
      containerModel.find({}).exec(callback);
   },
   updateContainerStatus: function (data, callback) {
      containerModel.update({
         _id: data.updateFormId
      }, {
         status: data.statusNow
      }).exec(callback);
   },
   findContainerWithLeastWeightAndVol: function (data, callback) {
      async.parallel({
         minWeightFilled: function (callback) {
            containerModel.aggregate([{
               $sort: {
                  weightFilled: 1
               }
            }, {
               $limit: 1
            }]).exec(callback)
         },
         minVolumeFilled: function (callback) {
            containerModel.aggregate([{
               $sort: {
                  volumeFilled: 1
               }
            }, {
               $limit: 1
            }]).exec(callback)
         }
      }, function (err, res) {
         //if least weight and volume are of the same container
         if (res.minVolumeFilled.length > 0 && res.minWeightFilled.length > 0 && res.minVolumeFilled[0]._id.toString() == res.minWeightFilled[0]._id.toString()) {
            containerModel.populate(res.minVolumeFilled[0], {
               path: "shipments"
            }, callback)
         } else {
            callback(err, null);
         }
      })
   }
}
module.exports = controller;