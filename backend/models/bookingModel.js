const db = require('../db');

function checkAvailability(resourceId, timeSlot) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT COUNT(*) AS bookingCount
      FROM bookings
      WHERE resource_id = ? AND time_slot = ? AND status = 'confirmed'
    `;

    db.get(query, [resourceId, timeSlot], (error, row) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(row.bookingCount === 0);
    });
  });
}

function createBooking(booking) {
  const { resource_id, user_name, time_slot, status } = booking;
  const bookingStatus = status || 'confirmed';

  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO bookings (resource_id, user_name, time_slot, status) VALUES (?, ?, ?, ?)',
      [resource_id, user_name, time_slot, bookingStatus],
      function handleInsert(error) {
        if (error) {
          reject(error);
          return;
        }

        db.get(
          'SELECT * FROM bookings WHERE id = ?',
          [this.lastID],
          (selectError, row) => {
            if (selectError) {
              reject(selectError);
              return;
            }

            resolve(row);
          }
        );
      }
    );
  });
}

function getAllBookings() {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT
        bookings.id,
        bookings.resource_id,
        resources.name AS resource_name,
        resources.type AS resource_type,
        bookings.user_name,
        bookings.time_slot,
        bookings.status,
        bookings.created_at
      FROM bookings
      INNER JOIN resources ON resources.id = bookings.resource_id
      ORDER BY bookings.id DESC
    `;

    db.all(query, [], (error, rows) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(rows);
    });
  });
}

module.exports = {
  createBooking,
  getAllBookings,
  checkAvailability
};
