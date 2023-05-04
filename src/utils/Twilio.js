const twilio = require("twilio");

module.exports.sendMessage = async (mobileNo, message) => {
    //mobileNo, message, process.env.TWILLIO_SID,  process.env.TWILLIO_AUTH_TOKEN

    const client = new twilio(process.env.TWILLIO_SID, process.env.TWILLIO_AUTH_TOKEN);

    return client.messages
    .create({
        body: message,
        to: '+91'+mobileNo, // Text this number
        from: process.env.TWILLIO_FROM_NO, // From a valid Twilio number
    })
    
}

