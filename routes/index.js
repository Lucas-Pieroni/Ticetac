var express = require('express');
var router = express.Router();

var city = ["Paris","Marseille","Nantes","Lyon","Rennes","Melun","Bordeaux","Lille"]
var date = ["2018-11-20","2018-11-21","2018-11-22","2018-11-23","2018-11-24"]

let JourneyModel = require("../models/journey");
const UserModel = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', { title: 'Express' });
});

router.get('/journey', function(req, res, next) {
  res.render('journey');
});


router.get('/login', async function(req, res, next) {
  var allUsers = await UserModel.find()
  res.render('login', { allUsers : allUsers });
});

router.post('/sign-in', async function(req, res, next){
  var erreur = ""
  // On vérifie si le mot de passe et le mail correspondent à une entrée dans la base de données
  var findLogs = await UserModel.findOne({email : req.body.email, password : req.body.password})
  console.log(findLogs)
  if(!findLogs){
    erreur = "Mot de passe ou email invalide"
    res.redirect("/login")
    return
  }
  res.redirect('/journey')
})

router.post("/sign-up", async function(req, res, next){
  // On vérifie si l'email est déjà stocké dans la base de données
  var userExists = await UserModel.findOne({email : req.body.newEmail})
  var erreur = ""
  console.log(userExists)
  if (userExists){
    erreur = "Cet email est déjà utilisé"
    console.log(erreur)
    res.redirect('/login')
    return
  }
  // Si l'email n'existe pas, on stocke les informations dans la base de données
  var newUser = new UserModel({
    name : req.body.newName,
    firstName : req.body.newFirstName,
    password : req.body.newPassword,
    email : req.body.newEmail,
    journeys : []
  })
  var userSaved = await newUser.save()
  res.redirect("/journey")
})



// Remplissage de la base de donnée, une fois suffit
router.get('/save', async function(req, res, next) {

  // How many journeys we want
  var count = 300

  // Save  ---------------------------------------------------
    for(var i = 0; i< count; i++){

    departureCity = city[Math.floor(Math.random() * Math.floor(city.length))]
    arrivalCity = city[Math.floor(Math.random() * Math.floor(city.length))]

    if(departureCity != arrivalCity){

      var newUser = new JourneyModel ({
        departure: departureCity , 
        arrival: arrivalCity, 
        date: date[Math.floor(Math.random() * Math.floor(date.length))],
        departureTime:Math.floor(Math.random() * Math.floor(23)) + ":00",
        price: Math.floor(Math.random() * Math.floor(125)) + 25,
      });
       
       await newUser.save();

    }

  }
  res.render('index', { title: 'Express' });
});


// Cette route est juste une verification du Save.
// Vous pouvez choisir de la garder ou la supprimer.
router.get('/result', function(req, res, next) {

  // Permet de savoir combien de trajets il y a par ville en base
  for(i=0; i<city.length; i++){

    journeyModel.find( 
      { departure: city[i] } , //filtre
  
      function (err, journey) {

          console.log(`Nombre de trajets au départ de ${journey[0].departure} : `, journey.length);
      }
    )

  }


  res.render('index', { title: 'Express' });
});

router.get('/journey-result', function(req, res, next){
  res.render('journeyresult');
});

module.exports = router;
