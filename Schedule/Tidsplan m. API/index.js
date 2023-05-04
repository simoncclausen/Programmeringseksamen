var events = [];
const colors = [
  "#FF5A5F",
  "#008080",
  "#FFC996",
  "#003366",
  "#F15BB5",
  "#7BCBCB",
  "#001B44",
  "#F19CBB",
  "#1E90FF",
  "#FFA07A",
];
document.getElementById("apiActivityButton").addEventListener('click', fetchAndAddActivity);
const addActivityForm = document.getElementById('addActivityForm');
const addActivityModal = new bootstrap.Modal(document.getElementById('addActivityModal'));
let currentDate = new Date();
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

async function fetchAndAddActivity() {
  const response = await fetch("http://www.boredapi.com/api/activity/");
  const data = await response.json();

  const currentTime = new Date();
  const endTime = new Date(currentTime.getTime() + (60 * 60 * 1000));

  const activityData = {
    starttime: `${currentTime.getHours()}:${currentTime.getMinutes()}`,
    endtime: `${endTime.getHours()}:${endTime.getMinutes()}`,
    date: `${currentTime.getFullYear()}-0${currentTime.getMonth()+1}-0${currentTime.getDate()}`,
    name: data.activity,
    cost: data.price,
    participants: data.participants,
  };

  addActivity(activityData);
  console.log(activityData)
}


function addActivity(data) {
  const evt = {
    id: id,
    starttime: data.starttime,
    endtime: data.endtime,
    date: data.date,
    name: data.name,
    cost: data.cost,
    participants: data.participants,
    color: colors[Math.floor(Math.random() * colors.length)]
  };
  id++;
  eventContainer.innerHTML = "";
  events.push(evt);
  processEvents(currentDate);
  loadEvents();
  console.log(evt)
}



