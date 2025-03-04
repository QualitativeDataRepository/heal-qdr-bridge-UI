const https = require('https');

/**
 * Upload JSON metadata to dataverse instance, creating a new project
 * @param {object} json - Dataverse JSON file
 * @param {string} api - API key for Dataverse instance
 * @returns {Promise} A promise that resolves with the response or rejects with an error
 */
const uploadDataverse = (json, api) => {
  return new Promise((resolve, reject) => {
    
    const jsonObj = typeof json === 'string' ? JSON.parse(json) : json;
    const post = JSON.stringify(jsonObj);
    const contentLength = Buffer.from(post).length;
    
    const options = {
      host: "data.stage.qdr.org",
      port: 443,
      path: "/api/dataverses/heal/datasets",
      method: "POST",
      headers: {
        'X-Dataverse-key': api,
        'Content-Type': 'application/json',
        'Content-Length': contentLength
      }
    };
    
    const req = https.request(options, (resp) => {
      let data = '';
    
      resp.on('data', (chunk) => {
        data += chunk;
      });
    
      resp.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          if (resp.statusCode >= 200 && resp.statusCode < 300) {
            resolve(parsedData);
          } else {
            console.error('API Error Response:', parsedData);
            reject(new Error(`API Error: ${JSON.stringify(parsedData)}`));
          }
        } catch (e) {
          console.error('Error parsing response:', e);
          reject(new Error(`Invalid response: ${data}`));
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('Request error:', error);
      reject(error);
    });
    
    req.write(post);
    req.end();
  });
};

module.exports = uploadDataverse;