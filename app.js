const express = require("express");
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();
const postRouter = require('./routes/postRouter')
const globalErrorHandler = require('./controllers/errorController');
const mongoose = require('mongoose');
const AppError = require("./utils/appError");
const userRouter = require('./routes/userRouter');
const commentRouter = require('./routes/commentRouter');

const authController = require('./controllers/authController');

dotenv.config({
    path: "./config.env"
});

app.use(cors());

const DB = process.env.DATABASE.replace(
    "<db_password>",
    process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => {
    console.log("DB connection successful");
});

app.use(express.json());
app.get('/',(req,res) => {
    res.send("hello world")
})
app.use('/api/v1/posts', postRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/comments', commentRouter)


// app.route('/api/v1/test').post(authController.signup)


app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  });  
app.use(globalErrorHandler)


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})