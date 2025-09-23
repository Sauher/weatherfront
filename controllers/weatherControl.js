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

    if(typeSelect.value == '' || dateField.value == '' || mindegreeField.value == '' || maxdegreeField.value == ""){
        ShowAlert("Nem adtál meg minden adatot!", "alert-danger")
        return
    }

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
        if(res.status == 200){
            typeSelect.value = ''
            dateField.value = ''
            mindegreeField = ''
            maxdegreeField = ''
            ShowAlert(data.msg,"alert-success")
        }
    }
    catch(err){
        console.log("Hiba!", err)
    }
}