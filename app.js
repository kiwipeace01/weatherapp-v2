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
    //https to request to an external server
    https.get(url,function(response){
        console.log(response.statusCode);
        //to get data from server
        response.on("data",function(data){
            //print hexadecimal data -> console.log(data);

            //prints in js format
            const weatherdata=JSON.parse(data);
            const cityname=weatherdata.name;
            const weathericon=weatherdata.weather[0].icon;
            const coord=weatherdata.coord;
            src="https://openweathermap.org/img/wn/"+weathericon+"@2x.png";
            console.log("temperature:",weatherdata.main.temp);
            
           // res.write("The weather in pune is " +weatherdata.main.temp+" degree Celsius") ;
           // res.write("<p>Forecast: "+weatherdata.weather[0].description+"</p>");
           // res.write("<h3>The weather in "+cityname+" is " +weatherdata.main.temp+" degree Celsius</h3>");
           // res.write("<img src='" + src+ "'/>");
        
            //res.write(img);
            //to print to browser
           // res.send();
            var obj={
                name:"anika",
                age:19
            };
            //converts to string format
            //console.log(JSON.stringify(obj));
            
            res.render("weatherdata",{temp:weatherdata.main.temp,forecast:weatherdata.weather[0].description,city:cityname,coord:coord,
                icon:src,humid:weatherdata.main.humidity,winds:weatherdata.wind.speed,feels:weatherdata.main.feels_like});
        })
    })
   // res.send("hi..the weather info..");

});

app.post("/daysforecast",function(req,res){
    var city=req.body.city;
    console.log("...........");
    console.log(city);
   
    const url="https://api.openweathermap.org/data/2.5/forecast?q="+city+"&units=metric&appid=9a66a6ec27fc7ac0a35f71c9b3927aff" ;
    //https to request to an external server
    https.get(url,function(response){
        console.log(response.statusCode);
        //to get data from server
        response.on("data",function(data){
            //print hexadecimal data -> console.log(data);

            //prints in js format
            const weatherdata=JSON.parse(data);
            const cityname=weatherdata.name;
            var sendlist=[];
            console.log(weatherdata.list[0].weather[0].description);
            var count=0;
            weatherdata.list.forEach(element => {
                     // console.log("yess..");
                     if(count%3==0){
                      sendlist.push(element);}
                      count++;           
              });
            res.render("daysforecast",{list:sendlist,city:weatherdata.city.name});
        })});
});

app.post("/today",function(req,res){
    var city=req.body.city;
    console.log("..........hey.");
    console.log(city);

    const url="https://api.openweathermap.org/data/2.5/forecast?q="+city+"&units=metric&appid=9a66a6ec27fc7ac0a35f71c9b3927aff" ;
    //https to request to an external server
    https.get(url,function(response){
        console.log(response.statusCode);
        //to get data from server
        response.on("data",function(data){
            //print hexadecimal data -> console.log(data);

            //prints in js format
            const weatherdata=JSON.parse(data);
            const cityname=weatherdata.name;
         //   console.log(weatherdata.list[0].weather[0].description)
            
            var today = new Date();
            console.log(today);
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();

            today =yyyy+'-'+mm+'-'+dd;
            var todaylist=[];
            var count=0;
            weatherdata.list.forEach(element => {
              //  console.log(element.dt_txt.substr(0,10));
                if(today==element.dt_txt.substr(0,10)){
                   // console.log("yess..");
                   if(count%2==0){
                    todaylist.push(element);}
                    count++;
                }
                
            });
          //  console.log(todaylist);
            res.render("today",{list:todaylist,city:city});

            
        })});
     
   
})

app.listen(3000,function(){
    console.log("starting on port 3000.....");
})