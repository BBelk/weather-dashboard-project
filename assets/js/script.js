// var apiKey = `699d2eebd353f5a54a5616496ebbccee`;
var apiKey = `485bbc753e29e9770f09ca55c32c6d79`;
var weatherURL = `http://api.openweathermap.org/geo/1.0/direct`;
var inputTextEl = $("#city-input");
var inputBtnEl = $(".btn-entry");
var deleteBtnEl = $(".btn-delete");
var getName = "";
var savedLocations = [];
var generateButtons = [];


function GetWeather(searchName){
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
        
        var oneCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${getLat}&lon=${getLon}&appid=${apiKey}&units=imperial&exclude=hourly,minutely`;
        fetch(oneCall)
        .then(function(response) {
            return response.json();
        })
        .then(function (data){
            console.log(data);
            SaveEntry(getName);
            DoCurrentDay(data);
            for(var i = 0; i < 6; i++){
                Do5Day(data, i);
            }
        });
      });
}

function DoCurrentDay(data){
    
    var newIcon = data.current.weather[0].icon;
    var currentDayImage = $(".current-day-image");
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

function UnixToDate(newUnix){
    return moment(newUnix, 'X').format("MM/DD/YYYY");
}

var handleFormSubmit = function (event) {
    event.preventDefault();
    var nameInput = inputTextEl.val();
    if(!nameInput){
        console.log('You need to pick a city!');
        return;
    }
    GetWeather(nameInput);    
};

var handleDeleteSubmit = function (event) {
    console.log("Delete");
    for(var i = generateButtons.length -1; i > 0; i--){
        generateButtons[i].remove();
    }
    $(".saved-locations").css("display","none");
    savedLocations = [];
    localStorage.setItem("saved", JSON.stringify(savedLocations));
}

function SaveEntry(name){
//  console.log("Ayy" + name + savedLocations);
if(savedLocations){
    for(var i = 0; i < savedLocations.length; i++){
        if(name == savedLocations[i]){
            console.log("ENTRY ALREADY EXISTS: " + savedLocations[i]);
            return;
        }
    }
}
if(!savedLocations){
    savedLocations = [];
}
savedLocations.push(name);
localStorage.setItem("saved", JSON.stringify(savedLocations));
GenerateButton(savedLocations.length + 1, name);

}

function GenerateButton(newID, newName){
    console.log("to append: " + newID + " " + newName);
    $(".saved-locations").css("display","block");
    var newButton = $(".saved-buttons").append(`<button>${newName}</button>`);
    generateButtons.push(newButton);
}

function LoadSave(){
    savedLocations = JSON.parse(localStorage.getItem("saved"));
    console.log(savedLocations);

    for(var i = 0; i < savedLocations.length; i++){
        GenerateButton(i, savedLocations[i]);
    }
}


inputBtnEl.on('click', handleFormSubmit);
deleteBtnEl.on('click', handleDeleteSubmit);


$(".saved-locations").css("display","none");
LoadSave();
GetWeather("Chicago");


