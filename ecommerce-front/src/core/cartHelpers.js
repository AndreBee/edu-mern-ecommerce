export const addItem = (item, next) => {
    // initialize an empty cart
    let cart = []

    if(typeof window !== undefined){
        if(localStorage.getItem('cart')){
            // if we have item in LS, populate
            // the cart with them and convert to 
            // object with JSON.parse()
            cart = JSON.parse(localStorage.getItem('cart'))
        }

        // push new item to the cart
        cart.push({
            ...item,
            count: 1
        })

        // make sure if the user selects same product twice
        // the count is increased by 1 instead of having the 
        // same product twice in the cart
        cart = Array.from(new Set(cart.map((p)=> (p._id)))).map(id => {
            return cart.find(p => p._id === id)
        })

        // save cart back again into LS
        localStorage.setItem('cart', JSON.stringify(cart))
        next()
    }
}

export const itemTotal = () => {
    if(typeof window !== undefined){
        if(localStorage.getItem('cart')){
            // get length of cart array
            return JSON.parse(localStorage.getItem('cart')).length
        }
    }

    return 0
}

export const getCart = () => {
    if(typeof window !== undefined){
        if(localStorage.getItem('cart')){
            // get length of cart array
            return JSON.parse(localStorage.getItem('cart'))
        }
    }

    return []
}

export const updateItem = (productId, count) => {
    let cart = []
    if(typeof window !== undefined){
        if(localStorage.getItem('cart')){
            // setting the cart array as the LS list of items
            cart = JSON.parse(localStorage.getItem('cart'))
        }

        // map through items in cart and find the one
        // that matches the current item
        cart.map((product, index) => {
            if(product._id === productId) {
                cart[index].count = count
            }
        })

        // after we update the count for the item
        // we update LS as well
        localStorage.setItem('cart', JSON.stringify(cart))
    }
}

export const removeItem = (productId) => {
    let cart = []
    if(typeof window !== undefined){
        if(localStorage.getItem('cart')){
            // setting the cart array as the LS list of items
            cart = JSON.parse(localStorage.getItem('cart'))
        }

        // map through items in cart and find the one
        // that matches the current item
        cart.map((product, index) => {
            if(product._id === productId) {
                // remove item from cart
                cart.splice(index, 1)
            }
        })

        // after we update the count for the item
        // we update LS as well
        localStorage.setItem('cart', JSON.stringify(cart))
    }

    return cart
}


export const emptyCart = next => {
    if(typeof window !== undefined){
        localStorage.removeItem('cart')
        next()
    }
}