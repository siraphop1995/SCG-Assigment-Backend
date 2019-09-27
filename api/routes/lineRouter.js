const router = require('express').Router();
const mongoose = require('mongoose');
const Users = mongoose.model('Users');
const line = require('@line/bot-sdk');
const config = require('../../config.json');
const { WebhookClient, Payload } = require('dialogflow-fulfillment');
const { Card, Suggestion } = require('dialogflow-fulfillment');

const client = new line.Client(config);

app.post('/webhook', (req, res, next) => {
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

  //Create Intent Handler
  async function createAction(agent) {
    const { data } = req.body.originalDetectIntentRequest.payload;

    const user = await User.find({ lineId: data.source.userId }, null);
    if (user.length >= 1) {
      agent.add('You already have a wallet-bot account');
      return agent.add('Use "help" command to see possible action');

    }

    if (data.source.userId) {
      return client.getProfile(data.source.userId).then(profile => {
        const payloadJson = {
          type: 'template',
          altText: `This is a buttons template `,
          template: {
            type: 'buttons',
            title: 'Wallet-bot account setup',
            text: `Do you wish to use "${profile.displayName}" as username?`,
            actions: [{ label: 'Yes', type: 'message', text: 'yes' }, { label: 'No', type: 'message', text: 'no' }]
          }
        };

        var payload = new Payload('LINE', payloadJson, {
          sendAsMessage: true
        });
        agent.add(payload);
      });
    } else {
      agent.add('Bot cannot use profile API without user ID');
    }
  }

  //Create - Yes Intent Handler
  async function createYesAction(agent) {
    try {
      const { data } = req.body.originalDetectIntentRequest.payload;
      const profile = await client.getProfile(data.source.userId);
      let newUser = new User({
        lineId: data.source.userId,
        username: profile.displayName,
        balance: 0
      });
      await newUser.save();
      console.log(newUser);
      agent.add('Account created successfully');
      agent.add('Use "help" command to see possible action');
    } catch (err) {
      next(err);
    }
  }

  //Create - No Intent Handler
  function createNoAction(agent) {
    agent.add('checkNo');
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

  //Delete Intent Handler
  function deleteAction(agent) {
    agent.add('delete');
  }

  let intentMap = new Map();
  intentMap.set('Default Fallback Intent', defaultAction);
  intentMap.set('Create', createAction);
  intentMap.set('Create - Yes', createYesAction);
  intentMap.set('Create - No', createNoAction);
  intentMap.set('Check', checkAction);
  intentMap.set('Add', addAction);
  intentMap.set('Expense', expenseAction);
  intentMap.set('Delete', deleteAction);

  agent.handleRequest(intentMap);
});

const replyText = (token, texts) => {
  texts = Array.isArray(texts) ? texts : [texts];
  return client.replyMessage(token, texts.map(text => ({ type: 'text', text })));
};

module.exports = router;
