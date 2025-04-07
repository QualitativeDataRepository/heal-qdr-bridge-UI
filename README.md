# heal-qdr-bridge-UI
User Interface based platform that helps pull data from heal and push to QDR. 

## 🚀 Features

- Simple form-based UI to collect user input
- Integration with HEAL API for metadata retrieval
- Support for pushing datasets to QDR Dataverse
- Responsive, user-friendly interface

## 🛠️ Installation

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v16+ recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Visual Studio Code](https://code.visualstudio.com/download) (or any preferred IDE)

### Steps

```bash
# Clone the repository
git clone https://github.com/QualitativeDataRepository/heal-qdr-bridge-UI.git

# Navigate to the project directory
cd heal-qdr-bridge-UI

# Install dependencies
npm install

# Start the development server with nodemon
nodemon server.js

```
The server should now be accessible on localhost:8080

## 📂 Project Structure

```
├── data
├── public - Assets and styles
│   ├── assets
│   ├── customfont
│   ├── js
│   └── styles
├── src 
└── views - UI Pages
└── server.js - Backend API's starting point

```

## 📡 API Endpoint: `/push/qdr`

This endpoint allows users to push metadata from HEAL or a  metadata JSON file to the QDR Dataverse.

### 🔸 Method: `POST`

### 🔸 Content Type:
- `multipart/form-data`

### 🔸 Request Fields:

| Field Name        | Type     | Required | Description |
|-------------------|----------|----------|-------------|
| `sourceDataType`  | string   | ✅       | Must be `"projectId"` if fetching from HEAL, or any other value to upload a local JSON. |
| `sourceContent`   | string / file | ✅  | If `sourceDataType` is `"projectId"`, this should be a HEAL project ID. Otherwise, a `.json` file should be uploaded. |
| `apiKey`          | string   | ✅       | A valid QDR Dataverse API key for authentication and upload. |

### 📤 How It Works:

- If `sourceDataType` is `"projectId"`:
  - The API fetches metadata from the HEAL API using the provided project ID.
- Otherwise:
  - It expects a JSON file (`sourceContent`) uploaded via the form and reads it as metadata.

Then:

1. Transforms the metadata using `healToDataverse`.
2. Checks Dataverse for existing datasets with the same title using `checkRecordDataverse`.
3. If the dataset **already exists**, returns `created: false` and the `persistentId`.
4. If not, uploads it using `uploadToDataverse` and returns `created: true` and the new `persistentId`.

### ✅ Success Response

```json
{
  "created": true,
  "persistentId": "doi:10.5072/FK2/ABC123"
}
```

## 📬 Contact

- [QDR](https://qdr.syr.edu/)
- [OSPO at SU](https://opensource.syracuse.edu/)