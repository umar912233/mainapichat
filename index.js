const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 8000;
var fs = require('fs');
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
  
  if(tag == 'aichat_contact'){
  
  jsonResponse = {
      fulfillment_response: {
        messages: [
          {
            text: {
              //fulfillment text response to be sent to the agent
              text: [" - Hi! This is contact webhook response"]
            }
          }
        ]
      }
    };
    
    
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

  }
  res.json(jsonResponse);
});

app.listen(port, () => {
  console.log(`app listening on port ${port}!`);
});