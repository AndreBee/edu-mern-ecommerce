import React, {useState} from "react";
import { Link } from "react-router-dom";
import Layout from "../core/Layout";
import { signin } from "../auth";

const Signin = () => {

    const [values, setValues] = useState({
        email: '',
        password: '',
        error: '',
        loading: false
    })

    // destructuring values in the state
    const {name, email, password, success, error} = values

    const handleChange = name => event => {
        setValues({...values, error: false, [name]: event.target.value})
    }

    const clickSubmit = (event) => {
        event.preventDefault()
        setValues({...values, error: false})
        signin({email, password})
            .then(data => {
                if(data.error){
                    setValues({...values, error: data.error, success: false})
                } else {
                    setValues({...values, name: '', email: '', password: '', error: '', success: true})
                }
            })
    }


    const signUpForm = () => (
        <form>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input 
                    onChange={handleChange('email')} 
                    type="email" 
                    className="form-control" 
                    value={email}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Password</label>
                <input 
                    onChange={handleChange('password')} 
                    type="password" 
                    className="form-control" 
                    value={password} 
                />
            </div>
            <button onClick={clickSubmit} className="btn btn-primary">Submit</button>
        </form>
    )


    const showError = () => (
        <div className="alert alert-danger" style={{display: error ? '' : 'none'}}>
            {error}
        </div>
    )

    const showSuccess = () => (
        <div className="alert alert-success" style={{display: success ? '' : 'none'}}>
            New account is created. Please <Link to="/signin">sign in.</Link>
        </div>
    )

    return (
        <Layout
        title="Sign up"
        description="Please sign up into your account."
        className="container col-md-8 offset-md-2"
        >
           {showSuccess()}
           {showError()}
           {signUpForm()}
        </Layout>
    )
}

export default Signin