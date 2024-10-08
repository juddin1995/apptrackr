const express = require('express');
const JobApp = require('../models/jobApplication');

// ========== Public Routes ===========

// ========= Protected Routes =========

module.exports = {
  index,
  create,
  delete: deleteJobApp,
  updateStatus
};

async function index(req, res) {
  try {
    const jobApps = await JobApp.find({ user: req.user._id });
    res.json(jobApps);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch job applications' });
  }
}

async function create(req, res) {
  try {
    req.body.user = req.user._id;
    req.body.notes = req.body.notes.trim() ?
        req.body.notes.split('\n').map((note) => ({content: note})) : [];
    const savedJobApp = await JobApp.create(req.body);
    res.status(201).json(savedJobApp);
  } catch (err) {
    console.error('Error creating job application:', err.message);
    res.status(500).json({ error: 'Failed to create job application' });
  }
}

async function deleteJobApp(req, res) {
  try {
    const jobAppId = req.params.id;
    await JobApp.findByIdAndDelete(jobAppId);
    res.json({ message: 'Job application deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete job application' });
  }
}

async function updateStatus(req, res) {
  try {
    const updatedJob = await JobApp.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch job applications' });
  }
}