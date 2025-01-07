const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid email"]
    },
    photo: {
        type: String
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, "Password confirm is required"],
        validate: {
            // THIS ONLY WORKS ON CREATE AND SAVE NOT UPDATE
            validator: function(el) {
                return el === this.password;
            },
            message: "Passwords do not match"
        }
    },
    // posts: [{
    //     type: mongoose.Schema.ObjectId,
    //     ref: "Post"
    // }],
    passwordChangedAt: Date,
    
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  });

userSchema.pre("save", async function(next) {
    // run this code before the document is saved and when a document is modified
    if(this.isModified("password")) {
        // hash the password
        this.password = await bcrypt.hash(this.password, 12);
        this.passwordConfirm = undefined;
    }
    next();
})

// userSchema.pre(/^find/, function(next) {
//     this.populate({
//         path: 'posts'
//     })
//     next();
// })




userSchema.virtual('posts', {
    ref: 'Post',
    foreignField: 'user',
    localField: '_id'
})

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if(this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        console.log(changedTimestamp, JWTTimestamp);
        return JWTTimestamp < changedTimestamp;
    }
    // False means NOT changed
    return false;
}


const User = mongoose.model('User', userSchema);

module.exports = User;