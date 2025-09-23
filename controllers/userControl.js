const passRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const API = 'http://localhost:3000'



async function Login() {
    let pass = document.getElementById("passField").value
    let email = document.getElementById("emailField").value

    if(email == "" || pass == ""){
        ShowAlert("Nem adtál meg minden adatot!", "alert-danger")
        return
    }
    let user = {}
    try{
        const res = await fetch(`${API}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
    
            },
            body: JSON.stringify({
                email: email,
                password: pass
            })
        })
       
        user = await res.json()
        ShowAlert("Sikeres belépés!","alert-success")
        if(user.id != undefined){
            loggedUser = user;

        }
        
        
        if(!loggedUser){
            ShowAlert("Hibás belépési adatok!", "alert-danger")
            return
        }
       
        sessionStorage.setItem('loggedUser', JSON.stringify(loggedUser))
        await Render("weatherdata")
        getLoggedUser()
       
    }
    catch(err){
        console.log("Hiba!", err)
    }
    

}
async function Register() {
    let pass = document.getElementById("passField")
    let confirmpass = document.getElementById("confirmpassField")
    let name = document.getElementById("nameField")
    let emaildat = document.getElementById("emailField")

    if(pass.value == '' || name.value == '' || emaildat.value == '' || confirmpass.value == ""){
        ShowAlert("Nem adtál meg minden információt!", "alert-danger")
        return
    }
    if(!passRegExp.test(pass.value)){
        ShowAlert("A megadott jelszó nem elég biztonságos!","alert-danger")
        return
    }
    if(!emailRegExp.test(emaildat.value)){
        ShowAlert("A megadott email cím nem megfelelő formátumú!", "alert-danger")
        return
    }
    if(pass.value != confirmpass.value){
        ShowAlert("A megadott jelszavak nem egyeznek!", "alert-danger")
        return
    }

    try {
        const res = await fetch(`${API}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
    
            },
            body: JSON.stringify({
                id: 0,
                name: name.value,
                email: emaildat.value,
                password: pass.value
            })
        })
        const data = await res.json()
        if(String(data.msg)== "bademail"){
            ShowAlert("A megadott email cím már foglalt","alert-danger")
        }
        if(res.status == 200){
            pass.value = ''
            confirmpass.value = ''
            emaildat.value = ''
            name.value = ''
            ShowAlert(data.msg,"alert-success")
        }
        


    } catch (err) {
        console.log("Hiba!", err)
    }

}
function Logout(){
    sessionStorage.removeItem('loggedUser')
    getLoggedUser()
    Render('login')
}
async function GetUserData(){
    let name = document.getElementById("nameField")
    let emaildat = document.getElementById("emailField")

    try{
        const res = await fetch(`${API}/users/${loggedUser.id}`)
        const data = await res.json()

        name.value = data.name
        emaildat.value = data.email
    }
    catch(err){
        console.log("Hiba!", err)
    }
}

async function UpdateUser(){
    let name = document.getElementById("nameField")
    let emaildat = document.getElementById("emailField")

    if(!emailRegExp.test(emaildat.value)){
        ShowAlert("A megadott email cím nem megfelelő formátumú!", "alert-danger")
        return
    }
    try{
        const res = await fetch(`${API}/users/${loggedUser.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
    
            },
            body: JSON.stringify({
                id: loggedUser.id,
                name: name.value,
                email: String(emaildat.value),
            })
        })


        const data = await res.json()

        if(String(data.msg) == "bademail"){
            ShowAlert("A megadott email cím már foglalt!","alert-danger")
            return
        }
        if(res.status == 200){
            ShowAlert(data.msg,"alert-success")
        }

    }
    catch(err){
        console.log("Hiba!", err)
    }
    
}
async function UpdatePassword(){
    let oldpass = document.getElementById("oldpassField")
    let newpass = document.getElementById("newpassField")
    let confirmpass = document.getElementById("confirmpassField")

    if(oldpass.value == '' || newpass.value == '' || confirmpass.value == ""){
        ShowAlert("Nem adtál meg minden információt!", "alert-danger")
        return
    }
    if(!passRegExp.test(newpass.value)){
        ShowAlert("A megadott jelszó nem elég biztonságos!","alert-danger")
        return
    }
    if(newpass.value != confirmpass.value){
        ShowAlert("A megadott jelszavak nem egyeznek!", "alert-danger")
        return
    }
    if(oldpass.value != loggedUser.password){
        ShowAlert("A régi jelszavad nem egyezik!", "alert-danger")
        return
    }
    try{
    const res = await fetch(`${API}/users/${loggedUser.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'

        },
        body: JSON.stringify({
            id: loggedUser.id,
            password: newpass.value
        })
    })



    const data = await res.json()
    if(res.status == 200){
        ShowAlert(data.msg,"alert-success")
        confirmpass.value = ''
        oldpass.value = ''
        newpass.value = ''
    }}
    catch(err){
        console.log("Hiba!", err)
    }
}

function ShowAlert(msg , msg_type){
    let alertDiv = document.getElementById("alertDiv")
    alertDiv.classList.remove("hide")
    alertDiv.classList.add(msg_type)
    alertDiv.innerText = msg

    setTimeout(()=>{
        alertDiv.classList.add("hide")
        alertDiv.classList.remove(msg_type)
        alertDiv.innerText = ''
    }, 3000)
}