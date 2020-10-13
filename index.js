const express = require('express');
const app=express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//connecting server file for AWT
let server= require('./server');
let config= require('./config');
let middleware = require('./middleware');
const response = require('express');

//for  mongodb
 const MongoClient=require('mongodb').MongoClient;


//connecting express and mongodb
const url='mongodb://127.0.0.1:27017';
const dbName='HospitalInventory';
let db
MongoClient.connect(url, (err,client)=>{
    if(err) return console.log(err);
    db=client.db(dbName);
    console.log(`Connected Database: ${url}`);
    console.log(`Database : ${dbName}`);
});
//fetching hospital details
app.get('/hospitaldetails',middleware.checkToken,function (req,res){
    console.log("fetching data from hospital collection");
    var data=db.collection('Hospital').find().toArray()
    .then(result=> res.json(result));
});


//ventilator details
app.get('/-',function (req,res){
    console.log("ventilator details");
    var ventilatordetails = db.collection('Ventilator').find().toArray()
    .then(result=> res.json(result));
});



//search ventilators by status
app.post('/searchventbystatus',middleware.checkToken,(req,res)=>{
    var Status =req.body.Status;
    console.log(Status);
    var ventilatordetails = db.collection('Ventilator')
    .find({"Status":Status}).toArray().then(result  => res.json(result));
});

//search ventilators by hospital name
app.post('/searchventbyname',middleware.checkToken,(req,res)=>{
    var Name = req.query.Name;
    console.log(Name);
    var ventilatordetails =db.collection('Ventilator')
    .find({'Name':new RegExp(Name,'i')}).toArray().then(result => res.json(result));
});

//search hospital by name
app.post('/searchhospital',middleware.checkToken,(req,res)=>{
    var Name = req.query.Name;
    console.log(Name);
    var hospitaldetails =db.collection('Hospital')
    .find({'Name':new RegExp(Name,'i')}).toArray().then(result => res.json(result));
});


//update ventilator details
app.put('/ventdetails',middleware.checkToken,function(req,res){
    console.log("updating data of ventilators collection");
    var v={VentilatorId:req.body.VentilatorId};
    var Status={$set: {Status:req.body.Status}};
    db.collection('Ventilator').updateOne(v,Status,function(err,res){
        console.log("updated");
    });
    res.send("data updated");
});

//update Hospital details
app.put('/Hospitaldetails',middleware.checkToken,function(req,res){
    console.log("updating data of Hospital collection");
    var v={VentilatorId:req.body.VentilatorId};
    var HId={$set: {HId:req.body.HId}};
    db.collection('Ventilator').updateOne(v,HId,function(err,res){
        console.log("updated");
    });
    res.send("data updated");
});

//add ventilator
app.post('/addventilator',middleware.checkToken,(req, res)=>{
    var HId=req.body.HId;
    var VentilatorId=req.body.VentilatorId;
    var Status =req.body.Status;
    var Name=req.body.Name;
    var item=
    {
        HId:HId,VentilatorId:VentilatorId,Status:Status ,Name :Name
    };
    db.collection('Ventilator').insertOne(item, function(err, result){
        res.json("item inserted");
    });
});


//delete the ventilator by vid
app.delete('/delete',middleware.checkToken,(req,res) => {
    var ventId=req.body.VentilatorId;
    var myquery1 ={VentilatorId:ventId};
     db.collection('Ventilator').deleteOne(myquery1,function(err, obj){
         if(err) throw err;
         else res.json("1 document deleted");
    });
})
app.listen(3000);