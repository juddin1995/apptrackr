const express = require('express');
const router = express.Router();
const jobAppCtrl = require('../controllers/jobApps');

// All paths start with '/api/jobApplications'
router.get('/', jobAppCtrl.index);

router.post('/', jobAppCtrl.create);

router.put('/:id', jobAppCtrl.updateStatus);

module.exports = router;