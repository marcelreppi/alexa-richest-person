const Alexa = require('alexa-sdk');
const https = require('https');
const JSDOM = require('jsdom').JSDOM

const handlers = {
  'LaunchRequest': function () {
    this.emit('GetPersonIntent')
  },
  'GetPersonIntent': function () {
    https.get('https://www.therichest.com/top-lists/top-250-richest-people-in-the-world/', (response) => {
        
      let html = ''
      response.on('data', (data) => {
        html += data.toString()
      })
      
      response.on('end', () => {
        const dom = new JSDOM(html)
        const name = dom.window.document.querySelector('.list-profile-name').textContent.trim()
        const netWorth = dom.window.document.querySelector('.list-networth').textContent.trim().split(' ')[0].substring(1) 
        this.emit(':tell', `Die reichste Person ist momentan ${name} mit einem Vermögen von ${netWorth} Milliarden US Dollar`)
      })
    })
  },
  'AMAZON.HelpIntent': function () {
    const speechOutput = 'Du kannst sagen: "Alexa öffne reichste Person". Wie kann ich dir helfen?';
    const reprompt = 'Wie kann ich dir helfen?';
    this.emit(':ask', speechOutput, reprompt);
  },
  'AMAZON.CancelIntent': function () {
    this.emit(':tell', 'Auf Wiedersehen!');
  },
  'AMAZON.StopIntent': function () {
    this.emit(':tell', 'Auf Wiedersehen!');
  },
  'SessionEndedRequest': function () {
    this.emit(':tell', 'Auf Wiedersehen!');
  },
  'Unhandled': function () {
    this.emit(':tell', 'Es tut mir Leid! Das habe ich nicht verstanden. Du kannst sagen: "Alexa öffne reichste Person". Versuche es erneut.');
  }
};

exports.handler = function (event, context) {
  const alexa = Alexa.handler(event, context);
  alexa.registerHandlers(handlers);
  alexa.execute();
};
