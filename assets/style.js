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
    
    if (cityFromInput) {
      city = cityFromInput;
    } else {
      city = cityFromHistory;
    }
    var APIKey_OWM = "&appid=016e0c84a66372bfe43d6b8df53c6531";
    var APIUnitConvert = "&units=imperial"
    var queryURL_OWM = "https://api.openweathermap.org/data/2.5/weather?q=" + city + APIUnitConvert + APIKey_OWM;

    console.log(city);
    console.log(typeof(city));

    console.log(queryURL_OWM);

    $.ajax({
      url: queryURL_OWM,
      method: "GET"
    }).then(function(response) {
      var tempF = response.main.temp;
      var RHumidity = response.main.humidity;
      var windSpeed = response.wind.speed;
      var UVIndex;
      // The UVI will be really tricky: OWM requires coordinates to search for UV. But once those are found, the UV Index breaks down like this:
      // • 0-2, low: rgb(76, 146, 41);
      // • 3-5, moderate: rgb(245, 227, 76);
      // • 6-7, high: rgb(232, 100, 43);
      // • 8-10, very high: rgb(200, 42, 35);
      // • 11+, extreme: rgb(102, 79, 196);



    var longitude = response.coord.lon;
    var latitude = response.coord.lat;
    
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
