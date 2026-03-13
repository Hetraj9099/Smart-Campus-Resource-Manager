const bookingModel = require('../models/bookingModel');

async function bookResource(request, response) {
  const { resource_id, user_name, time_slot } = request.body;

  if (!resource_id || !user_name || !time_slot) {
    response.status(400).json({ message: 'Resource, user name, and time slot are required.' });
    return;
  }

  try {
    const isAvailable = await bookingModel.checkAvailability(resource_id, time_slot);

    if (!isAvailable) {
      response.status(409).json({ message: 'This resource is already booked for the selected time slot.' });
      return;
    }

    const booking = await bookingModel.createBooking({
      resource_id,
      user_name,
      time_slot
    });

    response.status(201).json(booking);
  } catch (error) {
    response.status(500).json({ message: 'Failed to create booking.' });
  }
}

async function fetchBookings(request, response) {
  try {
    const bookings = await bookingModel.getAllBookings();
    response.json(bookings);
  } catch (error) {
    response.status(500).json({ message: 'Failed to fetch bookings.' });
  }
}

module.exports = {
  bookResource,
  fetchBookings
};
