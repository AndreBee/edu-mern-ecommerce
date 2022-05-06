import React from "react";
import Layout from "./Layout";
import { getProducts } from "./apiCore";
import { useEffect, useState } from "react";
import Card from "./Card";
import { getCart } from "./cartHelpers";
import { Link } from "react-router-dom";
import Checkout from "./Checkout";


const Cart = () => {
    const [items, setItems] = useState([])
    const [run, setRun] = useState(false)

    useEffect(() => {
        setItems(getCart())
    }, [run])

    const showItems = items => {
        return (
            <div>
                <h2>Your cart has {`${items.length}`} items</h2>
                <hr/>
                {items.map((product, index) => (
                    <Card 
                        key={index} 
                        product={product} 
                        showAddToCartBtn={false}
                        cardUpdate={true}
                        showRemoveProductBtn={true}
                        setRun={setRun}
                        run={run}
                    />
                ))}
            </div>
        )
    }

    const noItemsMessage = () => (
        <h2>Your cart is empty.
            <hr/>
            <Link to="/shop">Continue shopping!</Link>
        </h2>
    ) 

    return (
        <Layout
            title="Shopping cart"
            description="Manage you cart items here."
            className="container-fluid"
        >
            <div className="row">
                <div className="col-6">
                    {items.length > 0 ? showItems(items) : noItemsMessage()}

                </div>

                <div className="col-6">
                    <h2 className="mb-4">Your cart summary</h2>
                    <hr/>
                    <Checkout products={items}/>
                </div>
            </div> 
        </Layout>
    )
}

export default Cart
