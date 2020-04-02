// Gets current day and time and displays immediately:
var nowMoment = moment().format("dddd, MMMM Do, h:mma");
$("#currTime").text(nowMoment);

// Maintains time current to the second:
function updateTime() {
  nowMoment = moment().format("dddd, MMMM Do, h:mma");
  $("#currTime").text(nowMoment);
};
setInterval(updateTime, 1000);

// Get city from search bar (input form-control)

// When search button clicked, it drops information into the current city field:

// Get current temperature
// Get current RH
// Get current wind speed
// Get UV index

// Figure a way to color-code the UV index according to conditions

// Figure a way to get five-day data for temperature and RH.

// Save current search in search history (localStorage) and bring up last ten searches.
