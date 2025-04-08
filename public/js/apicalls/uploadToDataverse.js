export async function uploadToDataverse(dataverseJSON, apiKey){
    const uploadRes = await fetch("https://data.stage.qdr.org/api/dataverses/heal/datasets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Dataverse-Key": apiKey
        },
        body: JSON.stringify(dataverseJSON)
      });

      let status = uploadRes.status
      let message;

      switch (status) {
            case 201:
                const uploadData = await uploadRes.json();
                const persistentId = uploadData.data?.persistentId;
                message = `✅ Success! Your data has been pushed to QDR. You can access it here: <a href="https://data.stage.qdr.org/dataset.xhtml?persistentId=${persistentId}" target="_blank">${persistentId}</a>`;
                break;
            case 400:
                message = "⚠️ Bad Request: Your input data might be incorrect.";
                break;
            case 401:
                message = "❌ Unauthorized: Your API key might be incorrect.";
                break;
            case 403:
                message = "⛔ Forbidden: You do not have permission to perform this action.";
                break;
            case 404:
                message = "🔍 Not Found: The requested resource was not found.";
                break;
            case 500:
                message = "❌ Server Error: Something went wrong on our end. Please try again later.";
                break;
            default:
                const response = await uploadRes.json();
                message = `❌ Unexpected error (Status ${status}): ${response || "Please contact <a mailto:'qdr@syr.edu'> support</a>. "}`;
            }

    return message;
}