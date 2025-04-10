import { loadConfig } from '../config.js';

export async function getDataFromHeal(healID) {

  const config = loadConfig(window.location.hostname)
  const endpoint = `${config.heal_get_data_endpoint}${healID}`;

  try {
      const response = await fetch(endpoint);
      const json = await response.json();
      if (!response.ok || !json?.gen3_discovery?.study_metadata) {
          throw new Error(" Corresponding study metadata not available at HEAL");
      }

      //console.log(json.gen3_discovery.study_metadata.citation.heal_platform_persistent_ID)
      return json.gen3_discovery.study_metadata;
  } catch (error) {
      console.error("Error fetching HEAL data:", error);
      throw error;
  }
}