
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
          // newAEl.setAttribute("href", "./form.html")
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
    window.location.href = "HTML/details.html";
    localStorage.setItem("dateselected", dateSelected);
  }


  loadDaystoCalendar()

