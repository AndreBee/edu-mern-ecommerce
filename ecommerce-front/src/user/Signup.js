import React, {useState} from "react";
import { API } from "../config";
import Layout from "../core/Layout";

const Signup = () => {

    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        error: '',
        success: false
    })

    // destructuring values in the state
    const {name, email, password} = values

    const handleChange = name => event => {
        setValues({...values, error: false, [name]: event.target.value})
    }

    const signup = (user) => {
        // send data to backend
        fetch(`${API}/signup`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(user)
        })
        .then(response => {
            return response.json()
        })
        .catch(err => {
            console.log(err)
        })
    }

    const clickSubmit = (event) => {
        event.preventDefault()
        signup({name, email, password})
    }


    const signUpForm = () => (
        <form>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input onChange={handleChange('name')} type="text" className="form-control" />
            </div>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input onChange={handleChange('email')} type="email" className="form-control" />
            </div>
            <div className="form-group">
                <label className="text-muted">Password</label>
                <input onChange={handleChange('password')} type="password" className="form-control" />
            </div>
            <button onClick={clickSubmit} className="btn btn-primary">Submit</button>
        </form>
    )

    return (
        <Layout
        title="Sign up"
        description="Please sign up into your account."
        className="container col-md-8 offset-md-2"
        >
           {signUpForm()}
           {JSON.stringify(values)}
        </Layout>
    )
}

export default Signup