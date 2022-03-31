exports.userSignupValidator = (req, res, next) => {
    console.log('validator')
    // methods from expr. validator package
    // we have added as middleware in app.js
    req.check('name', 'Name is required.')
       .notEmpty() 
    req.check('email', 'Email must be between 3 to 32 characters.')
       .matches(/.+\@.+\..+/) 
       .withMessage('Email must constain @')
       .isLength({
           min: 3,
           max: 32
       })
    
    req.check('password', 'Password is required.')
       .notEmpty()
    
    req.check('password', 'Password is required.')
       .isLength({min: 6})
       .withMessage('Password must contain at least 6 characters.')
       .matches(/\d/)
       .withMessage('Password must contain a number.')
    
    const errors = req.validationErrors()
    if(errors){
        const firstError = errors.map(error => error.msg)[0]
        return res.status(400).json({error: firstError})
    }

    next()

}