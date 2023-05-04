const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const bodyParser = require('body-parser');
const path  = require('path')
const router = require("./routes/index");
const { sendMailWithTemplate } = require("./utils/SendMail");
const MailDev = require("maildev");
const moment = require('moment')

// Config Envioronment Variable
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

const app = express()
const port  = process.env.PORT || 5000

// Restrict CORS 
app.use(cors({ credentials:true, origin:'*' }));

// Serve Static Content
app.use('/public', express.static(path.resolve(__dirname, '../public')))

// Setup Expres Parser and routes
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/', router);

// Handling Errors
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    res.status(err.statusCode).json({
      error: err.message,
    });
});

/*** development mail catcher**/
const maildev = new MailDev();
maildev.listen();


// setup express server port
app.listen(port, ()=> {
  console.log('Server running at port ', port, process.env.NODE_ENV)
});