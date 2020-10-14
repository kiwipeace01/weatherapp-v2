const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const https=require("https");
const bodyparser=require("body-parser");

router.get('/login',(req,res) => res.render('login'));

router.get('/register',(req,res) => res.render('register'));

router.post('/register',(req,res) => {
	const { name,email,password,password2 } = req.body;
	let errors = [];
	//checking fields

	if(!name || !email || !password2 || !password2){
		errors.push({msg : 'Please fill in all fields'});
	}

	if(password !== password2){
		errors.push({ msg: 'Passwords do not match '});
	}

	if(password.length < 6){
		errors.push({msg: 'Password should be atleast 6 characters'});
	}

	if(errors.length > 0){
		res.render('register',{
			errors,
			name,
			email,
			password,
			password2
		});
	}else{
		//validation Password
		User.findOne({email: email})
			.then(user =>{
				if(user) {
				errors.push({msg: 'Email is already registered'});
					res.render('register',{
					errors,
					name,
					email,
					password,
					password2
		});
				} else {
					const newUser = new User({
						name,
						email,
						password
					});

					//Hash Password
					bcrypt.genSalt(10, (err,salt) => 
						bcrypt.hash(newUser.password,salt, (err,hash)=> {
							if(err) throw err;

							newUser.password = hash;
							newUser.save()
								.then(user => {
									req.flash('sucess_msg','You are now registered and logged in');
									res.redirect('/users/login');
								})
								.catch(err => console.log(err));
					}))
				}
			});
	}
});

router.post('/login',(req,res,next) => {
	passport.authenticate('local',{
	successRedirect: '/dashboard', 
	failureRedirect: '/users/login',
	failureFlash: true
})(req,res,next);
});


router.get("/weatherdata",function(req,res){

    res.render('weatherdata');
})


router.post("/weatherdata",function(req,res){
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

router.get('/logout',(req,res) => {
	req.logout();
	req.flash('success_msg','You are logged out');
	res.redirect('/users/login');
});

module.exports = router;