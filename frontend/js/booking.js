const apiRoot = 'http://localhost:3000';
const bookingForm = document.getElementById('bookingForm');
const resourceSelect = document.getElementById('resourceSelect');
const bookingMessage = document.getElementById('bookingMessage');
const bookingList = document.getElementById('bookingList');

// Fill the dropdown with resources that can be booked.
function renderResourceOptions(resources) {
  resourceSelect.innerHTML = '';

  if (!resources.length) {
    const option = document.createElement('option');
    option.textContent = 'No resources available';
    option.value = '';
    resourceSelect.appendChild(option);
    return;
  }

  resources.forEach((resource) => {
    const option = document.createElement('option');
    option.value = resource.id;
    option.textContent = `${resource.name} - ${resource.location}`;
    resourceSelect.appendChild(option);
  });
}

// Show recent bookings so users can see activity.
function renderBookings(bookings) {
  bookingList.innerHTML = '';

  if (!bookings.length) {
    bookingList.innerHTML = '<p>No bookings found.</p>';
    return;
  }

  bookings.forEach((booking) => {
    const item = document.createElement('div');
    item.className = 'list-item';
    item.innerHTML = `
      <h3>${booking.resource_name}</h3>
      <p><strong>User:</strong> ${booking.user_name}</p>
      <p><strong>Time:</strong> ${booking.time_slot}</p>
      <p><strong>Status:</strong> ${booking.status}</p>
    `;
    bookingList.appendChild(item);
  });
}

// Load resources for the booking form.
async function loadResources() {
  try {
    const response = await fetch(`${apiRoot}/resources`);
    const resources = await response.json();
    renderResourceOptions(resources.filter((resource) => resource.available));
  } catch (error) {
    bookingMessage.textContent = 'Could not load resources.';
  }
}

// Load current bookings from the backend.
async function loadBookings() {
  try {
    const response = await fetch(`${apiRoot}/bookings`);
    const bookings = await response.json();
    renderBookings(bookings);
  } catch (error) {
    bookingList.innerHTML = '<p>Could not load bookings.</p>';
  }
}

// Submit the booking form to the backend API.
bookingForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  bookingMessage.textContent = 'Saving booking...';

  const payload = {
    resource_id: Number(resourceSelect.value),
    user_name: document.getElementById('userName').value.trim(),
    time_slot: document.getElementById('timeSlot').value.trim()
  };

  try {
    const response = await fetch(`${apiRoot}/book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      bookingMessage.textContent = result.message || 'Booking failed.';
      return;
    }

    bookingMessage.textContent = 'Booking created successfully.';
    bookingForm.reset();
    await loadBookings();
  } catch (error) {
    bookingMessage.textContent = 'Booking request failed.';
  }
});

loadResources();
loadBookings();
