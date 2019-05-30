const searchForm = document.getElementById('search-form')
const forecastEl = document.getElementById('forecast')

searchForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    const location = encodeURI(e.target.elements.loc.value)
    const url=`/weather?loc=${location}`
    fetch(url).then((response)=>{
        response.json().then((data)=>{
            if(data.error){
                forecastEl.textContent = `Uh Oh! We've encountered an error: ${data.error}`
            }else{
                forecastEl.textContent = `In ${data.location} it's currently ${data.temp}ºF. Today the weather should be ${data.summary} with a ${data.precip}% chance of precipitation.`
            }
       })
    })
})
