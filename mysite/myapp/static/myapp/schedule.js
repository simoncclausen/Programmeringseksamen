/**
 * Lavet af Theis Mark
 */
var events = [];
const colors = [
  "red",
  "green",
  "blue",
  "yellow",
  "purple",
  "cyan",
  "gray",
  "limegreen",
  "pink",
  "orange",
  "magenta"
];
let currentDate = new Date();
var businessStartHours = 9;
var timeslotInterval = 15;
const daysInaWeek = 7;
var eventContainer = document.getElementsByClassName("event-container")[0];
var maindims = eventContainer.getBoundingClientRect();
var sections = daysInaWeek;
var eventsByDay = {};
var eventDate = document.getElementById("date");
var start = document.getElementById("starttime");
var end = document.getElementById("endtime");
var name = document.getElementById("eventName");
var cost = document.getElementById("eventCost");
var participants = document.getElementById("eventParticipants");
var id = 1;

document.getElementById("addActivityForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const evt = {
        id: id,
        starttime: start.value,
        endtime: end.value,
        date: eventDate.value,
        name: eventName.value,
        cost: eventCost.value,
        participants: eventParticipants.value    
    };
    //console.log('Form submitted:', evt); // Log the submitted event
    id++;
    eventContainer.innerHTML = "";
    events.push(evt);
    processEvents(currentDate); // Pass currentDate as an argument
    loadEvents();
      
  });
  function processEvents(currentDate) {
   // console.log('Processing events:', events); // Log events before processing
    eventsByDay = {}; // Reset eventsByDay object
    events
      .filter(evt => isDateWithinDisplayedWeek(evt.date, currentDate)) // Filter events based on the displayed week
      .forEach(evt => {
        const cell = getCell(evt.starttime);
  
        // check if exist
        if (!eventsByDay[evt.date]) {
          eventsByDay[evt.date] = {};
          eventsByDay[evt.date][cell] = [];
        }
  
        if (!eventsByDay[evt.date][cell]) {
          eventsByDay[evt.date][cell] = [];
        }
  
        eventsByDay[evt.date][cell].push(evt);
      });
      //console.log('Events by day:', eventsByDay); // Log eventsByDay after processingso
  }

  

function getCell(starttime) {
  const h = +starttime.split(":")[0];
  return h - businessStartHours;
}
/**
 * sort by starttime
 */
function sortcomparer(e1, e2) {
  const t1start = timeFromString(e1.starttime);
  const t1end = timeFromString(e1.endtime);
  const t2start = timeFromString(e2.starttime);
  const t2end = timeFromString(e2.endtime);

  //return t1start.getTime() - t2start.getTime();
  const t1 = +(t1end - t1start);
  const t2 = +(t2end - t2start);

  return t2 - t1;
}


