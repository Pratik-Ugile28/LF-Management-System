var express = require('express')
const app = express()
require('dotenv').config();
const cors = require('cors')
// const port = 8000
const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT || 8000;
const cookie_parser = require("cookie-parser")
const mongoose = require('mongoose')
const routes = require('./routes/auth')
const category = require('./routes/category')
const passport = require('passport');
var path = require('path');

app.enable("trust proxy")

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(cookie_parser())
app.use(express.json())
app.use(passport.initialize())
app.use(passport.session())

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lostfound';
if (!process.env.MONGODB_URI) {
  console.warn('Warning: MONGODB_URI is not defined in environment. Falling back to local MongoDB at', mongoUri);
}

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
.then(() => {
    console.log('Database connected!')
})
.catch((err) => {
    console.error('Database connection error:', err);
    process.exit(1);
});

app.use('/', routes)
app.use('/', category)


app.listen(PORT, () => console.log(`Listening to port ${PORT} !!`))
