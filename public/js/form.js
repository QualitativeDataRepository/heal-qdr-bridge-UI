import { getDataFromHeal } from './apicalls/getDataFromHeal.js';
import { healToDataverse } from './apicalls/convertToDataverse.js';
import { uploadToDataverse } from './apicalls/uploadToDataverse.js';
import { checkRecordDataverse } from './apicalls/checkRecordDataverse.js';

document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("form").addEventListener("submit", async function (event) {
        event.preventDefault(); 

        const overlay = document.getElementById("loading-overlay");
        const bannerImage = document.getElementById("bannerImage"); 
        const source = document.getElementById("source").value;
        const sourceDataType = document.getElementById("dataType").value;
        
        //Heal source type can be either project id or uploading json file
        const healID = document.getElementById("healId").value;
        const jsonFile = document.getElementById("jsonFile").files[0];

        const destination = document.getElementById("destination").value;
        const apiKey = document.getElementById("apiKey").value;

        if (!source || !destination) {
            alert("Please select both source and destination.");
            return;
        }

        if (sourceDataType === "projectId" && !healID) {
            alert("Please enter a Heal Project ID.");
            return;
        }

        if (sourceDataType === "jsonFile" && !jsonFile) {
            alert("Please upload study metadata json file.");
            return;
        }

        if (destination === "dataverse-qdr" && !apiKey) {
            alert("Please enter an API Key.");
            return;
        }

        overlay.style.display = "flex";

        try {
            let healData;
            if (sourceDataType === "projectId") {
                healData = await getDataFromHeal(healID);
            } else {
                const fileText = await jsonFile.text();
                healData = JSON.parse(fileText);
            }


            const nih_persistent_id = healData.citation.heal_platform_persistent_ID
            const duplicateCheck = await checkRecordDataverse(nih_persistent_id, apiKey);
            let message = ''

            if(duplicateCheck.datasetExists){
                message = `⚠️ Record with same dataset title already exists. You can access it here: <a href="https://data.stage.qdr.org/dataset.xhtml?persistentId=${duplicateCheck.persistentId}" target="_blank">${duplicateCheck.persistentId}</a>`
            }else{
                const convertToDataverse = await healToDataverse(healData);
                message = await uploadToDataverse(convertToDataverse, apiKey); 
            }
            
            apiResponseContainer.innerHTML = `
                    <div class="card shadow-sm p-3">
                        <p class="text-dark">${message}</p>
                    </div>
                `;

        }catch(error){
            console.error(error);
            apiResponseContainer.innerHTML = `<p class="text-danger">❌ ${error.message}</p>`;
        }finally{
            overlay.style.display = "none";
        }

        // fetch("/push/qdr", {
        //     method: "POST",
        //     body: requestData,
        // })
        // .then(response => response.json().then(data => ({ status: response.status, body: data }))) 
        // .then(({ status, body }) => {
        //     console.log(body)
        //     let message = "";
            
        //     switch (status) {
        //         case 200:
        //             if(body.created){
        //                 message = `✅ Success! Your data has been pushed to QDR. You can access it here: <a href="https://data.stage.qdr.org/dataset.xhtml?persistentId=${body.persistentId}" target="_blank">${body.persistentId}</a>`;
        //             }else{
        //                 message = `⚠️ Record with same dataset title already exists. You can access it here: <a href="https://data.stage.qdr.org/dataset.xhtml?persistentId=${body.persistentId}" target="_blank">${body.persistentId}</a>`;
        //             }
        //             break;
        //         case 400:
        //             message = "⚠️ Bad Request: Your input data might be incorrect.";
        //             break;
        //         case 401:
        //             message = "❌ Unauthorized: Your API key might be incorrect.";
        //             break;
        //         case 403:
        //             message = "⛔ Forbidden: You do not have permission to perform this action.";
        //             break;
        //         case 404:
        //             message = "🔍 Not Found: The requested resource was not found.";
        //             break;
        //         case 500:
        //             message = "❌ Server Error: Something went wrong on our end. Please try again later.";
        //             break;
        //         default:
        //             message = `❌ Unexpected error (Status ${status}): ${body.message || "Please contact <a mailto:'qdr@syr.edu'> support</a>. "}`;
        //     }

        //     if(bannerImage){
        //         bannerImage.style.display = "none";
        //     }
            
        //     apiResponseContainer.innerHTML = `
        //         <div class="card shadow-sm p-3">
        //             <p class="text-dark">${message}</p>
        //         </div>
        //     `;
        // })
        // .catch(error => {
        //     console.log(error)
        //     apiResponseContainer.innerHTML = `<p class="text-danger">❌ Network Error: ${error.message}</p>`;
        // })
        // .finally(() => {
        //     overlay.style.display = "none";
        // });
    });
});