const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');


exports.signup = catchAsync(async(req,res) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });
    const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
    res.status(201).json({
        "status": "success",
        "token": token,
        "data": {
            "user": newUser
        }
    })
});

exports.login = catchAsync(async(req,res, next) => {
    const {email, password} = req.body;
    if(!email || !password) {
       return next(new AppError("Please provide email and password", 400));
    }
    const user = await User.findOne({email}).select("+password");
    if(!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError("Incorrect email or password", 401));
    }
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
    res.status(200).json({
        "status": "success",
        "token": token,
    })
});

exports.protect = catchAsync(async(req, res, next) => {
    // 1) Getting token and check if it's there
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    if(!token) {
        return next(new AppError("You are not logged in! Please log in to get access", 401));
    }
    // 2) Verification token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if(!currentUser) {
        return next(new AppError("The user belonging to this token does no longer exist", 401));
    }

    // 4) Check if user changed password after the token was issued
    if(currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError("User recently changed password! Please log in again", 401));
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
})

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return next(new AppError("You do not have permission to perform this action", 403));
        }
        next();
    }
}
exportscompareId = catchAsync(async(req, res, next) => {
    const {id} = req.params;
    if(req.user.id !== id) {
        return next(new AppError("You do not have permission to perform this action", 403));
    }
    next();
})