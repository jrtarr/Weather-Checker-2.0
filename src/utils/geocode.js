const request = require('request')
const config = require('./config')

//Load API key from Heroku environment
const mapBoxKey = process.env.MBKEY
// const mapBoxKey = config.keys.mapBox

function geocode(address,callback,ipInfo){
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapBoxKey}`

    request({url,json:true}, (error,response,body)=>{
        if (error){
            callback('Error connecting to location services.', undefined)
        }else if(response.body.error || body.features.length === 0){
            callback('We couldn\'t find that location. Try another search!', undefined)
        }
        else{
            let coords = []
            coords.push(body.features[0].center[0],body.features[0].center[1]) //Push longitude then latitude to the coordinates array
            callback(undefined,{
                lat: body.features[0].center[1],
                long: body.features[0].center[0],
                location: body.features[0].place_name
            })
        }
    })
}

module.exports = { geocode }
