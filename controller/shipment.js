var async = require('async');
var shipmentModel = require('.././model/shipment.js');
var containerController = require('.././controller/container.js');
var controller = {
   saveShipment: function (data, callback) {
      var newShipment = {}
      async.waterfall([
         function (callback) {
            //create the shipment
            controller.createShipment(data, callback);
         },
         function (shipment, callback) {
            newShipment = shipment;
            //check for containers
            containerController.checkContainers(data, callback);
         },
         function (containers, callback) {
            if (containers.length > 0) {
               //add shipments to the existing container
               containerController.addNewShipmentToExistingContainer(containers[0], newShipment, callback);
            } else {
               //create new container and add shipment to it
               var container = {
                  weightFilled: newShipment.weight,
                  volumeFilled: newShipment.volume,
                  shipments: [newShipment._id]
               };
               containerController.saveContainer(container, callback);
            }
         },
         function (containerData, callback) {
            //add conatiner ref in shipment
            controller.createContainerReferenceInShipment(containerData, newShipment, callback);
         }
      ], callback)
   },
   createShipment(data, callback) {
      var shipmentData = new shipmentModel(data);
      shipmentData.save(shipmentData, callback);
   },
   createContainerReferenceInShipment: function (containerData, newShipment, callback) {
      shipmentModel.findOneAndUpdate({
         _id: newShipment._id
      }, {
         container: containerData._id
      }).exec(callback);
   },
   checkContainerStatus: function (data, callback) {
      shipmentModel.findOne({
         _id: data.id
      }).populate('container', 'status').exec(function (err, data) {
         if (data.container.status != "draft") {
            callback("Only containers with Draft status can be deleted", null);
         } else {
            callback(err, data)
         }
      });
   },
   removeShipment: function (data, callback) {
      shipmentModel.remove({
         _id: data.id
      }).exec(callback)
   },
   getShipments: function (data, callback) {
      shipmentModel.find({}).exec(callback);
   },
   deleteShipment: function (data, callback) {
      var containerDetails = {};
      async.waterfall([
         function (callback) {
            controller.checkContainerStatus(data, callback);
         },
         function (shipment, callback) {
            containerController.removeShipmentFromContainer(shipment, callback);
         },
         function (container, callback) {
            containerDetails = container;
            controller.removeShipment(data, callback);
         },
         function (res, callback) {
            containerController.deleteIfEmptyContainer(containerDetails, callback);
         },
         function (isContainerEmpty, wcallback) {
            if (!isContainerEmpty) { //container is not empty 
               controller.checkForReshufflingShipments(containerDetails, wcallback);
            } else {
               console.log("container is empty");
               callback(null, {})
            }
         }
      ], callback);
   },
   checkForReshufflingShipments: function (data, callback) {
      async.waterfall([
         function (callback) {
            //find the container with the least volume and weight   
            containerController.findContainerWithLeastWeightAndVol(data, callback);
         },
         function (foundLeast, wcallback) {
            if (foundLeast) {
               if (foundLeast._id.toString() == data._id) { //if the foundLeast container is the same as the one from which the shipment was deleted
                  //Do nothing
                  console.log("least found is the same as the container")
                  callback(null, {})
               } else {
                  //move the shipments from that container to the container from which shipment was deleted.
                  controller.reshuffleShipments(foundLeast, wcallback);
               }
            } else {
               //Do nothing
               console.log("No least found")
               callback(null, {});
            }
         }
      ], callback)
   },
   reshuffleShipments: function (leastContainer, callback) {
      var shipments = [...leastContainer.shipments];
      async.each(shipments, function (item, cb) {
         var newShipment = item;
         async.waterfall([
            function (callback) {
               containerController.checkContainers(newShipment, callback);
            },
            function (containers, wcallback) {
               if (containers.length > 0) {
                  console.log("reshuffling will happen");
                  containerController.addNewShipmentToExistingContainer(containers[0], newShipment, wcallback);
               } else {
                  //Do nothing
                  console.log("No containers found")
                  callback(null, {});
               }
            },
            function (containerData, callback) {
               controller.createContainerReferenceInShipment(containerData, newShipment, callback);
            },
            function (res, callback) {
               containerController.removeShipmentFromContainer(newShipment, callback);
            }
         ], cb);
      }, function (err, data) {
         containerController.deleteIfEmptyContainer(leastContainer, callback);
      });

   }
}
module.exports = controller;