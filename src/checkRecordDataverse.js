const https = require('https');

/**
 * Fetch dataset search results from QDR Dataverse API
 * @param {string} query - Search query
 * @returns {Promise<number>} A promise that resolves with the total count of datasets matching the query
 */
const checkRecordDataverse = (query, apiKey) => {
  return new Promise((resolve, reject) => {
    const encodedQuery = encodeURIComponent(query);
    const options = {
      host: "data.stage.qdr.org",
      port: 443,
      path: `/api/search?q=title:"${encodedQuery}"&type=dataset&key=${apiKey}`,
      method: "GET",
    };

    console.log(options)

    const req = https.request(options, (resp) => {
      let data = '';

      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          if (resp.statusCode === 200) {
            const datasetExists = parsedData.data.total_count > 0;
            resolve({
              datasetExists,
              ...(datasetExists && { persistentId: parsedData.data.items[0].global_id })
            });
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

module.exports = checkRecordDataverse;
