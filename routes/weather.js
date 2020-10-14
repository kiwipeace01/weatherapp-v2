const express=require("express");
const https=require("https");
const bodyparser=require("body-parser");
const app=express();
const ejs = require("ejs");

app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({extended: true}));

app.get("/",function(req,res){

    res.sendFile(__dirname+"/index.html");
})


app.post("/",function(req,res){
    const city=req.body.city;
    console.log(city);
    const url="https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid=9a66a6ec27fc7ac0a35f71c9b3927aff&units=Metric" ;
    https.get(url,function(response){
        console.log(response.statusCode);

        response.on("data",function(data){
            const weatherdata=JSON.parse(data);
            const cityname=weatherdata.name;
            const weathericon=weatherdata.weather[0].icon;
            const coord=weatherdata.coord;
            src="https://openweathermap.org/img/wn/"+weathericon+"@2x.png";
            res.render("weatherdata",{temp:weatherdata.main.temp,forecast:weatherdata.weather[0].description,city:cityname,coord:coord,
                icon:src,humid:weatherdata.main.humidity,winds:weatherdata.wind.speed,feels:weatherdata.main.feels_like});
        })
    })
  
})

app.listen(3000,function(){
    console.log("starting on port 3000.....");
})
