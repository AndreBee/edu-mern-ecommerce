import React, {useState, useEffect} from "react";


const Checkbox = ({categories, handleFilters}) => {

    const [checked, setChecked] = useState([])

    const handleToggle = c => () => {
        // check if selected cat is already in state
        // indexOf returns the first index or -1
        const currentCategoryId = checked.indexOf(c)
        const newCheckedCategoryId = [...checked]

        if(currentCategoryId === -1){
            newCheckedCategoryId.push(c)
        } else {
            newCheckedCategoryId.splice(currentCategoryId, 1)
        }
        
        setChecked(newCheckedCategoryId)
        handleFilters(newCheckedCategoryId)
    }

    return categories.map((cat, index) => (
            <li onChange={handleToggle(cat._id)} value={checked.indexOf(cat._id === -1)} key={index} className="list-unstyled">
                <input type="checkbox" className="form-check-input"/>
                <label className="form-check-label">{cat.name}</label>
            </li>
        )
    )   
}

export default Checkbox