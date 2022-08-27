// var apiKey = `699d2eebd353f5a54a5616496ebbccee`;
var apiKey = `485bbc753e29e9770f09ca55c32c6d79`;
var weatherURL = `http://api.openweathermap.org/geo/1.0/direct`;
var currentDayImage = $(".current-day-image");
// imageTest.html("");
// imageTest.src="https://openweathermap.org/img/wn/10d@2x.png";
var getName = "";


function TestThing(searchName){
    var qVar = searchName;
    var requestUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${qVar}&appid=${apiKey}`;

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
            for(var i = 0; i < 6; i++){
                Do5Day(data, i);
            }
            // Do5Day(data, 1);
            // Do5Day(data, 2);
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

function Do5Day(data, newDay){
    $(".5-day-" + newDay).find(".5day-date").html("" + (UnixToDate(data.daily[newDay].dt)));

    var newIcon = data.daily[newDay].weather[0].icon;
    var getImage = $(".5-day-" + newDay).find(".5day-image");
    getImage.attr("src", `https://openweathermap.org/img/wn/${newIcon}@2x.png`);
    getImage.attr("height", "40px");

    $(".5-day-" + newDay).find(".5day-temp").html("Temp: " + data.daily[newDay].temp.day);
    $(".5-day-" + newDay).find(".5day-wind").html("Wind: " + data.daily[newDay].wind_speed);
    $(".5-day-" + newDay).find(".5day-humidity").html("Temp: " + data.daily[newDay].humidity);

}

// console.log("NEW DATE " + UnixToDate(1661619600));

function UnixToDate(newUnix){
    return moment(newUnix, 'X').format("MM/DD/YYYY");
}

TestThing("Chicago");