var express = require('express');
var router = express.Router();
var containerController = require('.././controller/container.js');
router.get('/getContainers', function (req, res) {
    containerController.getContainers(req.body,res.callback);
});
router.put('/updateContainerStatus', function (req, res) {
    if (req.body) {
        containerController.updateContainerStatus(req.body,res.callback);
    } else {
        res.callback("Something went wrong", null);
    }
});
module.exports = router;