
# museoAPI

## Installation
1.pull this repository<br />
2.run npm install to install dependencies<br />
3.run project command is : gulp<br />
## Usage
###routes
####HTTP.GET <br />
`http://localhost:8000/api/exhibits/`

HTTP respone an Array of JSON objects:

    [{
      "_id": "56c2efb5dc703d601d4487c3",
      "title": "villeschema",
    "__v": 0,
    "content": [
      {
        "language": "MADE UP LANGUAGE",
        "description": "huinaa",
        "_id": "56c2efb5dc703d601d4487c6"
      },
      {
        "title": "qrurl",
        "url": "vileeurl",
        "_id": "56c2efb5dc703d601d4487c5"
      },
      {
        "title": "villevideo",
        "url": "vilevideourl",
        "_id": "56c2efb5dc703d601d4487c4"
      }]

####HTTP.POST <br />

`http://localhost:8000/api/exhibits/`

HTTP req a body JSON:

    {
      "title": "villeschema",
      "content": [
          {
            "language": "MADE UP LANGUAGE",
            "description": "huinaa"
          },
          {
            "title":"qrurl",
            "url":"vileeurl"
          },
          {
            "title":"villevideo",
            "url":"vilevideourl"
          }
        ]
    }    

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
deletes by title<br/>
`http://localhost:8000/api/exhibits/villeschema`

####HTTP.PUT <br />
send JSON same as in POST with title of existing object.  
<br/>
It will REPLACE the current object BEWARE.

`http://localhost:8000/api/exhibits/villeschema`
