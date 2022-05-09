const User = require('../models/user')
const braintree = require('braintree')
require('dotenv').config() // get .env variables


// connect to Braintree
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,  
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY
}); 

exports.generateToken = (req, res) => {
    gateway.clientToken.generate({}, function(err, response){
        if(err){
            res.status(500).send(err)
        } else {
            res.send(response) // send res with token
        }
    })
}

exports.processPayment = (req, res) => {
    let nonceFromTheClient = req.body.paymentMethodNonce
    let amountFromTheClient = req.body.amount

    // charge the user
    let newTransaction = gateway.transaction.sale({
        amount: amountFromTheClient,
        paymentMethodNonce: nonceFromTheClient,
        options: {
            submitForSettlement: true
        }
    }, (error, result) => {
        // callback with err or result from the transaction
        if(error){
            res.status(500).json(error)
        } else {
            res.json(result)
        }
    })
}
