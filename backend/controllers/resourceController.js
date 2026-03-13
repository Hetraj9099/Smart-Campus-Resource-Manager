const resourceModel = require('../models/resourceModel');

async function fetchResources(request, response) {
  try {
    const resources = await resourceModel.getAllResources();
    response.json(resources);
  } catch (error) {
    response.status(500).json({ message: 'Failed to fetch resources.' });
  }
}

async function createResource(request, response) {
  const { name, type, location, available } = request.body;

  if (!name || !type || !location) {
    response.status(400).json({ message: 'Name, type, and location are required.' });
    return;
  }

  try {
    const resource = await resourceModel.addResource({
      name,
      type,
      location,
      available: available !== undefined ? available : true
    });

    response.status(201).json(resource);
  } catch (error) {
    response.status(500).json({ message: 'Failed to add resource.' });
  }
}

module.exports = {
  fetchResources,
  createResource
};
