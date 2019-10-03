# Gridsome Data Source Plugin for Tomatto Sites
This plugin will directly pulling data from tomatto server using data model which configured in `config.json` which placed  inside your project root directory, and then injecting it to Gridsome GraphQL.

## How to use


### Installing plugin

You can install this plugin with command `npm install gridsome-source-tomatto-data`

### Define `config.json`
first, you need to define your data model in `config.json`. Since this plugin has not automatically created the file, you must create this file manually and placed it inside your project directory. The `config.json` will be look like this;
```
{
  "post":{
      "description": "Postingan pada website anda",
      "content": [
          {
              "name": "Judul",
              "key": "title",
              "type": "text",
              "browse": "true"
          },
          {
              "name": "Latar",
              "key" : "cover",
              "type": "image"
          },
          {
              "name": "Konten",
              "key": "content",
              "type": "rich_text_box"
          },
          {
              "name": "Jenis",
              "key": "type",
              "type": "select",
              "items": [
                  {
                    "text": "Beranda",
                    "value": "home"
                  },
                  {
                    "text": "Profil",
                    "value": "profile"
                  },
                  {
                      "text": "Header Produk",
                      "value": "product"
                  }
              ]
          }
      ]
  }
}
```

* `post` is the name of the model. You can freely decide what is the best name to your data model. 
* `description` is the description of your model. This will be shown in Tomatto Dashboard.
* `content` is the core of your model. this is where you define the field of your data model. it consisted of;
  * `name` is the name of the field.
  * `key` representing the field key, which you will be used in your GraphQL query.
  * `type` is the type of the field. currently supported `type` is: `text`, `textarea`, `image`, `rich_text_box`, and `select`. More field will be added in the future.
  * `browse` is used to determine if the field will appear on Tomatto Dashboard model browse page.
  * `items` is a list of selection for the dropdown if your field type is `select`.
  
### Import plugin to `gridsome.config.js`
You will need to import the plugin into your `gridsome.config.js`. Add these lines
```
{
  use: 'gridsome-source-tomatto-data',
  options: {
    config: 'config.json',
    projectId: process.env.PROJECT_ID,
    apiUrl: process.env.API_URL
  }
}
```
into the `plugins` array inside `gridsome.config.js`.

### Querying your data
You can start creating your GraphQL query for your page. Please note to add dummy filter id to filter unnecessary data. This is because, currently, Gridsome cannot process an empty collection. In order to be able to run the query, unfortunately, there is a need to add a placeholder data based on each of your model data. Your query is supposed to be like this;
```
query Home {
  welcomePost: allPost(filter: {id: {ne: "dummy"}}) {
    edges {
      node {
        id,
        title,
        type,
        content
      }
    }
  }
}
```

## Run your project
Now you can run your project using `gridsome develop` command. This plugin will automatically pulled your data from Tomatto server, and then injects the data into Gridsome GraphQL. You also can test the query from Gridsome's GraphQL Playground located in `http://localhost:8080/___explore`.
