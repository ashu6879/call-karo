// index.js

const twilio = require('twilio');
require('dotenv').config();  // Load environment variables

const accountSid = process.env.Account_SID;  // Twilio Account SID from .env
const authToken = process.env.Auth_Token;    // Twilio Auth Token from .env
const client = new twilio(accountSid, authToken);

// List of contact numbers to call
const contacts = ['+917404506030'];
let contactIndex = 0;  // Start with the first contact

// URL of the MP3 file to play
const mp3Url = 'http://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

// Function to make a call
const makeCall = (contact) => {
  client.calls
    .create({
      to: contact,
      from: '1 224 701 3225',  // Your Twilio verified phone number
      url: `http://twimlets.com/message?Message%5B0%5D=${encodeURIComponent(mp3Url)}`,  // URL that plays the MP3 file
      statusCallback: 'https://call-karo.vercel.app/api/call-status',  // Vercel serverless function URL
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

// Initiate first call
if (contacts.length > 0) {
  callNextContact();
} else {
  console.log('No contacts to call.');
}
