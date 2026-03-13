const express = require('express');
const { bookResource, fetchBookings } = require('../controllers/bookingController');

const router = express.Router();

router.post('/book', bookResource);
router.get('/bookings', fetchBookings);

module.exports = router;