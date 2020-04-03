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

var APIKey_OWM = "016e0c84a66372bfe43d6b8df53c6531";
var queryURL_OWM = "https://api.openweathermap.org/data/2.5/weather?q=" + searchInput + "&appid=" + APIKey_OWM;
var searchInput = "";

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
      searchBtns[i].removeClass("d-none");
    }
  }
};

$("#genCity").on("click", function(event) {
  event.preventDefault();
  setSearchHistory();
  $("#cityInput").val("");
  renderHistory();
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
