function toggleInputs() {
    let source = document.getElementById("source").value;        
    let dataTypeDiv = document.getElementById("dataTypeDiv");
    let healIdInput = document.getElementById("healIdInput");
    let jsonFileInput = document.getElementById("jsonFileInput");

    let destination = document.getElementById("destination").value;
    let dataverseApiKeyInput = document.getElementById("apiKeyInput");
    
    if (source === "heal") {
        dataTypeDiv.style.display = "block";
    } else {
        dataTypeDiv.style.display = "none";
        healIdInput.style.display = "none";
        jsonFileInput.style.display = "none";
    }

    if(destination == "dataverse-qdr"){
        dataverseApiKeyInput.style.display = "block";
    }else{
        dataverseApiKeyInput.style.display = "none";
    }
}

function toggleDataInput() {
    let dataType = document.getElementById("dataType").value;
    let healIdInput = document.getElementById("healIdInput");
    let jsonFileInput = document.getElementById("jsonFileInput");

    if (dataType === "projectId") {
        healIdInput.style.display = "block";
        jsonFileInput.style.display = "none";
    } else if (dataType === "jsonFile") {
        healIdInput.style.display = "none";
        jsonFileInput.style.display = "block";
    } else {
        healIdInput.style.display = "none";
        jsonFileInput.style.display = "none";
    }
}