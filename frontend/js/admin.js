const apiUrl = 'http://localhost:3000';
const resourceForm = document.getElementById('resourceForm');
const adminMessage = document.getElementById('adminMessage');
const adminResourceList = document.getElementById('adminResourceList');

// Display all current resources for the admin view.
function renderAdminResources(resources) {
  adminResourceList.innerHTML = '';

  if (!resources.length) {
    adminResourceList.innerHTML = '<p>No resources added yet.</p>';
    return;
  }

  resources.forEach((resource) => {
    const item = document.createElement('div');
    item.className = 'list-item';
    item.innerHTML = `
      <h3>${resource.name}</h3>
      <p><strong>Type:</strong> ${resource.type}</p>
      <p><strong>Location:</strong> ${resource.location}</p>
      <p><strong>Status:</strong> ${resource.available ? 'Available' : 'Unavailable'}</p>
    `;
    adminResourceList.appendChild(item);
  });
}

// Load resources so the admin can see updates immediately.
async function loadAdminResources() {
  try {
    const response = await fetch(`${apiUrl}/resources`);
    const resources = await response.json();
    renderAdminResources(resources);
  } catch (error) {
    adminMessage.textContent = 'Could not load resources.';
  }
}

// Send a new resource to the backend API.
resourceForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  adminMessage.textContent = 'Adding resource...';

  const payload = {
    name: document.getElementById('resourceName').value.trim(),
    type: document.getElementById('resourceType').value.trim(),
    location: document.getElementById('resourceLocation').value.trim(),
    available: document.getElementById('resourceAvailable').checked
  };

  try {
    const response = await fetch(`${apiUrl}/resources`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      adminMessage.textContent = result.message || 'Could not add resource.';
      return;
    }

    adminMessage.textContent = `Resource added: ${result.name}`;
    resourceForm.reset();
    document.getElementById('resourceAvailable').checked = true;
    await loadAdminResources();
  } catch (error) {
    adminMessage.textContent = 'Request failed.';
  }
});

loadAdminResources();
