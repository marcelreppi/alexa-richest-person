'use strict';

const Alexa = require('alexa-sdk');
const http = require('http');

const APP_ID // removed from public


const handlers = {
    'LaunchRequest': function () {
        this.emit(':tell', 'Herzlich Willkommen zu Reichste Person. Du kannst mich fragen: Wer ist die reichste Person? Probier es aus!');
    },
    'GetPersonIntent': function () {
        http.get('http://www.therichest.com/top-lists/top-250-richest-people-in-the-world/', (response) => {
          
          let html = ''
          response.on('data', (data) => {
            html += data.toString()
          })
          
          response.on('end', () => {
            const rankIndex = html.indexOf('<td class="rank">#1</td>')
            const nameStart = html.indexOf('<span>', rankIndex) + 6
            const nameEnd = html.indexOf('</span>', nameStart)
            const name = html.substring(nameStart, nameEnd)
            
            const s = '<td class="netWorth">'
            const netWorthStart = html.indexOf(s , nameEnd) + s.length
            const netWorthEnd = html.indexOf('</td>', netWorthStart)
            const netWorth = html.substring(netWorthStart + 1, netWorthEnd - 2)
            
            this.emit(':tell', `Die reichste Person ist momentan ${name} mit einem Vermögen von ${netWorth} Milliarden US Dollar`)
          })
        })
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = 'Du kannst fragen: "Wer ist die reichste Person der Welt?". Wie kann ich dir helfen?';
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
        this.emit(':tell', 'Es tut mir Leid! Das habe ich nicht verstanden. Du kannst fragen: "Wer ist die reichste Person der Welt?". Versuche es erneut.');
    }
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