function isDateWithinDisplayedWeek(date, currentDate) {
    const eventDate = new Date(date);
    const startDate = getWeekStartDate(currentDate);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);
  
    // Adjust endDate to the end of the day
    endDate.setHours(23);
    endDate.setMinutes(59);
    endDate.setSeconds(59);
    
    console.log('Event date:', eventDate); // Log eventDate
    console.log('Week start date:', startDate); // Log startDate
    console.log('Week end date:', endDate); // Log endDate
    console.log('Is event date within the week?', eventDate >= startDate && eventDate <= endDate); // Log the comparison result
  
    return eventDate >= startDate && eventDate <= endDate;
  }
  
  
  
  function loadEvents() {
   // console.log('Loading events:', eventsByDay);
    const currentDate = new Date();
    const weekStartDate = getWeekStartDate(currentDate);
  
    Object.keys(eventsByDay).forEach(e => {
      const eventsForThisDay = eventsByDay[e];
      //console.log('Events for this day:', eventsForThisDay);
  
      Object.keys(eventsForThisDay).forEach(c => {
        const events = eventsForThisDay[c];
        events.sort(sortcomparer);
        var totalEventsPerCell = events.length;
        var offset = 0;
  
        for (var i = 0; i < events.length; i++) {
          var event = events[i];
  
          const colPos = getColumnPosition(event.date, weekStartDate);
          const perc = 100 / (sections + 1 - colPos);
          const percW = Math.floor(perc / totalEventsPerCell);
  
          var wMultiplier = 1.5;
          if (offset === totalEventsPerCell - 1) {
            wMultiplier = 0.95;
          }
  
          event["width"] = percW * wMultiplier;
          console.log('Width:', event.width);
          event["left"] = percW * offset;
          event["time"] = `${event.starttime} - ${event.endtime}`;
          console.log('Time:', event.time);
          renderEvent(event);
          console.log('Loaded event:', event);
          ++offset;
        }
      });
    });
  }
  
     
  function renderEvent(evt) {
    //console.log('Rendering event:', evt); // Log the event being rendered
    var oneEvent = document.createElement("div");
    var eventStatus = document.createElement("div");
    var eventName = document.createElement("div");
    var eventTime = document.createElement("div");
    var eventCost = document.createElement("div");
    var eventParticipants = document.createElement("div");
    
    const color = Math.floor(Math.random() * colors.length);
    eventName.innerHTML = `${evt.name}`;
    eventTime.innerHTML = `${evt.time}`;
    eventParticipants.innerHTML = `Participants: ${evt.participants}`;
    eventCost.innerHTML = `Cost: ${evt.cost} kr`; 
  
    oneEvent.appendChild(eventStatus);
    oneEvent.appendChild(eventName);
    oneEvent.appendChild(eventTime);
    oneEvent.appendChild(eventCost);
    oneEvent.appendChild(eventParticipants);
  
    eventName.setAttribute("class", "event-name");
    eventTime.setAttribute("class", "event-name");
    eventCost.setAttribute("class", "event-name"); 
    eventParticipants.setAttribute("class", "event-name");
    eventStatus.setAttribute("class", "event-status");
    oneEvent.setAttribute("class", "slot");

    /**
     * if two events have same start time
     */
    oneEvent.style.background = colors[color];
    oneEvent.style.width = evt.width + "%";
    oneEvent.style.left = evt.left + "%";
    oneEvent.style.zIndex = evt.zindex;
    oneEvent.style.height = getHeight(evt.starttime, evt.endtime) + "px";
    // 100 / ((8-colPos))
    oneEvent.style.gridColumnStart = getColumnPosition(evt.date);
    console.log('Evt column:',getColumnPosition(evt.date));
    oneEvent.style.gridRowStart = getRowPosition(evt.starttime);
    console.log('Evt row:',getRowPosition(evt.starttime));
    /* add to event container */
    eventContainer.appendChild(oneEvent);
    console.log('Event rendered.'); // Log after rendering the event
}

  
function getEventsForCell(starttime) {
  const h = starttime.split(":")[0];
  const eventsForCell = events.filter(e => e.starttime.split(":")[0] === h);
  return eventsForCell;
}

function getEventsForDay(day) {
  const eventsForDay = events.filter(e => e.date === day);
  return eventsForDay;
}
/**
 * given a start date returns the column position
 *
 * input: startdate (yy-mm-dd)
 */
 function getColumnPosition(startdate,) {
    const y = +startdate.split("-")[0];
    const m = +startdate.split("-")[1]-1;
    const d = +startdate.split("-")[2];

    console.log('y:', y);
    console.log('m:', m);
    console.log('d:', d);

    const date = new Date(y, m, d);
    const day = date.getDay();

    console.log('date:', date);
    console.log('day:', day);
    console.log('Event date',new Date)
    return date.getDay()+1;
}
 
/**
 * given start time returns the row position
 *
 * input: starttime (x:xx)
 */
