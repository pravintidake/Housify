const express = require('express');
const { getProperties, getPropertyBySlug } = require('../controllers/propertyController');
const { getProjects } = require('../controllers/projectController');
const { createInquiry } = require('../controllers/inquiryController');

const router = express.Router();

// Public property routes
router.get('/properties', getProperties);
router.get('/properties/:slug', getPropertyBySlug);

// Public projects route
router.get('/projects', getProjects);

// Public inquiry route
router.post('/inquiries', createInquiry);

module.exports = router;
