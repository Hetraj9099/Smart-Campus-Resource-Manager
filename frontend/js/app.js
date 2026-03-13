const apiBaseUrl = 'http://localhost:3000';
const resourceList = document.getElementById('resourceList');
const resourceMessage = document.getElementById('resourceMessage');
const refreshButton = document.getElementById('refreshButton');

// Render the resources as simple cards for students.
function renderResources(resources) {
  resourceList.innerHTML = '';

  if (!resources.length) {
    resourceMessage.textContent = 'No resources available yet.';
    return;
  }

  resourceMessage.textContent = '';

  resources.forEach((resource) => {
    const card = document.createElement('article');
    card.className = 'card';

    const availabilityText = resource.available ? 'Available' : 'Unavailable';

    card.innerHTML = `
      <h3>${resource.name}</h3>
      <p><strong>Type:</strong> ${resource.type}</p>
      <p><strong>Location:</strong> ${resource.location}</p>
      <p><strong>Status:</strong> ${availabilityText}</p>
    `;

    resourceList.appendChild(card);
  });
}

// Fetch all resources from the backend API.
async function loadResources() {
  resourceMessage.textContent = 'Loading resources...';

  try {
    const response = await fetch(`${apiBaseUrl}/resources`);
    const resources = await response.json();
    renderResources(resources);
  } catch (error) {
    resourceMessage.textContent = 'Unable to load resources right now.';
  }
}

refreshButton.addEventListener('click', loadResources);

loadResources();
