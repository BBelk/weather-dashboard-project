// var apiKey = `699d2eebd353f5a54a5616496ebbccee`;
var apiKey = `485bbc753e29e9770f09ca55c32c6d79`;
var weatherURL = `http://api.openweathermap.org/geo/1.0/direct`;
var currentDayImage = $(".current-day-image");
// imageTest.html("");
// imageTest.src="https://openweathermap.org/img/wn/10d@2x.png";
var getName = "";


function TestThing(searchName){
    var qVar = searchName;
    var requestUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${qVar}&appid=${apiKey}`;

    var toJSon = function(response){
        return response.json();
    }

    fetch(requestUrl)
    .then(toJSon)
      .then(function (data) {
        console.log(data);
        var getLat = data[0].lat;
        var getLon = data[0].lon;
        getName = data[0].name;
        // console.log("LAT LON NAME " + getLat + getLon + getName);
        
        
        var oneCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${getLat}&lon=${getLon}&appid=${apiKey}&units=imperial&exclude=hourly,minutely`;
        fetch(oneCall)
        .then(function(response) {
            return response.json();
        })
        .then(function (data){
            console.log(data);
            DoCurrentDay(data);
            // var h2El = document.createElement('h2');
            // var tempEl = document.createElement('p');
            // h2El.textContent = getName;
            // tempEl.textContent = 'TEMP:' + data.current.temp;
            // document.body.appendChild(h2El);
            // document.body.appendChild(tempEl);

            
        });
      });
}

function DoCurrentDay(data){
    
    var newIcon = data.current.weather[0].icon;
    $(".current-day-h3").html("" + getName + " " + UnixToDate(data.current.dt));
    currentDayImage.attr("src", `https://openweathermap.org/img/wn/${newIcon}@2x.png`);
    currentDayImage.attr("height", "40px");
    $(".current-day-temp").html("Temp: " + data.current.temp);
    $(".current-day-wind").html("Wind: " + data.current.wind_speed);
    $(".current-day-humidity").html("Humidity: " + data.current.humidity);
    $(".current-day-uvi").html("UV Index: " + data.current.uvi);
}

// console.log("NEW DATE " + UnixToDate(1661619600));

function UnixToDate(newUnix){
    return moment(newUnix, 'X').format("MM/DD/YYYY");
}

TestThing("Chicago");