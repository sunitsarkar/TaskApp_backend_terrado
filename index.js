
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const app = express();
const bodyParser = require('body-parser');
const db_connection = require('./dbConnection/db')
const Routes = require('./router/router')
require('dotenv').config();



db_connection();
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());
app.use('/', Routes)

app.listen(8080, ()=>{
    console.log(`Server is running on port...8080`)


})