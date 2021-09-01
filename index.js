const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http');
const axios = require('axios');
const https = require('https');
var mysql = require('mysql');
const port = 8080;
var fs = require('fs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
const dialogFLowHelper = require('./dialogflow.helper');

var mysqlConnection = mysql.createConnection({
  host:'167.99.148.122',
  user:'newuser',
  password:'password',
  database:'autochat'
});

mysqlConnection.connect((err)=>{
  if(!err)
  console.log('DB connected');
  else
  console.log('Not Connecte');
});

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

    mysqlConnection.query('SELECT * FROM aichat_data WHERE location_id="'+req.param('id')+'"',(err,rows,fields)=>{
     
          res.send({
              data:rows,
              status: true
          });
     
    });
  
//   const tag = req.body.fulfillmentInfo.tag;
//   const session_name = req.body.sessionInfo.session;

// var url = 'https://mybusiness.chat/api.php?location=projects/wallet-campaigns-307112/locations/us-central1/agents/9e7f3111-ee1c-40fb-a144-47458e297c13/sessions/16';
// axios.get(url)
// .then(response => {
// console.log('this is response '+ response);
// jsonResponse = response;

// res.json(jsonResponse);
// // jsonResponse = {
// //     fulfillment_response: {
// //       messages: [
// //         {
// //           text: {
// //             //fulfillment text response to be sent to the agent
// //             text: [" - Hi! This is contact webhook response"]
// //           }
// //         }
// //       ]
// //     }
// //   };
  
// })
  
//   if(tag == 'aichat_contact'){
  
//     var url = 'https://mybusiness.chat/api.php?location=projects/wallet-campaigns-307112/locations/us-central1/agents/9e7f3111-ee1c-40fb-a144-47458e297c13/sessions/16';

//     axios.get(url)
//   .then(response => {
//     console.log('this is response '+ response);
//     jsonResponse = response;
//     // jsonResponse = {
//     //     fulfillment_response: {
//     //       messages: [
//     //         {
//     //           text: {
//     //             //fulfillment text response to be sent to the agent
//     //             text: [" - Hi! This is contact webhook response"]
//     //           }
//     //         }
//     //       ]
//     //     }
//     //   };
      
//   })
//   .catch(error => {
//     console.log('this is error '+ error);
//   });

  
    
//   }else if(tag == 'aichat_booking'){

//     jsonResponse = {
//       fulfillment_response: {
//         messages: [
//           {
//             text: {
//               //fulfillment text response to be sent to the agent
//               text: [" - Hi! This is booking webhook response"]
//             }
//           }
//         ]
//       }
//     };

//   }
 
});

app.listen(port, () => {
  console.log(`app listening on port ${port}!`);
});