const router = require('express').Router();
const mongoose = require('mongoose');
const User = mongoose.model('Users');
const History = mongoose.model('History');

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

    if (await getUser(agent, data)) {
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
        balance: 0,
        earning: 0
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
  async function createNoAction(agent) {
    const { name } = req.body.queryResult.parameters;
    try {
      const { data } = req.body.originalDetectIntentRequest.payload;
      const profile = await client.getProfile(data.source.userId);
      let newUser = new User({
        lineId: data.source.userId,
        username: name,
        balance: 0,
        earning: 0
      });
      await newUser.save();
      console.log(newUser);
      agent.add('Account created successfully');
      agent.add('Use "help" command to see possible action');
    } catch (err) {
      next(err);
    }
  }

  //Check Intent Handler
  async function checkAction(agent) {
    const { data } = req.body.originalDetectIntentRequest.payload;
    //check is user already created an account
    const user = await getUser(agent, data);
    if (!user) return;

    agent.add('Balance: ' + user.balance);
    agent.add('Earning: ' + user.earning);
    const history = await History.find({ owner: user.lineId });
    for (let i = 0; i < history.length; i++) {
      agent.add(`Spend total of ${history[i].value} on ${history[i].type}`);
    }
  }

  //Add Intent Handler
  async function addAction(agent) {
    const { data } = req.body.originalDetectIntentRequest.payload;
    //check is user already created an account
    const user = await getUser(agent, data);
    if (!user) return;

    const { value } = req.body.queryResult.parameters;
    user.balance += value;
    user.earning += value;
    const newUser = await User.findByIdAndUpdate(user._id, user, { new: true });

    agent.add('Add: ' + value);
    agent.add('New balance: ' + newUser.balance);
  }

  //Expense Intent Handler
  async function expenseAction(agent) {
    const { type, value } = req.body.queryResult.parameters;
    const { data } = req.body.originalDetectIntentRequest.payload;

    const user = await getUser(agent, data);
    if (!user) return;
    console.log(type, value);

    //First char to upper case
    const newType = type.charAt(0).toUpperCase() + type.slice(1);
    const history = await History.findOne({ owner: user.lineId, type: newType });
    let newHistory = {};
    if (!history) {
      newHistory = new History({
        owner: user.lineId,
        type: newType,
        value: value
      });

      await newHistory.save();
      agent.add(`${newType} history does not exist`);
      agent.add(`${newType} history created`);
    } else {
      history.value += value;
      newHistory = await History.findByIdAndUpdate(history._id, history, { new: true });
    }
    user.balance -= value;
    const newUser = await User.findByIdAndUpdate(user._id, user, { new: true });

    agent.add(`Spend ${value} on ${newHistory.type}`);
    agent.add('New balance: ' + newUser.balance);
  }

  let intentMap = new Map();
  intentMap.set('Default Fallback Intent', defaultAction);
  intentMap.set('Create', createAction);
  intentMap.set('Create - Yes', createYesAction);
  intentMap.set('Create - No - Setup - Yes', createNoAction);
  intentMap.set('Check', checkAction);
  intentMap.set('Add - Yes', addAction);
  intentMap.set('Expense - Yes', expenseAction);

  agent.handleRequest(intentMap);
});

const replyText = (token, texts) => {
  texts = Array.isArray(texts) ? texts : [texts];
  return client.replyMessage(token, texts.map(text => ({ type: 'text', text })));
};

const getUser = async (agent, data) => {
  const user = await User.findOne({ lineId: data.source.userId }, null);
  if (user) {
    return user;
  }
  agent.add('You do not have account yet, please setup');
  return false;
};

module.exports = router;
