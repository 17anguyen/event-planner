//-------------------------------google calendar request---------------------------------------------
/* exported gapiLoaded */
/* exported gisLoaded */
/* exported handleAuthClick */
/* exported handleSignoutClick */

// TODO(developer): Set to client ID and API key from the Developer Console
const CLIENT_ID = '94195819965-dpf9kuqrt6pg08b8elfg2q7gjh8hb55f.apps.googleusercontent.com';
const API_KEY = 'AIzaSyDODGfzRiDMxFbFGhVgbqQvH_KOLR0nyWQ';

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/calendar';

let tokenClient;
let gapiInited = false;
let gisInited = false;

document.getElementById('authorize_button').style.visibility = 'hidden';
document.getElementById('signout_button').style.visibility = 'hidden';

/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
  gapi.load('client', initializeGapiClient);
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializeGapiClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC],
  });
  gapiInited = true;
  maybeEnableButtons();
}

/**
 * Callback after Google Identity Services are loaded.
 */
function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: '', // defined later
  });
  gisInited = true;
  maybeEnableButtons();
}

/**
 * Enables user interaction after all libraries are loaded.
 */
function maybeEnableButtons() {
  if (gapiInited && gisInited) {
    document.getElementById('authorize_button').style.visibility = 'visible';
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick() {
  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
      throw (resp);
    }
    document.getElementById('signout_button').style.visibility = 'visible';
    document.getElementById('authorize_button').innerText = 'Refresh';
    // await listUpcomingEvents();
  };

  if (gapi.client.getToken() === null) {
    // Prompt the user to select a Google Account and ask for consent to share their data
    // when establishing a new session.
    tokenClient.requestAccessToken({ prompt: 'consent' });
  } else {
    // Skip display of account chooser and consent dialog for an existing session.
    tokenClient.requestAccessToken({ prompt: '' });
  }
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick() {
  const token = gapi.client.getToken();
  if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken('');
    // document.getElementById('content').innerText = '';
    document.getElementById('authorize_button').innerText = 'Authorize';
    document.getElementById('signout_button').style.visibility = 'hidden';
  }
}


//-----------------------Map rendering 
function initMap() {
  const CONFIGURATION = {
    "ctaTitle": "Checkout",
    "mapOptions": {"center":{"lat":37.4221,"lng":-122.0841},"fullscreenControl":true,"mapTypeControl":false,"streetViewControl":true,"zoom":11,"zoomControl":false,"maxZoom":22,"mapId":""},
    "mapsApiKey": "AIzaSyDmuiarkNWRqtBihboppkevxX6y-v7SGmk",
    "capabilities": {"addressAutocompleteControl":true,"mapDisplayControl":true,"ctaControl":false}
  };
  const componentForm = [
    'location',
    'locality',
    'administrative_area_level_1',
    'country',
    'postal_code',
  ];

  const getFormInputElement = (component) => document.getElementById(component + '-input');
  const map = new google.maps.Map(document.getElementById("gmp-map"), {
    zoom: CONFIGURATION.mapOptions.zoom,
    center: { lat: 37.4221, lng: -122.0841 },
    mapTypeControl: false,
    fullscreenControl: CONFIGURATION.mapOptions.fullscreenControl,
    zoomControl: CONFIGURATION.mapOptions.zoomControl,
    streetViewControl: CONFIGURATION.mapOptions.streetViewControl
  });
  const marker = new google.maps.Marker({map: map, draggable: false});
  const autocompleteInput = getFormInputElement('location');
  const autocomplete = new google.maps.places.Autocomplete(autocompleteInput, {
    fields: ["address_components", "geometry", "name"],
    types: ["address"],
  });
  autocomplete.addListener('place_changed', function () {
    marker.setVisible(false);
    const place = autocomplete.getPlace();
    if (!place.geometry) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert('No details available for input: \'' + place.name + '\'');
      return;
    }
    renderAddress(place);
    fillInAddress(place);
  });

  function fillInAddress(place) {  // optional parameter
    const addressNameFormat = {
      'street_number': 'short_name',
      'route': 'long_name',
      'locality': 'long_name',
      'administrative_area_level_1': 'short_name',
      'country': 'long_name',
      'postal_code': 'short_name',
    };
    const getAddressComp = function (type) {
      for (const component of place.address_components) {
        if (component.types[0] === type) {
          return component[addressNameFormat[type]];
        }
      }
      return '';
    };
    getFormInputElement('location').value = getAddressComp('street_number') + ' '
              + getAddressComp('route');
    for (const component of componentForm) {
      // Location field is handled separately above as it has different logic.
      if (component !== 'location') {
        getFormInputElement(component).value = getAddressComp(component);
      }
    }
  }
// getting address from user selection
  function renderAddress(place) {
    map.setCenter(place.geometry.location);
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);
  }
}

