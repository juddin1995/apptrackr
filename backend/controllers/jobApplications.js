const express = require('express');
const verifyToken = require('../middleware/checkToken');
const jobApp = require('../models/jobApplication');
const router = express.Router();

// ========== Public Routes ===========

// ========= Protected Routes =========

module.exports = {
  index,
  // show,
  // create,
  // update,
  // createComment,
};

async function index(req, res) {
  try {
    const jobApps = await jobApp.find().populate('user_id', 'name');
    res.status(200).json(jobApps);
  } catch (error) {
    res.status(500).json(error);
  }
};