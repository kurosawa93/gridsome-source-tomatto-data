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
    await readFormData(type, apiUrl, projectId, store, config[type].content)
  }
}

async function readFormData(type, apiUrl, projectId, store, content){
  let Collection = store.addCollection(type);
  let url = apiUrl + '/api/content?type=' + type;
  let { data } = await axios.get(url, { headers: {'Project-ID': projectId} });
  data = data.data;

  pushToGraphQL(Collection, data, content);
}

function pushToGraphQL(Collection, data, content) {
  let nodeObject = {};
  let currentItem = {};
  // default value to handle query with null in graphql
  for (let j = 0; j < content.length; j++){
    nodeObject[content[j].key] = '';
  }
  nodeObject.id = 'dummy';
  Collection.addNode(nodeObject);

  for (let i = 0; i < data.length; i++){
    nodeObject = {};
    currentItem = data[i].value;

    for (let j = 0; j < content.length; j++){
      let type = content[j].type
      
      switch (type){
        case 'rich_text_box':
          nodeObject[content[j].key] = currentItem[type].html_content;
          break;
        case 'map':
          nodeObject['latitude'] = currentItem[type].latitude;
          nodeObject['longitude'] = currentItem[type].longitude;
          break;
        default:
          nodeObject[content[j].key] = currentItem[content[j].key];
          break;
      }
    }

    Collection.addNode(nodeObject);
  }
}

module.exports = TomattoData