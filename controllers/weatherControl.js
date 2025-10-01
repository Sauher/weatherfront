let weather = []
let editmode = false
let selectedWeather = null


function SetDate(){
    let today = new Date().toISOString().split('T')[0];
    let dateField = document.getElementById("dateField")
    dateField.setAttribute("min",today)
}
async function PostWeather() {
    let dateoccupied = false
    let weatherid = 0
    let dateField = document.getElementById("dateField")
    let mindegreeField = document.getElementById("mindegreeField")
    let maxdegreeField = document.getElementById("maxdegreeField")
    let typeSelect = document.getElementById("typeSelect")

    

    try{
        if(typeSelect.value == '' || dateField.value == '' || mindegreeField.value == '' || maxdegreeField.value == ""){
            ShowAlert("Nem adtál meg minden adatot!", "alert-danger")
            return
        }
        if(mindegreeField.value > 40 || maxdegreeField.value < -10){
            ShowAlert("Reális adatokat adj meg!", "alert-danger")
            return
        }
        if(Number(mindegreeField.value) > Number(maxdegreeField.value)){
            ShowAlert("A minimum hőfok nem lehet nagyobb mint a maximum!", "alert-danger")
            return
        }
        if((dateField.value.split('-')[1] == "06" || dateField.value.split('-')[1] == "07" || dateField.value.split('-')[1] == "08") && mindegreeField.value < 10){
            ShowAlert("A hónaphoz illő hőfokot adj meg!", "alert-danger")
            return
        }
        if((dateField.value.split('-')[1] == "12" || dateField.value.split('-')[1] == "01" || dateField.value.split('-')[1] == "02") && maxdegreeField.value > 20){
            ShowAlert("A hónaphoz illő hőfokot adj meg!", "alert-danger")
            return
        }
        weather.forEach(wdata => {
            if(wdata.date == dateField.value){
                dateoccupied = true
                weatherid = wdata.id
            }
        })
        if(dateoccupied == false){
            const res = await fetch(`${API}/weather`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
        
                },
                body: JSON.stringify({
                    id: 0,
                    name: typeSelect.value,
                    minmax: [mindegreeField.value,maxdegreeField.value],
                    date: dateField.value
                })
            })
            const data = await res.json()
            if(res.status == 200){
                typeSelect.value = ''
                dateField.value = ''
                mindegreeField.value = ''
                maxdegreeField.value = ''
                ShowAlert(data.msg,"alert-success")
            }
            else{
                ShowAlert("Hiba az adatok küldése során!", "alert-danger")
            }
        }
        else{
            const res = await fetch(`${API}/weather/${weatherid}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
        
                },
                body: JSON.stringify({
                    id: 0,
                    name: typeSelect.value,
                    minmax: [mindegreeField.value,maxdegreeField.value],
                    date: dateField.value
                })
            })
            const data = await res.json()
            if(res.status == 200){
                typeSelect.value = ''
                dateField.value = ''
                mindegreeField.value = ''
                maxdegreeField.value = ''
                ShowAlert(data.msg,"alert-success")
            }
            else{
                ShowAlert("Hiba az adatok küldése során!", "alert-danger")
            }
            
        }
        
    loadTable()
    }
    catch(err){
        console.log("Hiba!", err)
    }
}
async function loadTable() {
    let tbody = document.getElementById("tbody")
    tbody.innerHTML = ''    
    try{
        weather = await getWeatherData()
        for (let i = 0; i < weather.length; i++) {
            let index = i 
                let td1 = document.createElement('td')
                let td2 = document.createElement('td')
                let td3 = document.createElement('td')
                let td4 = document.createElement('td')
                let td5 = document.createElement('td')
                let bt1 = document.createElement('button')
                let bt2 = document.createElement('button')
                let td6 = document.createElement('td')

                let tr = document.createElement('tr')
    
                td2.classList.add('text-end')
                td3.classList.add('text-end')
                td4.classList.add('text-end')
                td5.classList.add('text-end')
                td6.classList.add("text-end")
                bt1.classList.add("btn")
                bt1.classList.add("btn-warning")
                bt1.classList.add("mx-2")
                bt2.classList.add("mx-2")
                bt2.classList.add("btn")
                bt2.classList.add("btn-danger") 
                bt1.type = "button"
                bt2.type = "button"
                
                bt1.innerHTML = '<i class="bi bi-pencil-fill"></i>'
                bt2.innerHTML = '<i class="bi bi-trash-fill"></i>'

                bt1.setAttribute('onClick', `editWeather(${index+1})`)
                bt2.setAttribute('onClick',`Delete(${weather[i].id})`)

                td1.innerHTML = ""
                td2.innerHTML = weather[i].minmax[0] + " C°"
                td3.innerHTML = weather[i].minmax[1] + " C°"
                td4.innerHTML = weather[i].date
                switch (weather[i].name){
                    case 'cloudy':
                        td5.innerHTML = '<i class="bi bi-clouds-fill"></i>'
                        break
                    case 'rainy':
                        td5.innerHTML = '<i class="bi bi-cloud-rain-fill"></i>'
                        break
                    case 'foggy':
                        td5.innerHTML = '<i class="bi bi-cloud-fog-fill"></i>'
                        break
                    case 'snowy':
                        td5.innerHTML = '<i class="bi bi-cloud-snow-fill"></i>'
                        break
                    case 'storm':
                        td5.innerHTML = '<i class="bi bi-cloud-lightning-rain-fill"></i>'
                        break
                    case 'sunny':
                        td5.innerHTML = '<i class="bi bi-sun-fill"></i>'
                        
                }
            td6.appendChild(bt1)
            td6.appendChild(bt2)
            tr.appendChild(td1)
            tr.appendChild(td2)
            tr.appendChild(td3)
            tr.appendChild(td4)
            tr.appendChild(td5)
            tr.appendChild(td6)

            tbody.appendChild(tr)
            };
            
        }
    catch(err){
        console.log('Hiba!', err)
    }
}
async function getWeatherData(){ 
    const res = await fetch(`${API}/weather`)
    const data = await res.json()
    if(res.status == 200){
        return data
    }
    
}
async function Del() {
    await Delete(selectedWeather)
}
async function Update(){
    let dateOccupied = false
    let weatherid = 0
    let dateField = document.getElementById("dateField")
    let mindegreeField = document.getElementById("mindegreeField")
    let maxdegreeField = document.getElementById("maxdegreeField")
    let typeSelect = document.getElementById("typeSelect")

    

    if(typeSelect.value == '' || dateField.value == '' || mindegreeField.value == '' || maxdegreeField.value == ""){
        ShowAlert("Nem adtál meg minden adatot!", "alert-danger")
        return
    }
    if(mindegreeField.value > 40 || maxdegreeField.value < -10){
        ShowAlert("Reális adatokat adj meg!", "alert-danger")
        return
    }
    if(Number(mindegreeField.value) > Number(maxdegreeField.value)){
        ShowAlert("A minimum hőfok nem lehet nagyobb mint a maximum!", "alert-danger")
        return
    }
    if((dateField.value.split('-')[1] == "06" || dateField.value.split('-')[1] == "07" || dateField.value.split('-')[1] == "08") && mindegreeField.value < 10){
        ShowAlert("A hónaphoz illő hőfokot adj meg!", "alert-danger")
        return
    }
    if((dateField.value.split('-')[1] == "12" || dateField.value.split('-')[1] == "01" || dateField.value.split('-')[1] == "02") && maxdegreeField.value > 20){
        ShowAlert("A hónaphoz illő hőfokot adj meg!", "alert-danger")
        return
    }
    if(selectedWeather.date == dateField.value){
        try{
            const res = await fetch(`${API}/weather/${selectedWeather.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: selectedWeather.id,
                    name: typeSelect.value,
                    minmax: [mindegreeField.value,maxdegreeField.value],
                    date: dateField.value
                })
                })
                const data = await res.json()
                if (res.status == 200){
                    typeSelect.value = ''
                    dateField.value = ''
                    mindegreeField.value = ''
                    maxdegreeField.value = ''
                    ShowAlert("Sikeres adatfrissítés!", "alert-success")
                    await loadTable()
                }
                else{
                    ShowAlert("Hiba az adatok frissítése során!", 'alert-danger')
                }
        }
        catch (err){
            console.log('Hiba!' + err)
        }
        
    }
    else{
        
        weather.forEach(wdata => {
            if(wdata.date == dateField.value){
                dateOccupied = true
                weatherid = wdata.id
            }
        });
        if(dateOccupied == false){
            try{
                const res = await fetch(`${API}/weather`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: 0,
                        name: typeSelect.value,
                        minmax: [mindegreeField.value,maxdegreeField.value],
                        date: dateField.value
                    })
                    })
                    const data = await res.json()
                    if (res.status == 200){
                        typeSelect.value = ''
                        dateField.value = ''
                        mindegreeField.value = ''
                        maxdegreeField.value = ''
                        ShowAlert("Sikeres adatfrissítés!", "alert-success")

                    }
                    else{
                        ShowAlert("Hiba az adatok küldése során!", 'alert-danger')
                    }
                    try{
                        const res = await fetch(`${API}/weather/${selectedWeather.id}`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                           
                            })
                            await loadTable()
                    }
                    catch(err){
                        ShowAlert("Hupika1",'alert-danger')
                        console.log(err)
                    }
            }
            catch(err){
                console.log(err)
            }
        }
        else{
            try{
               
                const res = await fetch(`${API}/weather/${selectedWeather.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                   
                    })
            }
            catch(err){
                ShowAlert("Hupika1",'alert-danger')
                console.log(err)
            }
            try{
                weather.forEach(wdata => {
                    if(wdata.date == dateField.value){
                        weatherid = wdata.id
                    }
                })
                const res = await fetch(`${API}/weather/${weatherid}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: weatherid,
                    name: selectedWeather.name,
                    minmax: selectedWeather.minmax,
                    date: selectedWeather.date
                })
                })
                const data = await res.json()
                if (res.status == 200){
                    typeSelect.value = ''
                    dateField.value = ''
                    mindegreeField.value = ''
                    maxdegreeField.value = ''
                    ShowAlert("Sikeres adatfrissítés!", "alert-success")
                    Cancel()
                    await loadTable()
                }
                else{
                    ShowAlert("Hiba az adatok frissítése során!", 'alert-danger')
                }
            }
            catch(err){
                console.log(err)
            }
        }
        
    }
    Cancel()
}

