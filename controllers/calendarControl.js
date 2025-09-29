let calevents = []

async function getCalendarData(){
    try{
        calevents = []
        
        let weather = await getWeatherData()
    
        for (let i = 0; i < weather.length; i++) {
            calevents.push({
                title: "Min. Hőfok: " +weather[i].minmax[0],
                start: weather[i].date
                
            })
            calevents.push({
                title: "Max. Hőfok: " +weather[i].minmax[1],
                start: weather[i].date,
                backgroundColor:"#FF0000"
            })
            calevents.push({
                title: "Típus: " + weather[i].name,
                start: weather[i].date,
                backgroundColor:"#000000"
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