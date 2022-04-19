import React from "react";
import Layout from "./Layout";
import { useEffect, useState } from "react";
import Card from "./Card";
import { getCategories } from "./apiCore";
import Checkbox from "./Checkbox";
import RadioBox from "./RadioBox";
import { prices } from "./FixedPrices";


const Shop  = () => {

    const [categories, setCategories] = useState([])
    const [error, setError] = useState(false)
    const [myFilters, setMyFilters] = useState({
        filters: {
            category: [],
            price: []
        }
    })

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

    useEffect(() => {
        init()
    },[])

    const handleFilters = (filters, filterBy) => {
        // update filter state with cat or price
        const newFilters = {...myFilters}
        newFilters.filters[filterBy] = filters

        if(filterBy === 'price'){
            let priceValues = handlePrice(filters)
            newFilters.filters[filterBy] = priceValues
        }
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
                    {JSON.stringify(myFilters)}
                </div>
            </div>
        </Layout>
    )
}

export default Shop