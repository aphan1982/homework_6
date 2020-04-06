// TIMECLOCK //
function setTime() {
  // Gets current day and time and displays immediately:
  var nowMoment = moment().format("dddd, MMMM Do, h:mma");
  $("#currTime").text(nowMoment);
  // Maintains time current to the second:
  function updateTime() {
    nowMoment = moment().format("dddd, MMMM Do, h:mma");
    $("#currTime").text(nowMoment);
  };
  setInterval(updateTime, 1000);
};
setTime();



$(document).ready(function() {
  // INITIALIZATION--makes sure that no buttons are being rendered if no search history exists in local storage; if a search history exists, up to ten most recent searches will be rendered:
  function initSearch() {
    var buttons = $(".history");
    var searchedCities = JSON.parse(localStorage.getItem("cities"));
    buttons.empty();
    buttons.addClass("d-none");
    if (!searchedCities) {
      $("#cityBtn1").prop("disabled", true);
      $("#cityBtn1").text("no recent history");
      $("#cityBtn1").removeClass("d-none");
      return;
    } else {
      renderHistory();
    }
  };
  initSearch();
  
  // SET HISTORY--takes user input (search cities) and stores it in local storage:
  function setSearchHistory() {
    var city = $("#cityInput").val().trim();
    if (!city) {
      return;
    } else {
      var searchedCities = JSON.parse(localStorage.getItem("cities"));
      if (!searchedCities) {
        searchedCities = [];
      }
      // sets search history in descending order from most to least recent:
      searchedCities.unshift(city);
      localStorage.setItem("cities", JSON.stringify(searchedCities));
    }
  };
  
  // RENDER HISTORY--displays each search entry as a clickable button:
  function renderHistory() {
    var searchBtns = [$("#cityBtn1"), $("#cityBtn2"), $("#cityBtn3"), $("#cityBtn4"), $("#cityBtn5"), $("#cityBtn6"), $("#cityBtn7"), $("#cityBtn8"), $("#cityBtn9"), $("#cityBtn10")];
    searchedCities = JSON.parse(localStorage.getItem("cities"));
    // enables button for use (was disabled when there was no recent search history):
    $("#cityBtn1").prop("disabled", false);
    for (i = 0; i < searchBtns.length; i++) {
      if (searchedCities[i] === undefined) {
        return;
      } else {
        searchBtns[i].text(searchedCities[i]);
        searchBtns[i].attr("data-name", searchedCities[i]);
        searchBtns[i].removeClass("d-none");
      }
    }
  };
  
  var city;
  
  function displayWeather() {
    var currentDay = moment().format("MMM Do");
    var OWM_APIKey = "016e0c84a66372bfe43d6b8df53c6531";
    var OWM_UnitConvert = "&units=imperial";
    var OWM_URL = "https://api.openweathermap.org/data/2.5/";
    var OWM_WeatherQuery = OWM_URL + "weather?q=" + city + OWM_UnitConvert + "&appid=" + OWM_APIKey;
    
    // AJAX call for the current weather:
    $.ajax({
      url: OWM_WeatherQuery,
      method: "GET",
    }).then(function(response) {
      var tempF = response.main.temp.toFixed(1);
      var longitude = response.coord.lon;
      var latitude = response.coord.lat;
      var RHumidity = response.main.humidity;
      var OWM_IconCode = response.weather[0].icon;
      var OWM_Icon = "http://openweathermap.org/img/wn/" + OWM_IconCode + "@2x.png";
      var windSpeed = response.wind.speed.toFixed(1);
      
      // assigns values to "CURRENT SELECTED CITY" on DOM:
      $("#tempF").text(tempF + "°F");
      $("#RHumidity").text(RHumidity + "%");
      $("#windSpeed").text(windSpeed + "mph");
      $("#cityHeader").html(city + "<span class='handwriting' id='currentDay'>  — " + currentDay + "</span>");
      $("#weatherDisplay").css("background", "url(" + OWM_Icon + ")");
      
      // AJAX call for the UV Index (requires longitude and latitude from previous call to determine):
      var OWM_UVQuery = OWM_URL + "uvi?appid=" + OWM_APIKey + "&lat=" + latitude + "&lon=" + longitude;
      
      $.ajax({
        url: OWM_UVQuery,
        method: "GET",
      }).then(function(response) {
        var UVIndex = response.value.toFixed(1);
        $("#UVIndex").text(UVIndex);
        
        // UV INDEX //
        // resets the color of the UV Index Box:
        $("#UVIBox").removeClass();
        $("#UVIBox").addClass("badge badge-secondary");
        // determines the World Health Organization's color-coded index and assigns to DOM:
        if (UVIndex >= 0 && UVIndex < 3) {
          $("#UVIBox").text("Low");
          $("#UVIBox").addClass("UVLow");
        } else if (UVIndex >= 3 && UVIndex < 6) {
          $("#UVIBox").text("Moderate");
          $("#UVIBox").addClass("UVModerate");
        } else if (UVIndex >= 6 && UVIndex < 8) {
          $("#UVIBox").text("High");
          $("#UVIBox").addClass("UVHigh");
        } else if (UVIndex >= 8 && UVIndex < 11) {
          $("#UVIBox").text("Very High");
          $("#UVIBox").addClass("UVVeryHigh");
        } else {
          $("#UVIBox").text("Extreme");
          $("#UVIBox").addClass("UVExtreme");
        }
        
      })
    }).catch(function(error) {
      $("#staticBackdrop").modal("show");
      $("#errorCity").text(city);
      var citiesEdited = JSON.parse(localStorage.getItem("cities"));
      console.log(citiesEdited);
      citiesEdited.splice(0, 1);
      console.log(citiesEdited);
      localStorage.setItem("cities", JSON.stringify(citiesEdited));
      renderHistory();
      return;
    });
    
    // AJAX call to get five-day forecast:
    var OWM_FiveDayQuery = OWM_URL + "forecast?q=" + city + OWM_UnitConvert + "&appid=" + OWM_APIKey;
    
    $.ajax({
      url: OWM_FiveDayQuery,
      method: "GET"
    }).then(function(response) {
      // SETS FIVE-DAY FORECAST
      // Sets the days of the week in relation to today:
      var day1 = moment().add(1, "days").format("ddd");
      var day2 = moment().add(2, "days").format("ddd");
      var day3 = moment().add(3, "days").format("ddd");
      var day4 = moment().add(4, "days").format("ddd");
      var day5 = moment().add(5, "days").format("ddd");
      $("#FDF1Date").text(day1 + ".");
      $("#FDF2Date").text(day2 + ".");
      $("#FDF3Date").text(day3 + ".");
      $("#FDF4Date").text(day4 + ".");
      $("#FDF5Date").text(day5 + ".");
      
      // Displays weather data associated with each day:
      // day 1
      var f1TempF = response.list[6].main.temp.toFixed(1);
      var f1RHumidity = response.list[6].main.humidity;
      var f1OWM_IconCode = response.list[6].weather[0].icon;
      var f1OWM_Icon = "http://openweathermap.org/img/wn/" + f1OWM_IconCode + "@2x.png";
      $("#f1TempF").text(f1TempF + "°F");
      $("#f1RHumidity").text(f1RHumidity + "%");
      $("#FD1Icon").css("background", "url(" + f1OWM_Icon + ")");
      // day 2
      var f2TempF = response.list[14].main.temp.toFixed(1);
      var f2RHumidity = response.list[14].main.humidity;
      var f2OWM_IconCode = response.list[14].weather[0].icon;
      var f2OWM_Icon = "http://openweathermap.org/img/wn/" + f2OWM_IconCode + "@2x.png";
      $("#f2TempF").text(f2TempF + "°F");
      $("#f2RHumidity").text(f2RHumidity + "%");
      $("#FD2Icon").css("background", "url(" + f2OWM_Icon + ")");
      // day 3
      var f3TempF = response.list[22].main.temp.toFixed(1);
      var f3RHumidity = response.list[22].main.humidity;
      var f3OWM_IconCode = response.list[22].weather[0].icon;
      var f3OWM_Icon = "http://openweathermap.org/img/wn/" + f3OWM_IconCode + "@2x.png";
      $("#f3TempF").text(f3TempF + "°F");
      $("#f3RHumidity").text(f3RHumidity + "%");
      $("#FD3Icon").css("background", "url(" + f3OWM_Icon + ")");
      // day 4
      var f4TempF = response.list[30].main.temp.toFixed(1);
      var f4RHumidity = response.list[30].main.humidity;
      var f4OWM_IconCode = response.list[30].weather[0].icon;
      var f4OWM_Icon = "http://openweathermap.org/img/wn/" + f4OWM_IconCode + "@2x.png";
      $("#f4TempF").text(f4TempF + "°F");
      $("#f4RHumidity").text(f4RHumidity + "%");
      $("#FD4Icon").css("background", "url(" + f4OWM_Icon + ")");
      // day 5
      var f5TempF = response.list[38].main.temp.toFixed(1);
      var f5RHumidity = response.list[38].main.humidity;
      var f5OWM_IconCode = response.list[38].weather[0].icon;
      var f5OWM_Icon = "http://openweathermap.org/img/wn/" + f5OWM_IconCode + "@2x.png";
      $("#f5TempF").text(f5TempF + "°F");
      $("#f5RHumidity").text(f5RHumidity + "%");
      $("#FD5Icon").css("background", "url(" + f5OWM_Icon + ")");
      
      
    }).catch(function(error) {
      return;
    });
  };
  
  $("#genCity").on("click", function(event) {
    event.preventDefault();
    setSearchHistory();
    $("#cityInput").val("");
    renderHistory();
    city = $("#cityBtn1").attr("data-name");
    console.log(city);
    displayWeather();
    window.location = "#jumpTo";
  });
  
  $(".history").on("click", function(event) {
    event.preventDefault();
    console.log($(this).attr("data-name"));
    city = $(this).attr("data-name");
    displayWeather();
    window.location = "#jumpTo";
  });
});