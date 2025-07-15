const express = require('express');
const Job = require('../models/Job');

const router = express.Router();

// Get all active jobs (public)
router.get('/public', async (req, res) => {
  try {
    const jobs = await Job.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({
      success: true,
      jobs
    });
  } catch (error) {
    console.error('Error fetching public jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching jobs',
      error: error.message
    });
  }
});

// Get all jobs (admin only)
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      jobs
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching jobs',
      error: error.message
    });
  }
});

// Get single job
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    res.json({
      success: true,
      job
    });
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching job',
      error: error.message
    });
  }
});

// Create new job (admin only)
router.post('/', async (req, res) => {
  try {
    const {
      title,
      department,
      location,
      type,
      description,
      requirements,
      responsibilities,
      salary,
      experience,
      benefits,
      createdBy
    } = req.body;

    const job = new Job({
      title,
      department,
      location,
      type,
      description,
      requirements,
      responsibilities,
      salary,
      experience,
      benefits,
      createdBy
    });

    await job.save();

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      job
    });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating job',
      error: error.message
    });
  }
});

// Update job (admin only)
router.put('/:id', async (req, res) => {
  try {
    const {
      title,
      department,
      location,
      type,
      description,
      requirements,
      responsibilities,
      salary,
      experience,
      benefits,
      isActive,
      updatedBy
    } = req.body;

    const job = await Job.findByIdAndUpdate(
      req.params.id,
      {
        title,
        department,
        location,
        type,
        description,
        requirements,
        responsibilities,
        salary,
        experience,
        benefits,
        isActive,
        updatedBy
      },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.json({
      success: true,
      message: 'Job updated successfully',
      job
    });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating job',
      error: error.message
    });
  }
});

// Delete job (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting job',
      error: error.message
    });
  }
});

module.exports = router;