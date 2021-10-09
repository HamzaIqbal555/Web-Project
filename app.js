const express = require('express');
var mongoose = require("mongoose");
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.set('view engine', 'ejs')

var mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/Campbase', { useNewUrlParser: true }, { useUnifiedTopology: true });

mongoose.connection.once('open', function () {
  console.log("MongoDB is connected!!")
}).on('error', function (error) {
  console.log('error is:', error)
});

var CampgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

var Campground = mongoose.model("Campground", CampgroundSchema)

app.get("/Campgrounds", function (req, res) {

  Campground.find({}, function (err, data) {
    if (err) {
      console.log(err)
    } else {
      res.render('main', { campgrounds: data })
    }
  })
})

app.post('/newCampground', async (req, res) => {
  let x = await Campground.create({
    name: req.body.name,
    image: req.body.image,
    description: req.body.description
  })
  x.save((err) => {
    if (err) {
      console.log(err)
    } else {
      res.redirect('/Campgrounds')
    }
  })
})

// more Info Route
app.get('/Campgrounds/:id', function (req, res) {

  Campground.findById(req.params.id).exec(function (err, foundCampground) {
    if (err) {
      console.log(err);
    } else {
      console.log(foundCampground);
      res.render('show', { campground: foundCampground });
    }
  });
});

app.get("/new", function (req, res) {
  res.render('new')
})

// Show Update page
app.get('/Campgrounds/:id/edit', function (req, res) {
  Campground.findById(req.params.id, function (err, foundCampground) {
    res.render('edit', { campground: foundCampground });
  });
});

// Update Campground Route
app.post('/Campgrounds/update/:id', function (req, res) {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
    if (err) {
      res.redirect('/Campgrounds');
    } else {
      res.redirect('/Campgrounds/' + req.params.id);
    }
  });
});

// Delete Campground Route
app.get('/Campgrounds/delete/:id', function (req, res) {
  Campground.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.redirect('/Campgrounds');
    } else {
      res.redirect('/Campgrounds');
    }
  });
});

app.listen(3000, function () {
  console.log('Server has Started on port 3000!!');
});