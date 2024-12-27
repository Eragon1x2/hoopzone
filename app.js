const express = require("express");
const dotenv = require('dotenv');
const app = express();
const postRouter = require('./routes/postRouter')
const globalErrorHandler = require('./controllers/errorController');
const mongoose = require('mongoose');
const AppError = require("./utils/appError");
const userRouter = require('./routes/userRouter');

dotenv.config({
    path: "./config.env"
});


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

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  });  
app.use(globalErrorHandler)


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})