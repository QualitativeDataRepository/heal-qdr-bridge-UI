/**
 * Download metadata from Dataverse and pass to conversion function
 * @param {string} pid - persistentId of dataverse project
 * @param {string} api - API key for dataverse instance, required for unpublished projects
 * @param {Function} callback - Function to handle the converted HEAL metadata
 */
const dataverseToHEAL = (pid, api, callback)=>{
    const https = require('https');
    const generateHEAL = require('./convertToHEAL.js');

    options = {
        host: "data.stage.qdr.org",
        port: 443,
        path: encodeURI("/api/datasets/:persistentId/?persistentId=".concat(pid)),
        method: "GET"
    };

    if (typeof (api) !== 'undefined') {
        options.headers = { 'X-Dataverse-Key': api };
    }

    var req = https.request(options, res => {
        let rawData = '';
        res.on('data', chunk => {
            rawData += chunk
        });
        res.on('end', () => {
            callback(generateHEAL(JSON.parse(rawData)));
        });
    });

    req.end()

}

module.exports = dataverseToHEAL
