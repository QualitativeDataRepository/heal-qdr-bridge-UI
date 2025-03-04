document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("form").addEventListener("submit", function (event) {
        event.preventDefault(); 

        const source = document.getElementById("source").value;
        const healId = document.getElementById("healId").value;
        const destination = document.getElementById("destination").value;
        const apiKey = document.getElementById("apiKey").value;

        if (!source || !destination) {
            alert("Please select both source and destination.");
            return;
        }

        if (source === "heal" && !healId) {
            alert("Please enter a Heal Project ID.");
            return;
        }

        if (destination === "dataverse" && !apiKey) {
            alert("Please enter an API Key.");
            return;
        }

        const requestData = {
            source,
            healId: source === "heal" ? healId : null,
            destination,
            apiKey: destination === "dataverse" ? apiKey : null
        };

        fetch("/push/qdr", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData)
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