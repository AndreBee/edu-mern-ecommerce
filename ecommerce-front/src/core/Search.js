import React from "react";
import { getCategories } from "./apiCore";
import { useEffect, useState } from "react";
import Card from "./Card";
import { list } from "./apiCore";


const Search = () => {

    const [data, setData] = useState({
        categories: [],
        category: '',
        search: '',
        results: [],
        searched: false
    })

    // destructuring obj in the state
    const {categories, category, search, results, searched} = data

    const loadCategories = () => {
        getCategories()
        .then(data => {
            if(data.error){
                console.log(data.error)
            } else {
                setData({...data, categories: data})
            }
        })
    }
    
    useEffect(() => {
        loadCategories()
    }, [])

    const searchData = () => {
        if(search){
            // sending search parameters to list function
            list({search: search || undefined, category: category})
            .then(response => {
                if(response.error){
                    console.log(response.error)
                } else {
                    setData({...data, results: response, searched: true})
                }
            }
            )
        }
    }

    const searchSubmit = (e) => {
        e.preventDefault()
        searchData()
    }

    const handleChange = (name) => (event) => {
        setData({...data, [name]: event.target.value, searched: false})
    }

    const searchMessage = (searched, results) => {
        if(searched && results.length > 0){
            return `Found ${results.length} products`
        }
        if(searched && results.length < 1){
            return `No products found.`
        }
    } 

    // argument with default value empty array
    const searchedProducts = (results = []) => {
        return (
            <div>
                <h2 className="mt-4 mb-4">
                    {searchMessage(searched, results)}
                </h2>
                <div className="row">
                    {results.map((product, index) => (
                        <Card key={index} product={product}/>
                    ))}
                </div>
            </div>
        )
    }

    const searchForm = () => (
        <form onSubmit={searchSubmit}>
            <span className="input-group-text">
                <div className="input-group input-group-lg">
                    <div className="input-group-prepend">
                        <select className="btn mr-2" onChange={handleChange('category')}>
                            <option value="All">Any category</option>
                            {categories.map((cat, index) => (
                                <option key={index} value={cat._id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <input 
                        type="search"
                        className="form-control"
                        onChange={handleChange('search')}
                        placeholder="Search by name"
                    />
                </div>
                <div className="btn input-group-append" style={{border: "none"}}>
                    <button className="input-group-text">Search</button>
                </div>
            </span>
        </form>
    )

    return (
        <div className="row">
            <div className="container mb-3">
                {searchForm()}
                <div className="container-fluid">
                    {searchedProducts(results)}
                </div>
            </div>
        </div>
    )
}

export default Search