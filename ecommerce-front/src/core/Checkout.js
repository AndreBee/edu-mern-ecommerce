import React from "react";
import Layout from "./Layout";
import { getProducts } from "./apiCore";
import { useEffect, useState } from "react";
import Card from "./Card";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import { getBraintreeClientToken } from "./apiCore";
import DropIn from "braintree-web-drop-in-react";
import { processPayment } from "./apiCore";
import { emptyCart } from "./cartHelpers";


const Checkout = ({products}) => {

    const [data, setData] = useState({
        success: false,
        clientToken: null,
        error: '',
        instance: {},
        address: ''
    })

    // get Braintree token
    const userId = isAuthenticated() && isAuthenticated().user._id
    const token = isAuthenticated() && isAuthenticated().token

    const getToken = (userId, token) => {
        getBraintreeClientToken(userId, token)
        .then(data => {
            if(data.error){
                setData({...data, error: data.error})
            } else {
                setData({clientToken: data.clientToken})
            }
        })
    }

    useEffect(() => {
        getToken(userId, token)
    }, [])

    const getTotal = () => {
        return products.reduce((currentValue, nextValue) => {
            return currentValue + nextValue.count * nextValue.price
        }, 0)
    }

    const showCheckout = () => {
        return isAuthenticated() ? (
            <div>{showDropIn()}</div>
        ) : (
            <Link to="/signin">
                <button className="btn btn-primary">Sign in to check out</button>
            </Link>
        )
    }

    const buy = () => {
        // send the nonce to the server
        // nonce = data.instance.requestPaymentMethod()
        let nonce
        let getNonce = data.instance
        .requestPaymentMethod()
        .then(res => {
            nonce = res.nonce
            // once we have payment method in nonce
            // we send nonce as "paymentMethodNonce" to backend
            // with also total to be charged
            const paymentData = {
                paymentMethodNonce: nonce,
                amount: getTotal(products)
            }

            processPayment(userId, token, paymentData)
            .then(response => {
                console.log(response)
                setData({...data, success: response.success})
                // empty cart
                emptyCart(() => {
                    console.log('payment success and empty cart.')
                })
                
                // create order
            })
            .catch(error => console.log(error))
        })
        .catch(err => {
            //console.log('DropIn error: ', err)
            setData({...data, error: err.message})
        })
    }

    const showDropIn = () => (
        // show payment getway if we have Braintree token
        // and at least 1 product in cart
        <div onBlur={() => setData({...data, error: ''})}>
            {data.clientToken !== null && products.length > 0 ? (
                <div>
                    <DropIn 
                        options={{
                            authorization: data.clientToken,
                        }}
                        onInstance={instance => (data.instance = instance)} 
                    />
                    <button 
                        className="btn btn-success btn-block"
                        onClick={buy}
                    >
                        Pay
                    </button>
                </div>
            ) : null}
        </div>
    )

    const showError = err => (
        <div className="alert alert-danger" style={{display: err ? '' : 'none'}}>
            {err}
        </div>
    )

    const showSuccess = success => (
        <div className="alert alert-info" style={{display: success ? '' : 'none'}}>
            Thanks, your payment was successful!
        </div>
    )

    return <div>
            <h2>Total: ${getTotal()}</h2>
            {showSuccess(data.success)}
            {showCheckout()}
            {showError(data.error)}
        </div>
    
}

export default Checkout
