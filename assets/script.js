var inputEl = document.getElementById('datepicker');
var dateSelected = '';


function loadPicker(){
     var instances = M.Datepicker.init(inputEl);
     var int = M.Datepicker.getInstance(inputEl)
    
    console.log(int.$el[0].M_Datepicker.Datepicker)

    //  console.log(instances[0].$el[0].M_Datepicker)
    //  console.log(instances[0].$el[0].M_Datepicker['date'])       

}

loadPicker();
