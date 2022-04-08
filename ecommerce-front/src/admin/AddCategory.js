import React, { useState } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";


const AddCategory = () => {
    // state
    const [name, setName] = useState('')
    const [error, setError] = useState(false)
    const [success, setSuccess] = useState(false)

    // destructure user and info from localStorate
    const {user, token} = isAuthenticated()

    // component methods
    const handleChange = (e) => {
        setError('')
        setName(e.target.value)
    }

    const clickSubmit = (e) => {
        e.preventDefault()
        setError('')
        setSuccess(false)

        // make request to API to create cat.
    }

    const newCategoryForm = () => (

        <form onSubmit={clickSubmit}>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input 
                    type="text" 
                    className="form-control" 
                    onChange={handleChange} 
                    value={name}
                    autoFocus
                />
                <button className="btn btn-outline-primary">Create Category</button>
            </div>
        </form>
    )

    return (
        <Layout
            title="Add a new Category"
            description={`Hi, ${name}, ready to add a new category?`}
        >
            
        <div className="row">
            <div className="col-md-8 offset-md-2">
                {newCategoryForm()}
            </div>
        </div>
        </Layout>
    )
}

export default AddCategory