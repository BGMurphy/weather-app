const request = require('request')


const forecast = (latitude, longitude, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=*removed*&query=' + latitude + ',' + longitude

    request({ url: url, json: true}, (error, { body }) => {
        if(error){
            callback("Unable to connect to weather service", undefined)
        } else if (body.error) {
            callback("Unable to find location", undefined)
        } else {
            const temp = body.current.temperature
            const feelsLike = body.current.feelslike
            callback(undefined, 'It is currently ' + temp + ' degrees out. It feels like ' + feelsLike + ' degrees.')
        }
    })
}

module.exports = forecast