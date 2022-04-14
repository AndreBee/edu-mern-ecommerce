import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import { createProduct } from "./apiAdmin";


const AddProduct = () => {

    // destructure
    const {user, token} = isAuthenticated()
    const [values, setValues] = useState({
        name: '',
        description: '',
        price: '',
        categories: [],
        category: '',
        shipping: '',
        quantity: '',
        photo: '',
        loading: false,
        error: '',
        createdProduct: '',
        redirectToProfile: false,
        formData: ''
    })

    // destructure values from state to use for the form creation
    const {
        name,
        description,
        price,
        categories,
        category,
        shipping,
        quantity,
        loading,
        error,
        createdProduct,
        redirectToProfile,
        formData
    } = values

    // using form data API which is available
    // in the browser when the component mounts
    useEffect(() => {
        setValues({...values, formData: new FormData()})
    }, [])

    // higher-order function: func returning another func
    const handleChange = name => event => {
        // if name param is photo, then use event.target.files where pic is
        // otherwise, use event.target.value
        const value = name === 'photo' ? event.target.files[0] : event.target.value
        formData.set(name, value)
        setValues({...values, [name]: value})

    }

    const clickSubmit = (event) => {
        // prevent default browser behaviour
        event.preventDefault()
        setValues({...values, error: '', loading: true})

        createProduct(user._id, token, formData)
        .then(data => {
            if(data.error){
                setValues({...values, error: data.error})
            } else {
                // empty form fields after submit
                setValues({
                    ...values, 
                    name: '', 
                    description: '', 
                    photo: '', 
                    price: '', 
                    quantity: '', 
                    loading: false, 
                    createdProduct: data.name
                })
            }
        })
    }

    // form method
    const newPostForm = () => (
        <form className="mb-3" onSubmit={clickSubmit}>
            <h4>Post Photo</h4>

            <div className="form-group">
                <label className="btn btn-secondary">
                    <input onChange={handleChange('photo')} type="file" name="photo" accept="image/*"></input>
                </label>
            </div>

            <div className="form-group">
                <label className="text-muted">Name</label>
                <input onChange={handleChange('name')} type="text" className="form-control" value={name}></input>
            </div>

            <div className="form-group">
                <label className="text-muted">Description</label>
                <textarea onChange={handleChange('description')} className="form-control" value={description}/>
            </div>

            <div className="form-group">
                <label className="text-muted">Price</label>
                <input onChange={handleChange('price')} type="number" className="form-control" value={price}></input>
            </div>

            <div className="form-group">
                <label className="text-muted">Category</label>
                <select 
                    onChange={handleChange('category')} 
                    className="form-control"
                >
                    <option value='hardCodedIdTest'>Python</option>
                </select>
            </div>

            <div className="form-group">
                <label className="text-muted">Quantity</label>
                <input onChange={handleChange('quantity')} type="number" className="form-control" value={quantity}></input>
            </div>

            <div className="form-group">
                <label className="text-muted">Shipping</label>
                <select 
                    onChange={handleChange('shipping')} 
                    className="form-control"
                >
                    <option value='0'>No</option>
                    <option value='1'>Yes</option>
                </select>
            </div>

            <button className="btn btn-outline-primary">Create Product</button>
        </form>
    )


    return (
        <Layout
            title="Add a new Product"
            description={`Hi, ${user.name}, ready to add a new product?`}
        >
            
        <div className="row">
            <div className="col-md-8 offset-md-2">
                {newPostForm()}
            </div>
        </div>
        </Layout>
    )
}

export default AddProduct