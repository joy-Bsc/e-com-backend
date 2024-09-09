const express = require('express');
const router = require('./src/routes/api')
const app = new express();
const bodyParser = require('body-parser');
const path = require('path');


//security middleware
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const cors = require('cors');
const cookieParser = require('cookie-parser');

//Database
const mongoose = require('mongoose');

//security middleware implement
app.use(cors({
    origin: 'http://http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
app.use(helmet());
app.use(mongoSanitize());
app.use(hpp());
app.use(cookieParser());

//body parser
app.use(bodyParser.json())

//rate limiter
const limiter =rateLimit({windowMs:15*60*100,max:3000})
app.use(limiter);

//database connection

async function main(){
    let URI="mongodb+srv://<username>:<password>@cluster0.thgjuqm.mongodb.net/MERN_Ecommerce?retryWrites=true&w=majority&appName=Cluster0"
    let OPTION={user:"joy",pass:"gvVDrmKNiKSF3XQt",autoIndex:true}
    await mongoose.connect(URI,OPTION);{
     console.log("connection success");
    }
    
}
main().catch(e=>console.log(e))

//managing backend routing
app.use("/api/v1",router)

//undefined routes
app.use("*",(req,res)=>{
    res.status(404).json({status:"fail",data:"404 not found"})
})

app.use(express.static('/client/dist'))


//add react frontend routes
app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'client','dist','index.html'))
}
)

module.exports=app;