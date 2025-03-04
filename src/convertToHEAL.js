/**
 * Create a HEAL json-compliant object from a Dataverse metadata exports
 * @param {object} dataverse - Dataverse JSON metadata direct from server
 * @return {object} HEAL-compliant javascript object
 */
const generateHEAL = (dataverse)=>{

     // create template and begin extracting data

    var empty = require('json-schema-empty').default;
    const schema = require('../data/heal-schema.json');
    var template = empty(schema);

    try {
        var heal = dataverse.data.latestVersion.metadataBlocks.heal.fields;
    } catch (err) {
        console.log("Error: No HEAL metadata block detected!");
        return(err);
    }
    var citation = dataverse.data.latestVersion.metadataBlocks.citation.fields;

    // cycle through two levels and assign values into the empty template
    for (var i=0; i<heal.length; i++) {
        var toplevel = heal[i]["typeName"];
        // had to name the field as heal_citation due to a limitation of dataverse
        // we change it back here
        if (toplevel=="heal_citation") {
            toplevel = "citation";
        }
       
        // need to extract into a simple name:var format
        var sublevel = heal[i]["value"];
        // Some cases have a third level as an array (only registrants afaik)
        if (typeof sublevel.length !== 'undefined') {
            sublevel.forEach(element => {
                for (let key in element) {
                    element[key] = element[key]["value"];
                }
            });
        } else { // in case of only two levels
            for (let key in sublevel) {
                if (sublevel[key]["value"])
                sublevel[key] = sublevel[key]["value"];
            }
        }
        // commit back to empty template based on "typeName"
        template[toplevel] = sublevel;
    }

    // rename duplicate names that had to be changed in dataverse
    template['study_translational_focus'] = template.study_translational_focus_group;
    delete template.study_translational_focus_group; 

    // should be a sublevel, these aren't in the dataverse block schema for dv purposes
    template['contacts_and_registrants']['contacts'] = [];
    template['contacts_and_registrants']['registrants'] = template.registrants;
    delete template.registrants;
    template['metadata_location']['data_repositories'] = template.data_repositories;
    delete template.data_repositories;

    // Yes to binary values
    template.citation.heal_funded_status = (template.citation.heal_funded_status == "Yes");
    template.citation.study_collection_status = (template.citation.study_collection_status == "Yes");
    template.data_availability.produce_data = (template.data_availability.produce_data == "Yes");
    template.data_availability.produce_other = (template.data_availability.produce_data == "Yes");
    
    // idk why this doesn't work automatically, but some fields need to be array-ified
    Object.entries(template.human_treatment_applicability).forEach(([key, value]) => {
        if (typeof value == "string") {
            template.human_treatment_applicability[key] = [ value ];
        }    
    });


    // data that got merged into standard dataverse categories
    // requires manual handling
    var citation_map = new Object;
    for (var i=0; i<citation.length; i++) {
        citation_map[citation[i]["typeName"]] = citation[i]["value"];
    }

    template.minimal_info["study_name"] = citation_map.title;
    template.minimal_info["study_description"] = citation_map.dsDescription[0]["dsDescriptionValue"]["value"];

    for (var i=0; i<citation_map.datasetContact.length; i++) {
        // In case there's no name for the contact (dataverse only requires email address)
        try {
            var contact_name = citation_map.datasetContact[i]['datasetContactName']['value'].split(", ");
        } catch(e) {
            var contact_name = ["undefined", "undefined"];
        }
        template['contacts_and_registrants']['contacts'].push( {
            contact_first_name: contact_name[1],
            contact_last_name: contact_name[0],
            //contact_affiliation: citation_map.datasetContact[i]['datasetContactAffiliation']['value'],
            contact_email: citation_map.datasetContact[i]['datasetContactEmail']['value']
        });
    }

    template.citation['investigators'] = [];
    for (var i=0; i<citation_map.author.length; i++) {
        // investigator ID is not necessarily specified
        try {
        var investigator_ID = [{
            investigator_ID_type: citation_map.author[0]['authorIdentifierScheme']['value'],
            investigator_ID_value: citation_map.author[0]['authorIdentifier']['value']
        }];
        } catch(e) {
            var investigator_ID = [];
        }
        var author_name = citation_map.author[i]['authorName']['value'].split(", ")
        // author affiliation is also not necessarily specified
        try {
            var author_affiliation = citation_map.author[i]['authorAffiliation']['value'];
        } catch(e) {
            var author_affiliation = "";
        }
        template.citation['investigators'].push( {
            investigator_first_name: author_name[1],
            investigator_last_name: author_name[0],
            investigator_affiliation: author_affiliation,
            investigator_ID: investigator_ID
        });
    }

    if (typeof(citation_map.dateOfCollection) !== 'undefined') {
        template.data_availability.data_collection_start_date = citation_map.dateOfCollection[0]['dateOfCollectionStart']['value'];
        template.data_availability.data_collection_finish_date = citation_map.dateOfCollection[0]['dateOfCollectionEnd']['value'];
    }

    // needs to be formatted as an array (with funder name as an another array)
    if (typeof(citation_map.grantNumber) !== 'undefined') {
        template.citation['funding'] = [ {
            funder_name: [ citation_map.grantNumber[0]['grantNumberAgency']['value'] ],
            funding_award_ID: citation_map.grantNumber[0]['grantNumberValue']['value']
        } ];
    }

    // strings to integers as necessary
    if (typeof(template.data.subject_data_unit_of_collection_expected_number) !== 'undefined') {
        template.data.subject_data_unit_of_collection_expected_number = Number(template.data.subject_data_unit_of_collection_expected_number);
    }

    if (typeof(template.data.subject_data_unit_of_analysis_expected_number) !== 'undefined') {
        template.data.subject_data_unit_of_analysis_expected_number = Number(template.data.subject_data_unit_of_analysis_expected_number)
    }

    // Validate against the schema again to quality check output
    var Validator = require('jsonschema').Validator;
    var v = new Validator();
    const valid = v.validate(template, schema)

    if (valid.valid) {
        return template;
    } else {
        console.log(valid.errors);
        //return template; //useful for debugging
    }
}

module.exports = generateHEAL
