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
        ShowAlert("Sikeres belépés!","alert-success")
        user = await res.json()

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
    }
    if(!passRegExp.test(pass.value)){
        ShowAlert("A megadott jelszó nem elég biztonságos!","alert-danger")
    }
    if(!emailRegExp.test(emaildat.value)){
        ShowAlert("A megadott email cím nem megfelelő formátumú!", "alert-danger")
    }
    if(pass.value != confirmpass.value){
        ShowAlert("A megadott jelszavak nem egyeznek!", "alert-danger")
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