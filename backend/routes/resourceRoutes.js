const express = require('express');
const { fetchResources, createResource } = require('../controllers/resourceController');

const router = express.Router();

router.get('/resources', fetchResources);
router.post('/resources', createResource);

module.exports = router;