//------------------ Get the input and button elements
const taskInput = document.querySelector('.task-input');
const addCheckTaskBtn = document.querySelector('#add-button');
// const eventForm = document.querySelector('#eventForm');
const eventInput = document.querySelector('#event-name');
const events = document.querySelectorAll('.events');
const taskUpdateBtn = document.querySelector('#task-submit-btn');
const eventBtnEl = document.querySelector('#add-event');
const attendeeLisEl = document.querySelector('#attendees');
var eventAdded = false ;
var selecteDateUser = localStorage.getItem("dateselected");
var selectedEndTime = localStorage.getItem("endTime");
var selectedStartTime = localStorage.getItem("startTime");
const taskList = document.querySelector('#list');




function saveInfoEvent(event) {
  event.preventDefault()
  
  var locationInputEl = document.getElementById("location-input");
  var cityInput = document.querySelector("#locality-input");
  var stateInput = document.querySelector("#administrative_area_level_1-input");
  var zipInput = document.querySelector("#postal_code-input");
  var countryInput = document.querySelector('#country-input')
  // state input
  var location = locationInputEl.value + " " + cityInput.value + ", " + stateInput.value + " " + zipInput.value + " "
  if (localStorage !== null) {
    
    var dateParseStart = dayjs(selecteDateUser).format('YYYY-MM-DDT'+selectedStartTime+':ssZ') ;
    var dateParseEnd = dayjs(selecteDateUser).format('YYYY-MM-DDT'+selectedEndTime+':ssZ')
    var eventName = eventInput.value;

    //getting attendee list to calendar format standards and checking if more than one
    var listAt = attendeeLisEl.value;
    var attendeesList = listAt.split(',');
    var finalAttendeeList = [];

    for (i = 0; i < attendeesList.length; i++) {
      var attendeePerson = {};
      attendeePerson['email']= attendeesList[i].trim();
      finalAttendeeList.push(attendeePerson);

    }
    
    createEventGoogle(eventName,dateParseStart,dateParseEnd,finalAttendeeList,location);

    eventInput.value = '';
    locationInputEl.value = ' ';
     cityInput.value = ' ';
    stateInput.value = ' ';
    zipInput.value = ' ';
    attendeeLisEl.value = ' ';
    countryInput.value= ' ';

  }
  if(eventAdded){
    var eventAddedEl = document.getElementById("event-added-p");
    eventAddedEl.textContent = "Event added to your calendar!"
    eventAdded = false;
  }

}

//add event to the user's google calendar  
function createEventGoogle(nameEvent,dateTStart, dateTimeEnd,attendeeList,locationSelected){
  if (dateTStart && nameEvent && dateTimeEnd){
    const event = {
      'summary': nameEvent,
      'location': locationSelected,
      'start': {
        'dateTime': dateTStart,
        'timeZone': '',
      },
      'end': {
        'dateTime': dateTimeEnd,
        'timeZone': '',
      },
      'attendees': attendeeList,

    'colorId': 3,
  };

  const request = gapi.client.calendar.events.insert({
    'calendarId': 'primary',
    'resource': event
  });

  request.execute(function (event) {
    appendPre('Event created: ' + event.summary);
  });

  eventAdded = true;
}

}

//bottom add event 
eventBtnEl.addEventListener('click', saveInfoEvent)



function backToMainCalendar() {
  window.location.href = "../index.html";

}



// Tasks save to local storage


// Load tasks from local storage
function loadTasks(){
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    console.log(localStorage.key(i))
    if (key.startsWith("task")) {
      const value = localStorage.getItem(key);
      console.log(value)
      const index = key.split('-')[1];
      console.log(index)
      // taskList[index].textContent = value;

    }
  }

}


// Add event listener to button
addCheckTaskBtn.addEventListener('click', addTask);


function addTask() {
  // Get the ul element and create a new li element
  
  const newTask = document.createElement('li');
  const taskInput = document.createElement('input');
  taskInput.type = 'text';
  taskInput.classList.add('task-input');
  taskInput.addEventListener('input', saveTasks);
  newTask.appendChild(taskInput);

  // Append the new li element to the ul element
  taskList.appendChild(newTask);

  // Clear the input field
  taskInput.value = ' ';

}

function saveTasks() {
  // Get all the input fields and checkboxes
  var taskInputs = document.querySelectorAll('.task-input');
  // Save each task and its checked status to local storage
  var tasks = [];
  for (let i = 0; i < taskInputs.length; i++) {
    var task = taskInputs[i].value.trim();
    if (task !== '') {
      tasks.push({ 'task': task , 'date': selecteDateUser});
    }
  }
  var taskname = 'tasks-'+ selecteDateUser;

  localStorage.setItem(taskname, JSON.stringify(tasks));
}



// Load tasks from local storage
loadTasks();
