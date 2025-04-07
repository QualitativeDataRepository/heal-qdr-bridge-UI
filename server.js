const express  = require('express')
const fs = require('fs');
const path = require('path')
const multer = require('multer');
const healToDataverse = require('./src/convertToDataverse')
const uploadToDataverse = require('./src/uploadToDataverse')
const getDataFromHeal = require('./src/getDataFromHeal')
const checkRecordDataverse = require('./src/checkRecordDataverse')

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.static(path.join(__dirname, 'public'))); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req, res) => {
    res.sendFile(path.join(__dirname, './views/index.html'))
})


app.post('/push/qdr', upload.single("sourceContent"), async (req, res) => {

    var healDataPayload;

    if(req.body.sourceDataType === "projectId"){
      const healResponse = await getDataFromHeal(req.body.sourceContent);
      healDataPayload = healResponse
    }else{
      healDataPayload = JSON.parse(req.file.buffer.toString("utf-8"));
    }

    try {
        const dataverseJSON = healToDataverse(healDataPayload);
        const dataverseCheck = await checkRecordDataverse(dataverseJSON.datasetVersion.metadataBlocks.citation.fields[0].value, req.body.apiKey);

        if(dataverseCheck.datasetExists){
          res.status(200).json({
            created: false,
            persistentId: dataverseCheck.persistentId
          });
        }else{
          const dataverseUploadResponse = await uploadToDataverse(dataverseJSON, req.body.apiKey)

          res.status(200).json({
            created: true,
            persistentId: dataverseUploadResponse.data.persistentId
          });
        }

      } catch (error) {
        console.log('Some error', error.message)
        res.status(500).json({
            message: 'Error processing the data.',
            error: error.message,
        });
      }
});

app.listen(8080, () => {
    console.log('Server is running on port 8080')
})