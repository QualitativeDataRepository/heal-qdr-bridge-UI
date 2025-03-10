document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("form").addEventListener("submit", function (event) {
        const requestData = new FormData();
        event.preventDefault(); 

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

        if (destination === "dataverse" && !apiKey) {
            alert("Please enter an API Key.");
            return;
        }

        requestData.append("source", source);
        requestData.append("sourceDataType", sourceDataType);
        requestData.append("destination", destination);

        if (sourceDataType === "projectId") {
            requestData.append("sourceContent", healID);
        } else {
            requestData.append("sourceContent", jsonFile);
        }

        if (destination === "dataverse") {
            requestData.append("apiKey", apiKey);
        }

        fetch("/push/qdr", {
            method: "POST",
            body: requestData,
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
        })
        .catch(error => {
            alert("Error: " + error.message);
        });
    });
});