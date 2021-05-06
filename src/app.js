const express = require('express')
const path = require('path')
const hbs = require('hbs')
const { request } = require('express')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()

//Define paths for Express
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')
app.use(express.static(path.join(__dirname, '../public')))

// Define handlebars engine setup and views/partials locations
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather app',
        name: "Ben Murphy"
    })
})


app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        aboutText: 'This app uses fetches the lat/long of your inputted location from a geocoding API. This is then given to the Weatherstack API which returns the current forecast for your location.',
        name: "Ben Murphy"
    })
})


app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'Enter a location to get the current forecast.',
        title: 'Help Page',
        name: "Ben Murphy"
    })
})


app.get('/weather', (req, res) => {
    if(!req.query.address) {
        return res.send({
            error: 'You must provide an address'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location} = {}) => {
        if(error) {
            return res.send({
                error
            })
        }
    
        forecast(latitude,longitude, (error, forecastData) => {
            if(error) {
                return res.send({
                    error: 'You must provide an address'
                })
            }
    
            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})


app.get('/help/*', (req, res) => {
    res.render('404', {
        errorMessage: 'Help article not found',
        title: '404',
        name: "Ben Murphy"
    })
})


app.get('*', (req, res) => {
    res.render('404', {
        errorMessage: 'Page not found',
        title: '404',
        name: "Ben Murphy"
    })
})


app.listen(3000, () => {
    console.log('Server is up on port 3000')
})