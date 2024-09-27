// api/call-status.js

export default function handler(req, res) {
    if (req.method === 'POST') {
      const callStatus = req.body.CallStatus;
      console.log(`Call Status: ${callStatus}`);
  
      // Handle call statuses like completed, failed, busy, no-answer
      if (['completed', 'failed', 'busy', 'no-answer'].includes(callStatus)) {
        // Logic to handle next call (use database or persistent store if needed)
        console.log("Call completed or not answered. Prepare next call.");
        // Call next contact function can be triggered here
      }
  
      res.status(200).json({ message: 'Status received' });
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  }
  