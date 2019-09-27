const router = require('express').Router();
const line = require('@line/bot-sdk');
const config = require('../../config.json');
const { WebhookClient, Payload } = require('dialogflow-fulfillment');
const { Card, Suggestion } = require('dialogflow-fulfillment');

const client = new line.Client(config);

app.post('/webhook', (req, res) => {
  const agent = new WebhookClient({ request: req, response: res });
  console.log('WEBHOOK');
  //Default Fall Back Intent Handler
  function defaultAction(agent) {
    const { fulfillmentText, queryText } = req.body.queryResult;
    const { data } = req.body.originalDetectIntentRequest.payload;

    switch (queryText.toLowerCase()) {
      case 'bye':
        agent.add('bye');
        switch (data.source.type) {
          case 'user':
            return replyText(data.replyToken, "Bot can't leave from 1:1 chat");
          case 'group':
            return replyText(data.replyToken, 'Leaving group').then(() => {
              client.leaveGroup(data.source.groupId);
            });
          case 'room':
            return replyText(data.replyToken, 'Leaving group').then(() => {
              client.leaveRoom(data.source.roomId);
            });
        }
      default:
        return agent.add(fulfillmentText);
    }
  }

  //Check Intent Handler
  function checkAction(agent) {
    agent.add('check');
  }

  //Add Intent Handler
  function addAction(agent) {
    agent.add('add');
  }

  //Expense Intent Handler
  function expenseAction(agent) {
    agent.add('expense');
  }

  let intentMap = new Map();
  intentMap.set('Default Fallback Intent', defaultAction);
  intentMap.set('Check', checkAction);
  intentMap.set('Add', addAction);
  intentMap.set('Expense', expenseAction);

  agent.handleRequest(intentMap);
});

const replyText = (token, texts) => {
  texts = Array.isArray(texts) ? texts : [texts];
  return client.replyMessage(token, texts.map(text => ({ type: 'text', text })));
};

module.exports = router;
