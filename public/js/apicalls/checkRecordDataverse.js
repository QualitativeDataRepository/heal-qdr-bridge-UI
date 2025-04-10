/**
 * Fetch dataset search results from QDR Dataverse API (client-side version)
 * @param {string} query - Search query
 * @param {string} apiKey - Dataverse API key
 * @returns {Promise<Object>} A promise that resolves with dataset existence info
 */

import { loadConfig } from '../config.js';

export async function checkRecordDataverse(query, apiKey) {

    const config = loadConfig()

    const encodedQuery = encodeURIComponent(`"${query}"`);

    const url = `${config.DATAVERSE_BASE_URL}api/search?q=heal_platform_persistent_ID:${encodedQuery}&type=dataset&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
  
      if (response.ok) {
        const datasetExists = data.data.total_count > 0;
        return {
          datasetExists,
          ...(datasetExists && { persistentId: data.data.items[0].global_id }),
        };
      } else {
        console.error('API Error Response:', data);
        throw new Error(`API Error: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error('Request error:', error);
      throw error;
    }
};
  