function getRowPosition(starttime) {
  const h = +starttime.split(":")[0];
  const m = +starttime.split(":")[1];
  const totalMinutes = (h * 60 + m);
  const rowPos = (totalMinutes / 60 - 7)*4+1;

  return rowPos;
}
 
 function getHeight(starttime, endtime) {
    const starthour = starttime.split(":")[0];
    const startmin = starttime.split(":")[1];
    const endhour = endtime.split(":")[0];
    const endmin = endtime.split(":")[1];
  
    console.log('Start hour:', starthour);
    console.log('Start min:', startmin);
    console.log('End hour:', endhour);
    console.log('End min:', endmin);
  
    var datestart = new Date();
    var dateend = new Date();
    datestart.setHours(parseInt(starthour));
    datestart.setMinutes(parseInt(startmin));
  
    dateend.setHours(parseInt(endhour));
    dateend.setMinutes(parseInt(endmin));
  
    console.log('Date start:', datestart);
    console.log('Date end:', dateend);
  
    var duration = Math.abs(datestart.valueOf() - dateend.valueOf()) / 1000;
    console.log('Duration:', duration);
  
    return duration / 60;
  }
  

function timeFromString(string) {
  var d = new Date(0);

  var h = string.split(":")[0];
  var m = string.split(":")[1];

  d.setHours(h);
  d.setMinutes(m);

  return d;
}

/**
 *  fmt: "yyyy-mm-dd"
 */
function dateFromString(string) {
  var d = new Date(0);

  const y = +string.split("-")[0];
  const m = +string.split("-")[1] -1;
  const day = +string.split("-")[2];

  d.setFullYear(y, m, d);
  d.setMonth(m);
  d.setDate(day);

  return d;
 } 

    updateDateRow(currentDate);

    const prevWeekBtn = document.getElementById('prev-week');
    const nextWeekBtn = document.getElementById('next-week');

    prevWeekBtn.addEventListener('click', function () {
        currentDate.setDate(currentDate.getDate() - 7);
        updateDateRow(currentDate);
        eventContainer.innerHTML = ""; // Clear the event container
        processEvents(currentDate); // Pass currentDate as an argument
     loadEvents(); // Load the events again
    });

    nextWeekBtn.addEventListener('click', function () {
        currentDate.setDate(currentDate.getDate() + 7);
        updateDateRow(currentDate);
        eventContainer.innerHTML = ""; // Clear the event container
        processEvents(currentDate); // Pass currentDate as an argument
     loadEvents(); // Load the events again
    });

    function updateDateRow(date) {
        const weekStartDate = getWeekStartDate(date);
        const monthNames = ["Jan.", "Feb.", "Mar.", "Apr.", "May.", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];
    
        for (let i = 0; i < 7; i++) {
            const currentDay = new Date(weekStartDate);
            document.querySelector('.week-number-cell').textContent = `Week ${getWeekNumber(weekStartDate)}`;
            currentDay.setDate(currentDay.getDate() + i);
            const dayId = ['sunday-date', 'monday-date', 'tuesday-date', 'wednesday-date', 'thursday-date', 'friday-date', 'saturday-date'][i];
            const dayMonth = monthNames[currentDay.getMonth()]; // Get the month name
            document.getElementById(dayId).textContent = `${dayMonth} ${currentDay.getDate()}`; // Update this line to include the month
        }
  }

$('#addActivityModal').on('hidden.bs.modal', function () {
    document.getElementById('eventName').value = '';
    document.getElementById('date').value = '';
    document.getElementById('starttime').value = '';
    document.getElementById('endtime').value = '';
    document.getElementById('eventParticipants').value = '';
    document.getElementById('eventCost').value = '';
});
  function getWeekStartDate(date) {
    const dayOfWeek = date.getDay();
    const diff = date.getDate() - dayOfWeek;
    const weekStartDate = new Date(date);
    weekStartDate.setDate(diff);
    weekStartDate.setHours(0, 0, 0, 0); // Set the time to midnight mangler her 
    return weekStartDate; 
}
  
function getWeekNumber(date) {
    const onejan = new Date(date.getFullYear(), 0, 1);
    const millisecsInDay = 86400000;
    const weekNumber = Math.ceil(((date - onejan) / millisecsInDay + onejan.getDay() + 1) / 7);
    return weekNumber;
}

processEvents(currentDate);
loadEvents();