const ServiceEmailFaq = require('./wallet-campaigns-307112-504acab2bb2a.json');
const dialogflow = require('@google-cloud/dialogflow');
const {struct,list} = require('pb-util');
/**
 * dialogflow cx - code start here
 * */
const {SessionsClient} = require('@google-cloud/dialogflow-cx');
const client = new SessionsClient({apiEndpoint: 'us-central1-dialogflow.googleapis.com', credentials: ServiceEmailFaq})
/*
* dialogflow values
* */
const projectId = 'wallet-campaigns-307112';
const location = 'us-central1';
const agentId = '9e7f3111-ee1c-40fb-a144-47458e297c13';
const languageCode = 'en'
const findIntentDialogFlowCx = async ({userMessage, sessionId}) => {
    const sessionPath = client.projectLocationAgentSessionPath(
        projectId,
        location,
        agentId,
        sessionId
    );
    console.info(sessionPath);

    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: userMessage,
            },
            languageCode,
        },
    };
    try {
        const [response] = await client.detectIntent(request);

        let messages = ""
        for (const message of response.queryResult.responseMessages) {
            if (message.text) {
                messages = messages + message.text.text
                console.log(messages)
            }
        }
        if (response.queryResult.match.intent) {
            console.log(
                `Matched Intent: ${response.queryResult.match.intent.displayName}`
            );
        }
        console.log(
            `Current Page: ${response.queryResult.currentPage.displayName}`
        );
        let customData = {data:[]}

        
        response.queryResult.responseMessages.forEach(element=>{
            if(element.message === 'payload') {
                
                let temp   = struct.decode(element.payload)
                console.log(JSON.stringify(temp))
                customData.data = [...customData.data,...temp.data]
            
            }
            
        })
        console.log(JSON.stringify(customData));
        return {
            message: messages,
            customData
        }
    } catch (e) {
        console.error("Error",e)
        console.error(JSON.stringify(e, null, 2))
    }

}
// for dialogflow ES
const findIntent = async ({userMessage, sessionId}) => {
    console.log(`Sending Request for ${sessionId} message ${userMessage}`)
    const sessionClient = new dialogflow.SessionsClient({credentials: ServiceEmailFaq});
    const sessionPath = await sessionClient.projectAgentSessionPath(ServiceEmailFaq.project_id, sessionId);
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                // The query to send to the dialogflow agent
                text: userMessage,
                // The language used by the client (en-US)
                languageCode: 'en',
            },
        }
    };
    let dialogflowResponse = await sessionClient.detectIntent(request);
    dialogflowResponse = dialogflowResponse[0]
    const customData = struct.decode(dialogflowResponse.queryResult.fulfillmentMessages[0].payload)
    let messageText = dialogflowResponse.queryResult.fulfillmentText || ""
    return {
        message: messageText,
        customData
    }
}

module.exports = {
    findIntent: findIntent,
    findIntentDialogFlowCx: findIntentDialogFlowCx

}


