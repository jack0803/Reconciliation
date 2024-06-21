const express = require('express');
const router = express.Router();
const contactController = require('../controller/contactController'); 

router.post('/identify', contactController.identifyContact);

module.exports = router;
