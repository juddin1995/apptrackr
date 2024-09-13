const express = require('express');
const router = express.Router();
const jobAppCtrl = require('../controllers/jobApplications');

// All paths start with '/api/jobApplications'
router.get('/', jobAppCtrl.index);