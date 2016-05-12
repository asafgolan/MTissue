
# museoAPI

##backend connection
in app.js file replace config.DBPath with wanted mongoDB path: 
`var  db = mongoose.connect(config.DBPath);` <br/>
set supersecret to whatever string:
`app.set('superSecret', config.secret);`


## Installation
1.clone repo
2.run npm install
3.create new file: config.json.
4.set a secret key and your database server is running path with the museum 
``` 
{
"secret":"allOfUsAreOne",
"DBPath": "mongodb://username:user@someKey.mongolab.com:someOtherKey/museo"
}
``` 
5.from terminal > gulp to run application.

## Usage



###routes

#### Auth

POST  `localhost:8000/api/authenticate` with valid username and password from users collection.
*if project is initialized user should be inserted manually to database

HTTP respone 
 ```
{
  "success": true,
  "token": "JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9... SOME LONG TOKEN ........"
}
```
return Authorization token. required for all route besides GET `http://localhost:8000/api/exhibits/`

####HTTP.GET <br />

`http://localhost:8000/api/users/`

return a list of users

####HTTP.POST <br />

`http://localhost:8000/api/users/`

req:
 ```
{
    "username":"asa",
    "password":"paske"
}
 ```
 res:
  ```
{
  "message": "New User -Admin room!"
}
 ```
 

saves a user to database

####HTTP.GET <br />

`http://localhost:8000/api/exhibits/`

HTTP respone an Array of JSON objects:
``` 
[{
    "_id": "56e7f5c33dcc7a5b0aa69c4b",
    "title": "FinalSchema",
    "__v": 2,
    "content": [
      {
        "type": 2,
        "title": "FinalSchemaImage ",
        "url": "vileeurl",
        "_id": "56e7f7703dcc7a5b0aa69c53"
      },
      {
        "type": 3,
        "title": "Fuck u Shark",
        "url": "UrlVideo",
        "_id": "56e7f7703dcc7a5b0aa69c52"
      }
    ]
  },
  {
    "_id": "56ec4dd4ed834fa18f40a9f8",
    "title": "now2Schema",
    "__v": 0,
    "content": [
      {
        "type": 1,
        "language": "RU",
        "description": "hochich kartoshtke devuchka ? neit . hochich vodka",
        "_id": "56ec4dd4ed834fa18f40a9fb"
      },
      {
        "type": 2,
        "title": "FinalSchemaImage ",
        "url": "vileeurl",
        "_id": "56ec4dd4ed834fa18f40a9fa"
      }
      {
        "type": 3,
        "title": "FinalSchemaVideo",
        "url": "UrlVideo",
        "_id": "56ec4dd4ed834fa18f40a9f9"
      }
    ]
  }]
  ```

####HTTP.POST <br />

`http://localhost:8000/api/exhibits/`

HTTP req a body JSON:
```
{
  "title": "now5Schema",
  "_id": "56ee877335885170a55ad29a",
  "content": [
    {
      "type": 1,
      "language": "RU",
      "description": "hochich kartoshtke devuchka ? neit . hochich vodka",
      "_id": "56ee877335885170a55ad29d"
    },
    {
      "type": 2,
      "title": "FinalSchemaImage ",
      "url": "vileeurl",
      "_id": "56ee877335885170a55ad29c"
    },
    {
      "type": 3,
      "title": "FinalSchemaVideo",
      "url": "UrlVideo",
      "_id": "56ee877335885170a55ad29b"
    }
  ]
}
```
##### respone <br />

      {
      "title": "villeschema",
          "_id": "56d8bbbf263101b47e0ee6c2",
          "content": 
          [
            {
              "language": "MADE UP LANGUAGE",
              "description": "huinaa",
              "_id": "56d8bbbf263101b47e0ee6c5"
            },
            {
              "title": "qrurl",
              "url": "vileeurl",
              "_id": "56d8bbbf263101b47e0ee6c4"
            },
            {
              "title": "villevideo",
              "url": "vilevideourl",
              "_id": "56d8bbbf263101b47e0ee6c3"
            }
          ]
      }    

####HTTP.DELETE <br />
deletes by Id<br/>
`http://localhost:8000/api/exhibits/56d8bbbf263101b47e0ee6c2`

####HTTP.PUT <br />
send JSON same as in POST with Id of existing object.  
<br/>
It will REPLACE the current object BEWARE.

`http://localhost:8000/api/exhibits/56d8bbbf263101b47e0ee6c2`

####upload file
 
 requires auth :check `static/uploads/index.html` to see request
 
`http://localhost:8000/api/uploads`

