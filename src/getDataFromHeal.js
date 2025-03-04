const https = require('https');

/**
 * Get JSON metadata from heal, to create new project in dataverse
 * @param {string} id - _hdp_uid to pull data from heal data platform
 * @returns {Promise} A promise that resolves with the response or rejects with an error
 */
const getDataFromHeal = (id) => {
  return new Promise((resolve, reject) => {
    
    const options = {
      host: "healdata.org",
      port: 443,
      path: `/mds/metadata/${id}`,
      method: "GET",
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
            if (parsedData.gen3_discovery.study_metadata) {
                resolve(parsedData.gen3_discovery.study_metadata);
              } else {
                reject(new Error("study_metadata not found in response"));
              }
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
    
    req.end();
  });
};

module.exports = getDataFromHeal;