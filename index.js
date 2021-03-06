const express = require('express');
const app = express();
var cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const axios = require('axios');
const https = require('https');
var mysq = require('mysql');
const port = 8080;
var fs = require('fs');

const corsOpts = {
  origin: '*',

  methods: [
    'GET',
    'POST',
  ],

  allowedHeaders: [
    'Content-Type',
  ],
};


app.use(cors(corsOpts));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
const dialogFLowHelper = require('./dialogflow.helper');


app.post('/', async (req, res) => {

    res.setHeader('Content-Type', 'application/x-www-form-urlencoded');
	// Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    try {
        const {message, useId} = req.body
        const dialogFlowResponse = await dialogFLowHelper.findIntentDialogFlowCx({userMessage: message, sessionId: useId});
        res.status(200).json({
            status:"success",
            data: dialogFlowResponse
        })
    }catch (e) {
        res.status(500).send("Error");
    }
 
});

app.post('/webhook', (req, res) => {

    res.setHeader('Content-Type', 'application/x-www-form-urlencoded');
	// Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

  const tag = req.body.fulfillmentInfo.tag;
  const session_name = req.body.sessionInfo.session;
    console.log('this is session:'+session_name);

axios({
  method: 'get',
  url: 'http://api.mybusiness.chat/api.php?location='+session_name,

})
  .then(function (response) {
    console.log(response.data);
    if(tag == 'aichat_contact'){

      jsonResponse = {
        fulfillment_response: {
          messages: [
            {
              text: {
                //fulfillment text response to be sent to the agent
                text: ["Phone #: "+response.data.number+" Email:"+response.data.email+" Website:"+response.data.website]
              }
            }
          ]
        }
      };
      
      res.json(jsonResponse);

    }else if(tag == 'aichat_booking'){

      jsonResponse = {
        fulfillment_response: {
          messages: [
            {
              text: {
                //fulfillment text response to be sent to the agent
                text: [" - Hi! This is booking webhook response"]
              }
            }
          ]
        }
      };
      res.json(jsonResponse);

    }
  });

});


app.listen(port, () => {
  console.log(`app listening on port ${port}!`);
});