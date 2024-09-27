const express = require('express');
const twilio = require('twilio');
const bodyParser = require('body-parser');
require('dotenv').config();  // Load environment variables

const accountSid = process.env.Account_SID;  // Twilio Account SID from .env
const authToken = process.env.Auth_Token;    // Twilio Auth Token from .env
const client = new twilio(accountSid, authToken);

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// List of contact numbers to call
const contacts = ['+919306533729'];
let contactIndex = 0;  // Start with the first contact

// URL of the MP3 file to play
const mp3Url = 'http://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

// Make the initial call to the first contact
const makeCall = (contact) => {
  client.calls
    .create({
      to: contact,
      from: '+917404506030',  // Your Twilio verified phone number
      url: `http://twimlets.com/message?Message%5B0%5D=${encodeURIComponent(mp3Url)}`,  // URL that plays the MP3 file
      statusCallback: 'https://call-karo.vercel.app/call-status',  // Replace with your ngrok or public URL
      statusCallbackEvent: ['completed', 'busy', 'failed', 'no-answer'],  // Call events to track
    })
    .then(call => console.log(`Call initiated to ${contact}. Call SID: ${call.sid}`))
    .catch(err => console.error(`Error calling ${contact}:`, err));
};

// Function to call the next contact
const callNextContact = () => {
  if (contactIndex < contacts.length) {
    const nextContact = contacts[contactIndex];
    console.log(`Calling next contact: ${nextContact}`);
    makeCall(nextContact);
    contactIndex++;
  } else {
    console.log('All contacts have been called.');
  }
};

// Endpoint to handle call status
app.post('/call-status', (req, res) => {
  const callStatus = req.body.CallStatus;
  console.log(`Call Status: ${callStatus}`);

  if (['completed', 'failed', 'busy', 'no-answer'].includes(callStatus)) {
    // Call the next contact if the current call is finished, failed, or unanswered
    callNextContact();
  }

  res.sendStatus(200);
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  if (contacts.length > 0) {
    // Start by calling the first contact
    callNextContact();
  } else {
    console.log('No contacts to call.');
  }
});
