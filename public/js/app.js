const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('../../utils/geocode')
const forecast = require('../../utils/forecast')

const app = express()

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// app.get('', (req, res) => {
//     res.send("<h1>Weather</h1>")
//  })

// Setup handlebars engine and views location 
 app.set('view engine', 'hbs')
 app.set('views', viewsPath)
 hbs.registerPartials(partialsPath)
''
//  Setup static directory to serve
 app.use(express.static(publicDirectoryPath))

 app.get('', (req, res) => {
  res.render('index', {
    title:"Weather-HBS",
    name: "Steve"
  })
 })

 app.get('/about', (req, res) => {
  res.render('about', {
    title:"About Me-HBS",
    name: "Steve"
  })
 })

 app.get('/help', (req, res) => {
  res.render('help', {
    helpText: 'This is some HELP text',
    title:"HELP",
    name: "Stephen"
  })
 })

 //   Route to process weather

//  app.get('/weather', (req, res) => {
//     res.send({
//         forecast: "Windy, with rain",
//         location: "Boston"
//     })
//  })

app.get('/weather', (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "You must supply a address..."
    })
  }

  geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
    if (error) {
      return res.send({ error })
    }

    forecast(latitude, longitude, (error, forecastData) => {
      if (error) {
        return res.send({ error })
      }

      res.send ({
        forecast: forecastData,
        location,
        address: req.query.address
      })
    })
  })
})


 //  TEST res.send can only respond 1 time, 2 times is error

app.get('/products', (req, res) => {
  if(!req.query.search) {
    return res.send({
      error: "You must provide a search term"
    })
  }

  res.send({
    products: []
  })
}) 

 //  If ROUTE not found execute the following:
 
 app.get('/help/*', (req, res) => {
  res.render('404', {
      title: '404',
      name: 'Andrew Mead',
      errorMessage: 'Help article not found.'
  })
})

app.get('*', (req, res) => {
  res.render('404', {
      title: '404',
      name: 'Andrew Mead',
      errorMessage: 'Page not found.'
  })
})

app.listen(3000, () => {
  console.log("Server running on port 3000")
})