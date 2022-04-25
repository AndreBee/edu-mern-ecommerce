import React from "react";
import Layout from "./Layout";
import { getProducts } from "./apiCore";
import { useEffect, useState } from "react";
import Card from "./Card";
import { read } from "./apiCore";
import { listRelated } from "./apiCore";


const Product = (props) => {

    const [product, setProduct] = useState({})
    const [error, setError] = useState(false)
    const [relatedProduct, setRelatedProducts] = useState([])

    const loadSingleProduct = productId => {
        read(productId)
        .then(data => {
            if(data.error){
                setError(data.error)
            } else {
                setProduct(data)
                // fetch related products
                listRelated(data._id)
                .then(data => {
                    if(data.error){
                        setError(data.error)
                    } else {
                        setRelatedProducts(data)
                    }
                })
            }
        })
    }



    useEffect(() => {
        // grab product ID from URL slug
        const productId = props.match.params.productId
        loadSingleProduct(productId)
    }, [props])

    return (
        <Layout
            title={product && product.name}
            description={product && product.description && product.description.substring(0,100)}
            className="container-fluid"
        >
            <div className="row">
                <div className="col-8">
                    {
                        product &&
                        product. description &&
                        <Card product={product} showViewProductButton={false}/>
                    }
                </div>
                <div className="col-4">
                    <h4>Related products</h4>
                    {
                        relatedProduct.map((product, index) => (
                            <div className="mb-3">
                                <Card key={index} product={product}/>
                            </div>
                        ))
                    }
                </div>
            </div>
        </Layout>
    )
}

export default Product