async function editWeather(index){
    let dateField = document.getElementById("dateField")
    let mindegreeField = document.getElementById("mindegreeField")
    let maxdegreeField = document.getElementById("maxdegreeField")
    let typeSelect = document.getElementById("typeSelect")
    toggleEditMode(true)
    dateField.value = weather[index-1].date
    mindegreeField.value = weather[index-1].minmax[0]
    maxdegreeField.value = weather[index-1].minmax[1]
    typeSelect.value = weather[index-1].name
    selectedWeather = 1
    selectedWeather = weather[index-1]
}
async function Delete(index){
    if(confirm("Biztos?")){
    try{
        const res = await fetch(`${API}/weather/${index}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
           
            })
            let data = await res.json()
            if (res.status == 200){
                typeSelect.value = ''
                dateField.value = ''
                mindegreeField.value = ''
                maxdegreeField.value = ''
                ShowAlert(data.msg, "alert-success")
                Cancel()
                await loadTable()
            }
            else{
                ShowAlert("Hupika2",'alert-danger')
            }
    }
    catch(err){
        ShowAlert("Hupika1",'alert-danger')
        console.log(err)
    }
}
}
function toggleEditMode(mode){
    let addBtn = document.getElementById("addBtn")
    let updBtn = document.getElementById("updBtn")
    let delBtn = document.getElementById("delBtn")
    let cancelBtn = document.getElementById("cancelBtn")
    if(mode){
        addBtn.classList.add("d-none")
        updBtn.classList.remove("d-none")
        delBtn.classList.remove("d-none")
        cancelBtn.classList.remove("d-none")
    }
    else{
        addBtn.classList.remove("d-none")
        updBtn.classList.add("d-none")
        delBtn.classList.add("d-none")
        cancelBtn.classList.add("d-none")
    }
}
function Cancel(){
    toggleEditMode(false)
    let dateField = document.getElementById("dateField")
    let mindegreeField = document.getElementById("mindegreeField")
    let maxdegreeField = document.getElementById("maxdegreeField")
    let typeSelect = document.getElementById("typeSelect")

    typeSelect.value = null
    dateField.value = null
    mindegreeField.value = null
    maxdegreeField.value = null
    selectedWeather = null
}
