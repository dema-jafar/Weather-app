const apiKey = '64e0a100b6da707d4b0a418737ad64ba';

const elements = {
    searchInput: document.getElementById('searchInput'),
    searchButton: document.getElementById('searchButton'),
    weatherImg: document.getElementById('weatherImg'),
    degree: document.getElementById('degree'),
    cityName: document.getElementById('city'),
    humidity: document.getElementById('humidity'),
    wind: document.getElementById('wind'),
    message: document.getElementById('message'),
}

elements.searchButton.addEventListener('click', ()=> {
    const city = elements.searchInput.value.trim();
    if (!city) {
        showMessage('Please enter a city');
        return;
    }
    fetchWeather(city);
})

elements.searchInput.addEventListener('keydown', (e)=> {
    if (e.key === 'Enter') {
        elements.searchButton.click();
    }
})

function showMessage(text) {
    elements.message.textContent = text;
    setTimeout(()=> {
        elements.message.textContent = '';
    },3000);
}

async function fetchWeather(city) {
    try {
        elements.message.textContent = '';
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        const result = await fetch(url);
        if (!result.ok) {
            if (result.status === 404) throw new Error('city not found')
        }
        const data = await result.json();
        renderWeather(data);
    } catch (error) {
        showMessage(error.message || 'Error fetching weather');
    }
}

function renderWeather(data) {
    elements.degree.innerHTML = Math.round(data.main.temp)+'&degC';
    elements.cityName.textContent = `${data.name}${data.sys && data.sys.country ? ','+data.sys.country : ''}`;
    elements.humidity.textContent = data.main.humidity + '%';
    elements.wind.textContent = Math.round(data.wind.speed * 3.6) + ' Km/h';
    const icon = data.weather && data.weather[0] && data.weather[0].icon;
    if (icon) {
        elements.weatherImg.src = `https://openweathermap.org/img/wn/${icon}@4x.png`;
        elements.weatherImg.alt = data.weather[0].description;
    } else {
        elements.weatherImg.alt = 'There is no image';
    }
}
