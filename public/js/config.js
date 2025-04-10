export function loadConfig(host){

    const env = host == "heal-qdr-bridge.io" ? "production" : "development"
    const configs = {
        "development" : {
            "dataverse_upload_endpoint": "https://data.stage.qdr.org/api/dataverses/heal/datasets",
            "heal_get_data_endpoint" : "https://healdata.org/mds/metadata/",
            "dataverse_host_endpoint" : "https://data.stage.qdr.org/"
        },
        "production" : {
    
        }
    }

    return configs[env];
}