document.getElementById("addActivityForm").addEventListener("submit", function(event) {
  event.preventDefault();
  if (addActivityForm.checkValidity()) {
    event.preventDefault();
    addActivityModal.hide();

    const data = {
      starttime: start.value,
      endtime: end.value,
      date: eventDate.value,
      name: eventName.value,
      cost: eventCost.value,
      participants: eventParticipants.value,
    };

    addActivity(data);
  }

  addActivityForm.classList.add('was-validated');
});


  function isDateWithinDisplayedWeek(date, currentDate) {
    const eventDate = new Date(date);
    const startDate = getWeekStartDate(currentDate);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);
  
    endDate.setHours(23);
    endDate.setMinutes(59);
    endDate.setSeconds(59);
    
    console.log('Event date:', eventDate);
    console.log('Week start date:', startDate); 
    console.log('Week end date:', endDate);
    console.log('Is event date within the week?', eventDate >= startDate && eventDate <= endDate);
  
    return eventDate >= startDate && eventDate <= endDate;
  }

  function processEvents(currentDate) {
    eventsByDay = {};
    events
      .filter(evt => isDateWithinDisplayedWeek(evt.date, currentDate))
      .forEach(evt => {
        const cell = getCell(evt.starttime);
  
        if (!eventsByDay[evt.date]) {
          eventsByDay[evt.date] = {};
          eventsByDay[evt.date][cell] = [];
        }
  
        if (!eventsByDay[evt.date][cell]) {
          eventsByDay[evt.date][cell] = [];
        }
  
        eventsByDay[evt.date][cell].push(evt);
      });
  }

 function getCell(starttime) {
  const h = +starttime.split(":")[0];
  return h - 9;
 }

 function sortcomparer(e1, e2) {
  const t1start = timeFromString(e1.starttime);
  const t1end = timeFromString(e1.endtime);
  const t2start = timeFromString(e2.starttime);
  const t2end = timeFromString(e2.endtime);

  const t1 = +(t1end - t1start);
  const t2 = +(t2end - t2start);

  return t2 - t1;
 }   
  
  function loadEvents() {
    const currentDate = new Date();
    const weekStartDate = getWeekStartDate(currentDate);
  
    Object.keys(eventsByDay).forEach(e => {
      const eventsForThisDay = eventsByDay[e];
  
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
    var oneEvent = document.createElement("div");
    var eventStatus = document.createElement("div");
    var eventName = document.createElement("div");
    var eventTime = document.createElement("div");
    var eventCost = document.createElement("div");
    var eventParticipants = document.createElement("div");
    
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

    oneEvent.style.background = evt.color;
    oneEvent.style.width = evt.width + "%";
    oneEvent.style.left = evt.left + "%";
    oneEvent.style.zIndex = evt.zindex;
    oneEvent.style.height = getHeight(evt.starttime, evt.endtime) + "px";
 
    oneEvent.style.gridColumnStart = getColumnPosition(evt.date);
    console.log('Evt column:',getColumnPosition(evt.date));
    oneEvent.style.gridRowStart = getRowPosition(evt.starttime);
    console.log('Evt row:',getRowPosition(evt.starttime));
   
    eventContainer.appendChild(oneEvent);
    console.log('Event rendered.');
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

 function getColumnPosition(startdate,) {
    const y = +startdate.split("-")[0];
    const m = +startdate.split("-")[1]-1;
    const d = +startdate.split("-")[2];

    const date = new Date(y, m, d);
    const day = date.getDay();

    return day+1;
 }
 

 function getRowPosition(starttime) {
  const h = +starttime.split(":")[0];
  const m = +starttime.split(":")[1];
  
  const totalMinutes = (h * 60 + m);
  const rowPos = (totalMinutes / 60 - 7)*60+1;

  return Math.round(rowPos);

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
    console.log("Duration",duration)
  
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


  const prevWeekBtn = document.getElementById('prev-week');
  const nextWeekBtn = document.getElementById('next-week');

  prevWeekBtn.addEventListener('click', function () {
   currentDate.setDate(currentDate.getDate() - 7);
   updateDateRow(currentDate);
   eventContainer.innerHTML = "";
   processEvents(currentDate);
   loadEvents();
  });

  nextWeekBtn.addEventListener('click', function () {
   currentDate.setDate(currentDate.getDate() + 7);
   updateDateRow(currentDate);
   eventContainer.innerHTML = "";
   processEvents(currentDate);
   loadEvents();
  });

  function updateDateRow(date) {
   const weekStartDate = getWeekStartDate(date);
   const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
   for (let i = 0; i < 7; i++) {
     const currentDay = new Date(weekStartDate);
     const currentYear = currentDay.getFullYear();
     document.querySelector('.week-number-cell').textContent = `Week ${getWeekNumber(weekStartDate)}, ${currentYear}`;
     currentDay.setDate(currentDay.getDate() + i);
     const dayId = ['sunday-date', 'monday-date', 'tuesday-date', 'wednesday-date', 'thursday-date', 'friday-date', 'saturday-date'][i];
     const dayMonth = monthNames[currentDay.getMonth()];
     document.getElementById(dayId).textContent = `${currentDay.getDate()}. ${dayMonth}`;
    }
  }

 $('#addActivityModal').on('hidden.bs.modal', function () {
    document.getElementById('eventName').value = '';
    document.getElementById('date').value = '';
    document.getElementById('starttime').value = '';
    document.getElementById('endtime').value = '';
    document.getElementById('eventParticipants').value = '';
    document.getElementById('eventCost').value = '';
    addActivityForm.classList.remove('was-validated');
 });
  function getWeekStartDate(date) {
    const dayOfWeek = date.getDay();
    const diff = date.getDate() - dayOfWeek;
    const weekStartDate = new Date(date);
    weekStartDate.setDate(diff);
    weekStartDate.setHours(0, 0, 0, 0);
    return weekStartDate; 
 }
  
  function getWeekNumber(date) {
    const janfirst = new Date(date.getFullYear(), 0, 1);
    const millisecsInDay = 86400000;
    const weekNumber = Math.ceil(((date - janfirst) / millisecsInDay + janfirst.getDay() + 1) / 7);
    return weekNumber;
 }

 updateDateRow(currentDate);
 processEvents(currentDate);
 loadEvents();