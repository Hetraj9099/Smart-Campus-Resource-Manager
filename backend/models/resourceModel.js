const db = require('../db');

function getAllResources() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM resources ORDER BY id DESC', [], (error, rows) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(rows);
    });
  });
}

function addResource(resource) {
  const { name, type, location, available } = resource;
  const availabilityValue = available ? 1 : 0;

  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO resources (name, type, location, available) VALUES (?, ?, ?, ?)',
      [name, type, location, availabilityValue],
      function handleInsert(error) {
        if (error) {
          reject(error);
          return;
        }

        resolve({
          id: this.lastID,
          name,
          type,
          location,
          available: availabilityValue
        });
      }
    );
  });
}

module.exports = {
  getAllResources,
  addResource
};
