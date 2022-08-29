// var apiKey = `0826b9a0e62a775f0b632377ad6cfd9f`;
// var apiKey = `699d2eebd353f5a54a5616496ebbccee`;
var apiKey = `692efab00ae66e9f48137e6ea4766fcd`;
// var apiKey = `485bbc753e29e9770f09ca55c32c6d79`;
var weatherURL = `http://api.openweathermap.org/geo/1.0/direct`;
var inputTextEl = $("#city-input");
var inputBtnEl = $(".btn-entry");
var deleteBtnEl = $(".btn-delete");
var getName = "";
var savedLocations = [];
var generateButtons = [];
var weatherDisplay = $(".weather-display");


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
        
        var oneCall = `https://api.openweathermap.org/data/3.0/onecall?lat=${getLat}&lon=${getLon}&appid=${apiKey}&units=imperial&exclude=hourly,minutely`;
        fetch(oneCall)
        .then(function(response) {
            return response.json();
        })
        .then(function (data){
            console.log(data);
            SaveEntry(getName);
            weatherDisplay.css("display", "block");
            DoCurrentDay(data);
            for(var i = 0; i <= 5; i++){
                Do5Day(data, i);
            }
        });
      });
}

function DoCurrentDay(data){
    var currentDayImage = $(".current-day-image");
    var newIcon = data.current.weather[0].icon;
    $(".current-day-h3").html("" + getName + " (" + UnixToDate(data.current.dt) + ")");
    currentDayImage.attr("src", `https://openweathermap.org/img/wn/${newIcon}@2x.png`);
    currentDayImage.attr("height", "40px");
    $(".current-day-temp").html("Temp: " + data.current.temp + "°F");
    $(".current-day-wind").html("Wind: " + data.current.wind_speed + " mph");
    $(".current-day-humidity").html("Humidity: " + data.current.humidity + "%");
    $(".current-day-uvi").html("UV Index:");
    $(".uvi").html("" + `${data.current.uvi}`);
    GetUVIndexColor($(".uvi"), data.current.uvi);
}

function GetUVIndexColor(elementToChange, uviNum){
    var newColor = "#42b91E";
    if(uviNum >=3 && uviNum < 6){newColor = "#FCC722";}
    if(uviNum >=6 && uviNum < 8){newColor = "#FB731C";}
    if(uviNum >=8 && uviNum < 11){newColor = "#F81116";}
    if(uviNum >=11){newColor = "#866FFF";}
    elementToChange.css("background-color", newColor);
}

function Do5Day(data, newDay){
    $(".5-day-" + newDay).find(".5day-date").html("" + (UnixToDate(data.daily[newDay].dt)));

    var newIcon = data.daily[newDay].weather[0].icon;
    var getImage = $(".5-day-" + newDay).find(".5day-image");
    getImage.attr("src", `https://openweathermap.org/img/wn/${newIcon}@2x.png`);
    getImage.attr("height", "40px");

    $(".5-day-" + newDay).find(".5day-temp").html("Temp: " + data.daily[newDay].temp.day + "°F");
    $(".5-day-" + newDay).find(".5day-wind").html("Wind: " + data.daily[newDay].wind_speed + " mph");
    $(".5-day-" + newDay).find(".5day-humidity").html("Temp: " + data.daily[newDay].humidity + "%");

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
    inputTextEl.val("");
    GetWeather(nameInput);    
};

var handleDeleteSubmit = function (event) {
    console.log("Delete");
    for(var i = generateButtons.length -1; i > 0; i--){
        generateButtons[i].remove();
    }
    $(".saved-locations").css("display","none");
    savedLocations = [];
    generateButtons= [];
    localStorage.setItem("saved", JSON.stringify(savedLocations));
    localStorage.setItem("lastUsed", 0);
    // LoadSave();
    window.location.reload();
}

function SaveEntry(name){

if(savedLocations){
    for(var i = 0; i < savedLocations.length; i++){
        if(name == savedLocations[i]){
            console.log("ENTRY ALREADY EXISTS: " + savedLocations[i]);
            localStorage.setItem("lastUsed", i);
            return;
        }
    }
}
if(!savedLocations){
    savedLocations = [];
}
savedLocations.push(name);
localStorage.setItem("lastUsed", savedLocations.length -1);
localStorage.setItem("saved", JSON.stringify(savedLocations));
GenerateButton(savedLocations.length + 1, name);

}

function GenerateButton(newID, newName){
    console.log("to append: " + newID + " " + newName);
    $(".saved-locations").css("display","block");
    var newButton = $(".saved-buttons").append(`<button class="btn btn-info btn-entry w-100" style="margin-top:10px" data-id="${newID}">${newName}</button>`);
    newButton.css("margin-top", "10px");
    generateButtons.push(newButton);
}

function LoadSave(){
    savedLocations = JSON.parse(localStorage.getItem("saved"));
    if(!savedLocations || savedLocations.length == 0){console.log("NO SAVED LOCATIONS");return;}
    console.log(savedLocations);

    for(var i = 0; i < savedLocations.length; i++){
        GenerateButton(i, savedLocations[i]);
    }
    var lastUsed = localStorage.getItem("lastUsed");
    GetWeather(savedLocations[lastUsed]);
}

function ListItemClick(event){
    event.preventDefault();
    var newTarget = $(event.target);
    console.log("" + newTarget.html());
    var tempName = newTarget.html();
    GetWeather(tempName); 
}


inputBtnEl.on('click', handleFormSubmit);
deleteBtnEl.on('click', handleDeleteSubmit);
// couldnt get the text area to play right
$("#city-input").keypress(function (event) {
    if(event.which === 13 && !event.shiftKey) {
        event.preventDefault();
        handleFormSubmit(event);
    }
});


$(".saved-buttons").on('click', '.btn', ListItemClick);


$(".saved-locations").css("display","none");
weatherDisplay.css("display", "none");
LoadSave();
// GetWeather("Chicago");


