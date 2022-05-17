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
import { createOrder } from "./apiCore";


const Checkout = ({products, setRun = f => f, run = undefined}) => {

    const [data, setData] = useState({
        success: false,
        clientToken: null,
        error: '',
        instance: {},
        address: '',
        loading: false,
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
        setData({loading: true})
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
    
                // create order
                const createOrderData = {
                    products: products,
                    transaction_id: response.transaction.id,
                    amount: response.transaction.amount,
                    address: data.address
                }

                createOrder(userId, token, createOrderData)
                .then(response => {
                    // empty cart
                    emptyCart(() => {
                        console.log('payment success and empty cart.')
                        setRun(!run)
                        setData({
                            loading: false, 
                            success: true
                        })
                    })
                })            
                .catch(error => {
                    console.log(error)
                    setData({loading: false})
                })
        })
        .catch(err => {
            //console.log('DropIn error: ', err)
            setData({loading: false})
        })
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
                    <div className="gorm-group mb-3">
                        <label className="text-muted">Delivery address</label>
                        <textarea
                            onChange={handleAddress}
                            className="form-control"
                            value={data.address}
                            placeholder="Type your delivery address here..."
                        />
                    </div>
                    <DropIn 
                        options={{
                            authorization: data.clientToken,
                            paypal: {
                                flow: 'vault'
                            }
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

    const handleAddress = event => {
        setData({...data, address: event.target.value})
    }

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

    const showLoading = (loading) => (
        loading && (<h2>Loading...</h2>)
    )

    return <div>
            <h2>Total: ${getTotal()}</h2>
            {showLoading(data.loading)}
            {showSuccess(data.success)}
            {showCheckout()}
            {showError(data.error)}
        </div>
    
}

export default Checkout
