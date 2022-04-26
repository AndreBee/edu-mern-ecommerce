import React from "react";
import Layout from "./Layout";
import { getProducts } from "./apiCore";
import { useEffect, useState } from "react";
import Card from "./Card";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";


const Checkout = ({products}) => {

    const getTotal = () => {
        return products.reduce((currentValue, nextValue) => {
            return currentValue + nextValue.count * nextValue.price
        }, 0)
    }

    const showCheckout = () => {
        return isAuthenticated() ? (
            <button className="btn btn-success">Checkout</button>
        ) : (
            <Link to="/signin">
                <button className="btn btn-primary">Sign in to check out</button>
            </Link>
        )
    }

    return <div>
            <h2>Total: ${getTotal()}</h2>

            {showCheckout()}
        </div>
    
}

export default Checkout
