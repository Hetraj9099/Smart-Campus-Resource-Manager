const express = require('express');
const { bookResource, fetchBookings } = require('../controllers/bookingController');

const router = express.Router();

router.post('/book', bookResource);
router.get('/bookings', fetchBookings);

<<<<<<< HEAD
module.exports = router;
=======
module.exports = router;
>>>>>>> 99d1efe27e2738d2beadc126c449eb95d5b42c27
