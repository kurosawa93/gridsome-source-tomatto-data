// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop
const axios = require('axios');
const fs = require('fs');
const path = require('path')

function TomattoData(api, options) {
  const {
    config,
    projectId,
    apiUrl
  } = options;

  api.loadSource(async store => {
    // Use the Data store API here: https://gridsome.org/docs/data-store-api
    await readJsonData(path.resolve(__dirname, '../../' + config), apiUrl, projectId, store)
  })
}

async function readJsonData(path, apiUrl, projectId, store){
  let rawJson = fs.readFileSync(path)
  let config = JSON.parse(rawJson)

  for (let type of Object.keys(config)){
    await readFormData(type, apiUrl, projectId, store)
  }
}

async function readFormData(type, apiUrl, projectId, store){
  let apiResponse = null;
  let url = '';
  let Collection = null;

  url = apiUrl + '/api/content?type=' + type;
  apiResponse = await axios.get(url, { headers: {'Project-ID': projectId} });

  Collection = store.addCollection(type);
  apiResponse = apiResponse.data.data;
  if (apiResponse != null && apiResponse.length > 0){
    pushToGraphQL(Collection, apiResponse)
  }
}

function pushToGraphQL(Collection, data) {
  let nodeObject = null;

  for (let i = 0; i < data.length; i++){
    nodeObject = {};
    for (let [key, val] of Object.entries(data[i].value)){
      if (typeof val == "object"){
        nodeObject[key] = JSON.stringify(val);
      }
      else {
        nodeObject[key] = val;
      }
    }
    Collection.addNode(nodeObject);
  }
}

module.exports = TomattoData