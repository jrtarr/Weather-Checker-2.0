const path = require('path')
const express = require('express')
const hbs = require('hbs')
const request = require('request')
const geocode = require('./utils/geocode')
const weather = require('./utils/weather')

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

app.get('',(req,res)=>{
    res.render('index',{
        title: 'Weather'
    })
})

app.get('/about',(req,res)=>{
    res.render('about',{
        title: 'About',
        body: 'Here\'s some about text'
    })
})

app.get('/help',(req,res)=>{
    res.render('help',{
        title: 'Help',
        message: 'Hi do you need help?'
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