const request = require('request')
const config = require('./config')

// const darkSkyKey = process.env.DSKEY //Load API key from Heroku environment
const darkSkyKey = config.keys.darkSky

function forecast(lat, long, callback){
    const url = `https://api.darksky.net/forecast/${darkSkyKey}/${lat},${long}`
    request({url,json:true},(error,response,body)=>{
        if(error){
            callback('Error connecting to weather services.',undefined)
        }else if(response.body.error){
            callback('We couldn\'t find weather data for that location. Try another search!',undefined)
        }else{
            const data = {
                summary: body.currently.summary.toLowerCase(),
                temp: body.currently.temperature,
                precipProb: body.currently.precipProbability
            }
            callback(undefined,data)
        }
    })
}

module.exports = {forecast}
