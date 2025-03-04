/* istanbul ignore file */
/**
 * Upload JSON metadata to dataverse instance, creating a new project
 * @param {object} json - Dataverse JSON file
 * @param {string} api - API key for Dataverse instance
 */
const validDataverseSchema = (json, api)=> {
    var https = require('https');
    let post = JSON.stringify(json);

    options = {
        host: "data.stage.qdr.org",
        port: 443,
        path: encodeURI("/api/dataverses/heal/validateDatasetJson"),
        method: "POST",
        headers: { 
            'X-Dataverse-Key': api,
            'Content-Type': 'application/json',
            'Content-Length': post.length
        }
    };

    var req = https.request(options, resp => {
        resp.on('data', function(d) {           
            process.stdout.write(d);  // working fine(prints decoded data in console)
        });
    }).on('error', function(e) {
        console.error(e);
    });

    req.write(post);
    req.end();
}

module.exports = uploadDataverse
