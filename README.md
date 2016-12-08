
# Metsä_tissue_API

##backend connection
in app.js file replace config.DBPath with wanted mongoDB path: 
`var  db = mongoose.connect(config.DBPath);` <br/>
set supersecret to whatever string:
`app.set('superSecret', config.secret);`
set watson api key to whatever relevant credentials:
`app.set('watsonKey', config.watsonKey);`




## Installation
<ol>
<li>clone repo</li>
<li>run npm install</li>
<li>create new file: config.json.</li>
<li>set a secret key and your database server is running path with the museum</li>
</ol>


``` 
{
"secret":"allOfUsAreOne",
"DBPath": "mongodb://username:user@someKey.mongolab.com:someOtherKey/museo"
"watsonApi": "xxmxjwadadxmmasasdasd_secret_key_hash..."
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
return Authorization token. required for all route besides GET `http://localhost:8000/api/products/`

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

`http://localhost:8000/api/products/`

HTTP respone an Array of JSON objects:
``` 
[{
    "_id": {
        "$oid": "57efef6edcba0f550bb1740e"
    },
    "title": " Lambi WC-paperi 8 rl valkoinen",
    "nick": "lambi8pack",
    "unitsCountedAsOne": 3,
    "code": "6414300152460",
    "width": 110,
    "height": 202
}]
  ```

####HTTP.POST <br />

`http://localhost:8000/api/products/`

HTTP req a body JSON:
```
{
    "title": " Lambi WC-paperi 8 rl valkoinen",
    "nick": "lambi8pack",
    "unitsCountedAsOne": 3,
    "code": "6414300152460",
    "width": 110,
    "height": 202
}
```
##### respone <br />

      {{
    "_id": {
        "$oid": "57efef6edcba0f550bb1740e"
    },
    "title": " Lambi WC-paperi 8 rl valkoinen",
    "nick": "lambi8pack",
    "unitsCountedAsOne": 3,
    "code": "6414300152460",
    "width": 110,
    "height": 202
}

####HTTP.DELETE <br />
deletes by Id<br/>
`http://localhost:8000/api/exhibits/57efef6edcba0f550bb1740e`

####HTTP.PUT <br />
send JSON same as in POST with Id of existing object.  
<br/>
It will REPLACE the current object BEWARE.

`http://localhost:8000/api/exhibits/57efef6edcba0f550bb1740e`

####upload file
 
 requires auth :check `static/uploads/index.html` to see request
 
`http://localhost:8000/api/uploads`

####HTTP.DELETE <br />
deletes by Id<br/>
`http://localhost:8000/api/products/57efef6edcba0f550bb1740e`

####HTTP.POST <br />

`http://localhost:8000/api/uploads_n_query_watson'/`

param: in multipartform upload the image wanted for analysis. <br />

##### respone

`res.images[0].classifiers/` return the image classified


####HTTP.POST <br />

`http://localhost:8000/api/uploads/` params upload a image for analysis and returns the count object.






