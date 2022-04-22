import React from "react";
import Layout from "./Layout";
import { useEffect, useState } from "react";
import Card from "./Card";
import { getCategories } from "./apiCore";
import Checkbox from "./Checkbox";
import RadioBox from "./RadioBox";
import { prices } from "./FixedPrices";
import { getFilteredProducts } from "./apiCore";


const Shop  = () => {

    const [categories, setCategories] = useState([])
    const [error, setError] = useState(false)
    const [myFilters, setMyFilters] = useState({
        filters: {
            category: [],
            price: []
        }
    })
    const [limit, setLimit] = useState(6)
    const [skip, setSkip] = useState(0)
    const [filteredResults, setFilteredResults] = useState([])

    const [size, setSize] = useState(0)

    // load categories and set form data
    const init = () => {
        getCategories().then(data => {
            if(data.error){
                setError(data.error)
            } else {
                setCategories(data)
            }
        })
    }

    const loadFilteredResults = newFilters => {
        getFilteredProducts(skip, limit, newFilters)
        .then(data => {
            if(data.error){
                setError(data.error)
            } else {
                setFilteredResults(data.data)
                setSize(data.size)
                setSkip(0)
            }
        })
    }

    const loadMore = () => {

        let toSkip = skip + limit

        getFilteredProducts(toSkip, limit, myFilters.filters)
        .then(data => {
            if(data.error){
                setError(data.error)
            } else {
                setFilteredResults([...filteredResults, ...data.data])
                setSize(data.size)
                setSkip(toSkip)
            }
        })
    }

    const loadMoreBtn = () => {
        return (
            size > 0 && size >= limit && (
                <button onClick={loadMore} className="btn btn-warning mb-5">
                    Load more
                </button>
            )
        )
    }

    useEffect(() => {
        init()
        loadFilteredResults(skip, limit, myFilters.filters)
    },[])

    const handleFilters = (filters, filterBy) => {
        // update filter state with cat or price
        const newFilters = {...myFilters}
        newFilters.filters[filterBy] = filters

        if(filterBy === 'price'){
            let priceValues = handlePrice(filters)
            newFilters.filters[filterBy] = priceValues
        }
        loadFilteredResults(myFilters.filters)
        setMyFilters(newFilters)
    }

    const handlePrice = value => {
        const data = prices
        let array = []
        for(let key in data){
            if(data[key]._id === parseInt(value)){
                array = data[key].array
            }
        }
        return array
    }

    return (
        <Layout
            title="Shop"
            description="Find dev books of your choice!"
            className="container-fluid"
        >
            <div className="row">
                <div className="col-4">
                    <h4>Filter by Category</h4>
                    <ul>
                        <Checkbox 
                            categories={categories}
                            handleFilters={filters => handleFilters(filters, 'category')}
                        />
                    </ul>

                    <h4>Filter by Price Range</h4>
                    <div>
                        <RadioBox 
                            prices={prices}
                            handleFilters={filters => handleFilters(filters, 'price')}
                        />
                    </div>
                </div>
                <div className="col-8">
                    <h2 className="mb-4">Products</h2>
                    <div className="row">
                        {filteredResults.map((product, index)=> (
                            <div key={index} className="col-4 mb-3">
                                <Card product={product} />
                            </div>
                        ))}
                    </div>
                    <hr/>
                    {loadMoreBtn()}
                </div>
            </div>
        </Layout>
    )
}

export default Shop