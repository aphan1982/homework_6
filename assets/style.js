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

function initSearch() {
  var buttons = $(".history");
  var searchedCities = JSON.parse(localStorage.getItem("cities"));
  buttons.empty();
  buttons.addClass("d-none");
  if (searchedCities === null) {
    $("#cityBtn1").text("no recent history");
    $("#cityBtn1").removeClass("d-none");
    return;
  } else {
    console.log(searchedCities.length);
    for (i = 0; i < searchBtns.length; i++) {
      searchBtns[i].text(searchedCities[i]);
      if (searchedCities[i] === undefined) {
        searchBtns[i].addClass("d-none");
      }
    }
  }
};
initSearch();

renderHistory();
var searchedCities = [];


var APIKey_OWM = "016e0c84a66372bfe43d6b8df53c6531";
var searchInput = "";

var queryURL_OWM = "https://api.openweathermap.org/data/2.5/weather?q=" + searchInput + "&appid=" + APIKey_OWM;

function setSearchHistory() {
  var city = $("#cityInput").val().trim();
  searchedCities.unshift(city);
  localStorage.setItem("cities", JSON.stringify(searchedCities));
};

function renderHistory() {
  var searchBtns = [$("#cityBtn1"), $("#cityBtn2"), $("#cityBtn3"), $("#cityBtn4"), $("#cityBtn5"), $("#cityBtn6"), $("#cityBtn7"), $("#cityBtn8"), $("#cityBtn9"), $("#cityBtn10")];
  searchedCities = JSON.parse(localStorage.getItem("cities"));
  if (searchedCities === null) {
    searchBtns[0].text("no recent history");
    $(".hideable").hide();
    return;
  } else {
    console.log(searchedCities.length);
    for (i = 0; i < searchBtns.length; i++) {
      searchBtns[i].text(searchedCities[i]);
      if (searchedCities[i] === undefined) {
        searchBtns[i].addClass("d-none");
      }
    }
  }

  // console.log(searchedCities);
  
  //     console.log(searchBtns[i]);
  //     console.log(city);
  //     console.log(searchedCities);
  //   }
  // }
};


$("#genCity").on("click", function(event) {
  event.preventDefault();
  setSearchHistory();
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
