const router = require('express').Router();
const line = require('@line/bot-sdk');
const config = require('../../config.json');
const { WebhookClient, Payload } = require('dialogflow-fulfillment');
const { Card, Suggestion } = require('dialogflow-fulfillment');

const client = new line.Client(config);

app.post('/webhook', (req, res) => {
  console.log('WEBHOOK');
  const agent = new WebhookClient({ request: req, response: res });

  function bodyMassIndex(agent) {
    const { fulfillmentText } = req.body.queryResult;
    const { weight, height } = req.body.queryResult.parameters;
    // console.log(req.body.queryResult)

    agent.add(fulfillmentText);
    let bmi = (weight / ((height / 100) * (height / 100))).toFixed(2);
    console.log(weight, height, bmi);
    let result = 'Sorry, I did not understand';
    if (bmi < 18.5) {
      result = 'you are too thin, BMI=' + bmi;
    } else if (bmi >= 18.5 && bmi <= 22.9) {
      result = 'Naisu body, BMI=' + bmi;
    } else if (bmi >= 23 && bmi <= 24.9) {
      result = 'A bit chubby, BMI=' + bmi;
    } else if (bmi >= 25 && bmi <= 29.9) {
      result = 'Need exercise, BMI=' + bmi;
    } else if (bmi > 30) {
      result = 'See doctor ASAP, BMI=' + bmi;
    }
    agent.add(result);
  }

  async function richMenu(agent) {
    agent.add('payload');

    console.log(req.body.originalDetectIntentRequest.payload.data);
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        agent.add('wowowowow');
        resolve();
      }, 1000);
    });
    const { data } = req.body.originalDetectIntentRequest.payload;
    const payloadJson = {
      type: 'sticker',
      packageId: '11537',
      stickerId: '52002745'
    };

    var payload = new Payload('LINE', payloadJson, {
      sendAsMessage: true
    });

    agent.add(payload);
    // const echo = { type: "text", text: "Line client" };
    // return client.replyMessage(data.replyToken, echo);
  }

  function checkCommand(agent) {
    const { fulfillmentText } = req.body.queryResult;
    const { type } = req.body.queryResult.parameters;
    console.log(type);

    const { data } = req.body.originalDetectIntentRequest.payload;
    const echo = { type: 'text', text: 'Line client' };
    console.log(data.source.groupId)


  //   return client.replyMessage(data.replyToken, "Leaving Group").then(() =>
  //   client.leaveGroup(data.source.groupId)
  // );
    agent.add('fulfillmentText');
  }

  let intentMap = new Map();
  intentMap.set('BMI - custom - yes', bodyMassIndex);
  intentMap.set('Rich Menu', richMenu);
  intentMap.set('Check', checkCommand);

  agent.handleRequest(intentMap);
});

module.exports = router;
