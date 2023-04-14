
//background movement
  var scene = document.getElementById('scene');
  var parallax = new Parallax(scene);
  //setting up the current month
  var currentMonth = dayjs().format('MMMM YYYY');
  var daysInCurrentMonth = dayjs(currentMonth).daysInMonth();
  var startofCurrentMonth = dayjs(currentMonth).startOf('W').$d;
  var firstDayofMonth = 'day'+ dayjs(startofCurrentMonth).format('d');
  var allLiEl = document.querySelector('.days').children;
  var currentMonthEl = document.querySelector('.current-date');
  currentMonthEl.textContent = currentMonth;
  var dateSelected = '';
  var btnSubmit = document.querySelector('.submit');
  var selectStartTimeEl = document.querySelector('#start-time-select');
  var selectEndTimeEl = document.querySelector('#end-time-select');
 
  var selectedDay;



  

  function loadDaystoCalendar(){
    var daysTotal = parseInt(daysInCurrentMonth) + parseInt(dayjs(startofCurrentMonth).format('d'));
      for(var i=0;i < daysTotal; i++ ){
        if(allLiEl[i].id && allLiEl[i].id == firstDayofMonth){

          var x = 1
          var date = x +' '+ currentMonth
          var newAEl = document.createElement('a');
          allLiEl[i].textContent = x;
          allLiEl[i].setAttribute('data-set',date);
          allLiEl[i].addEventListener('click',saveDateValue);
          allLiEl[i].classList.remove('inactive');
          allLiEl[i].classList.add('active');
         
          allLiEl[i].appendChild(newAEl)

          x+=1;

        }else if(x > 1){

          date = x +' '+ currentMonth
          allLiEl[i].textContent = x;
          allLiEl[i].setAttribute('data-set',date);
          allLiEl[i].addEventListener('click',saveDateValue);
          allLiEl[i].classList.remove('inactive');
          allLiEl[i].classList.add('active');

          x+=1

        }
        
      }
     
  }
  function saveDateValue(event){
    dateSelected= event.target.getAttribute("data-set");
    if (selectedDay) {
      selectedDay.classList.remove("selected")
    }
    event.target.classList.add("selected");
    selectedDay = event.target
    localStorage.setItem("dateselected", dateSelected);
    
  }

  function clickToAnotherPage(){
    console.log(selectStartTimeEl);
    selectedStartTime = selectStartTimeEl.value;
    selectedEndTime = selectEndTimeEl.value;
    console.log(selectedStartTime);
    console.log(selectedEndTime);
    localStorage.setItem("startTime", selectedStartTime);
    localStorage.setItem("endTime", selectedEndTime);
    window.location.href = "HTML/details.html";
  }

//loading calendar numbers
  loadDaystoCalendar()

  //sbumit btn to the next page
  btnSubmit.addEventListener('click',clickToAnotherPage);

