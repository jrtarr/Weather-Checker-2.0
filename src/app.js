const path = require('path')
const express = require('express')
const hbs = require('hbs')
const request = require('request')
const geocode = require('./utils/geocode')
const weather = require('./utils/weather')
const config = require('./utils/config')

//Initialize Express
const app = express()
const port = process.env.PORT || 3000

//Set paths for Express
const publicDir = path.join(__dirname,'../public')
const viewDir = path.join(__dirname,'/templates/views')
const partialsDir = path.join(__dirname,'/templates/partials')

//Setup Handlebars engine and location
app.set('view engine','hbs')
app.set('views',viewDir)
hbs.registerPartials(partialsDir)

//Setup static dir to serve
app.use(express.static(publicDir))
app.set('trust proxy',true)

app.get('',(req,res)=>{
    const ipKey = config.keys.ipInfo
    // const ipKey = process.env.IPKEY
    let ip = req.headers['x-forwarded-for']
    if(ip){
        const list = ip.split(',')
        ip = list[list.length-1]
    }else{
        ip = req.ip
    }
    const url = `https://ipinfo.io/${ip}?token=${ipKey}`
    console.log(url)
    request({url,json:true},(error,response,body)=>{ //Load initial location from client's IP address
        if (error || response.body.error === 0){ //If an error is returned or the request failed at any point, render the page without a forecast
            return res.render('index',{
                title: 'Weather'
            })
        }
        geocode.geocode(body.city,(error, {lat, long, location} = {})=>{
            if(error){
                return res.render({
                    title: 'Weather'
                })
            }
            else{
                weather.forecast(lat, long, (error, { summary, temp, precipProb:precip } = {})=>{
                    if(error){
                        return res.send(error)
                    }else{
                        return res.render('index',{
                            title: `Weather`,
                            defaultForecast: `In ${location} it's currently ${temp}ºF. Today the weather should be ${summary} with a ${precip}% chance of precipitation.`
                        })
                    }
                })
            }
        })
    })
})

app.get('/weather',(req,res)=>{
    if (!req.query.loc){
        return res.render('weather',{
            head: 'Error',
            error: 'You must enter a valid address'
        })
    }

    geocode.geocode(req.query.loc,(error, {lat, long, location} = {})=>{
        if(error){
            return res.send({
                error
            })
        }
        else{
            weather.forecast(lat, long, (error, { summary, temp, precipProb:precip } = {})=>{
                if(error){
                    return res.send(error)
                }else{
                    res.send({
                        title: `Weather`,
                        location,
                        summary,
                        temp,
                        precip
                    })
                }
            })
        }
    })
})

app.get('/help/*', (req, res)=>{
    res.render('404',{
        title: 'Help',
        errorMsg: 'Help article not found'
    })
})

app.get('*', (req, res)=>{
    res.render('404',{
        title: '404',
        errorMsg: 'Page not found'
    })
})

app.listen(port,()=>{
    console.log('Server is up on port ' + port)
})