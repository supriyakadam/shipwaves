var express = require('express');
var router = express.Router();
var shipmentController = require('.././controller/shipment.js');
router.get('/getShipments', function (req, res) {
   shipmentController.getShipments(req.body,res.callback);
});
router.post('/addShipments', function (req, res) {
   if (req.body) {
      shipmentController.saveShipment(req.body, res.callback);
   } else {
      res.callback("SOme err", null)
   }
});
router.delete('/deleteShipments:id', function (req, res) {
   if (req.params) {
      shipmentController.deleteShipment(req.params, res.callback);
   } else {
      res.callback("SOme err", null)
   }
});
module.exports = router;