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

// VARIABLES
var searchInput = "";


$(document).ready(function() {
  // INITIALIZATION--makes sure that no buttons are being rendered if no search history exists in local storage; if a search history exists, up to ten most recent searches will be rendered:
  function initSearch() {
    var buttons = $(".history");
    var searchedCities = JSON.parse(localStorage.getItem("cities"));
    buttons.empty();
    buttons.addClass("d-none");
    if (!searchedCities) {
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
  
  
  function displayWeather() {
    var city;
    var cityFromHistory = $(this).attr("data-name");
    var cityFromInput = $("#cityInput").val().trim();
    var currentDay = moment().format("MMM Do");
    var OWM_APIKey = "016e0c84a66372bfe43d6b8df53c6531";
    var OWM_UnitConvert = "&units=imperial";
    var OWM_URL = "https://api.openweathermap.org/data/2.5/";
    
    // determines if the city has been entered from the search input or the search history:
    if (cityFromInput) {
      city = cityFromInput;
    } else {
      city = cityFromHistory;
    }
    
    
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
        
      }).catch(function(error) {
        
      })
    }).catch(function(error) {
      
    });
    
    // AJAX call to get five-day forecast:
    var OWM_FiveDayQuery = OWM_URL + "forecast?q=" + city + OWM_UnitConvert + "&appid=" + OWM_APIKey;
    
    $.ajax({
      url: OWM_FiveDayQuery,
      method: "GET"
    }).then(function(response) {
      // VARIABLES FOR FIVE-DAY FORECAST
      // day 1
      var f1TempF = response.list[4].main.temp.toFixed(1);
      var f1RHumidity = response.list[4].main.humidity;
      var f1OWM_IconCode = response.list[4].weather[0].icon;
      var f1OWM_Icon = "http://openweathermap.org/img/wn/" + f1OWM_IconCode + "@2x.png";
      // day 2
      var f2TempF = response.list[8].main.temp.toFixed(1);
      var f2RHumidity = response.list[8].main.humidity;
      var f2OWM_IconCode = response.list[8].weather[0].icon;
      var f2OWM_Icon = "http://openweathermap.org/img/wn/" + f2OWM_IconCode + "@2x.png";
      // day 3
      var f3TempF = response.list[12].main.temp.toFixed(1);
      var f3RHumidity = response.list[12].main.humidity;
      var f3OWM_IconCode = response.list[12].weather[0].icon;
      var f3OWM_Icon = "http://openweathermap.org/img/wn/" + f3OWM_IconCode + "@2x.png";
      // day 4
      var f4TempF = response.list[16].main.temp.toFixed(1);
      var f4RHumidity = response.list[16].main.humidity;
      var f4OWM_IconCode = response.list[16].weather[0].icon;
      var f4OWM_Icon = "http://openweathermap.org/img/wn/" + f4OWM_IconCode + "@2x.png";
      // day 5
      var f5TempF = response.list[20].main.temp.toFixed(1);
      var f5RHumidity = response.list[20].main.humidity;
      var f5OWM_IconCode = response.list[20].weather[0].icon;
      var f5OWM_Icon = "http://openweathermap.org/img/wn/" + f5OWM_IconCode + "@2x.png";
       
    }).catch(function(error) {
      
    });
  };
  
  $("#genCity").on("click", function(event) {
    event.preventDefault();
    setSearchHistory();
    displayWeather();
    $("#cityInput").val("");
    renderHistory();
  });
});
  
  
  
  
// Get city from search bar (input form-control)

// When search button clicked, it drops information into the current city field:

// Get current temperature
// Get current RH
// Get current wind speed
// Get UV index

// Figure a way to color-code the UV index according to conditions

// Figure a way to get five-day data for temperature and RH.

// Save current search in search history (localStorage) and bring up last ten searches.
