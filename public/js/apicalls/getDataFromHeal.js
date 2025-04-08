export async function getDataFromHeal(healID) {
  const endpoint = `https://healdata.org/mds/metadata/${healID}`;

  try {
      const response = await fetch(endpoint);
      const json = await response.json();

      if (!response.ok || !json?.gen3_discovery?.study_metadata) {
          throw new Error("Could not retrieve study_metadata from HEAL");
      }

      return json.gen3_discovery.study_metadata;
  } catch (error) {
      console.error("Error fetching HEAL data:", error);
      throw error;
  }
}