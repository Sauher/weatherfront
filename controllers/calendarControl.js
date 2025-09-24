let calevents = []

async function getCalendarData(){
    try{
        calevents = []
        
        let weather = await getWeatherData()
    
        for (let i = 0; i < weather.length; i++) {
            calevents.push({
                title: "Hőfok: " +weather[i].minmax[1],
                start: weather[i].date
            })
        }
    }
    catch(err){
        console.log(err)
    }
}

function initCalendar(){
    var calendarEl = document.getElementById('calendar');
        var calendar = new FullCalendar.Calendar(calendarEl, {
          initialView: 'dayGridMonth',
          locale:'hu',
          headerToolbar:{
            left:'prev,today,next',
            center: 'title',
            right: 'multiMonthYear,dayGridMonth,timeGridWeek,listWeek,timeGridDay'
          },
          events: calevents
        });
        calendar.render();
}