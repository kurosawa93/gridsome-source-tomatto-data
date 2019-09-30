// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop
const axios = require('axios');

function TomattoData(api, options) {
  const {
    configPath,
    projectId,
    apiUrl
  } = options;

  const config = require(configPath);

  api.loadSource(async store => {
    // Use the Data store API here: https://gridsome.org/docs/data-store-api
    let url = '';
    let apiResponse = null;
    let typeName = null;
    let Collection = null;
    let nodeObject = {};

    for (let [page, value] of Object.entries(config)){
      for (let item in value.form_content){
        url = apiUrl + '/api/content?pages=' + page + '&type=' + item;
        apiResponse = await axios.get(url, { headers: {'Project-ID': projectId} });
        typeName = page + '_' + item;

        Collection = store.addContentType(typeName);
        apiResponse = apiResponse.data.data;
        if (apiResponse != null && apiResponse.length > 0){
          for (let i = 0; i < apiResponse.length; i++){
            nodeObject = {};
            for (let [key, val] of Object.entries(apiResponse[i].value)){
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
      }
    }
  })
}

module.exports = TomattoData