const request = require('request')

<<<<<<< HEAD
const darkSkyKey = process.env.DSKEY //Load API key from Heroku environment
=======
const darkSkyKey = process.env.DSKEY
>>>>>>> e560612554d8fc6bf6ce3109ca27bde421aaa414

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
