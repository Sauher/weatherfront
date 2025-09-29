let theme = "light"
let darkmodeBtn = document.getElementById("darkmodeBtn")
let lightmodeBtn = document.getElementById("lightmodeBtn")
let loggedOutMenu2 = document.getElementById("registeritem")
let loggedOutMenu = document.getElementById("loginitem")
let loggedInMenu2 = document.getElementById("inmenu2")
let loggedInMenu = document.getElementById("inmenu1")
let loggedInMenu3 = document.getElementById("inmenu3")
let loggedInMenu4 = document.getElementById("inmenu4")
let loggedInMenu5 = document.getElementById("inmenu5")

let main = document.querySelector("main")

darkmodeBtn.addEventListener('click', ()=>{
    saveTheme("dark")
    setTheme("dark")
    InitChart("dark")
})
lightmodeBtn.addEventListener('click', ()=>{
    saveTheme("light")
    setTheme("light")
    InitChart("light")
})

function setTheme(theme){
    document.documentElement.setAttribute('data-bs-theme', theme)
    setThemeBtn(theme)
}
function saveTheme(theme){
    localStorage.setItem('pagetheme',theme)
}
function setThemeBtn(theme){
    if(theme == "light"){
        lightmodeBtn.classList.add("hide")
        darkmodeBtn.classList.remove("hide")
    }
    else{
        lightmodeBtn.classList.remove("hide")
        darkmodeBtn.classList.add("hide")
    }
}
function loadTheme(){
    theme = 'light'
    if(localStorage.getItem('pagetheme')){
        theme = localStorage.getItem('pagetheme');
        
    }
    setTheme(theme)
}
async function Render(view){
    main.innerHTML = await(await fetch(`views/${view}.html`)).text()
    switch(view){
        case 'userdata':
            await GetUserData()
            break
        case 'weatherdata':
            await SetDate()
            await loadTable()
            break
        case 'chart':
            await InitChart(theme)
            break
        case 'calendar':
            await getCalendarData()
            await initCalendar()
    }
}
async function getLoggedUser(){
    if(sessionStorage.getItem('loggedUser')){
        loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'))
        loggedOutMenu2.classList.add("hide")
        loggedOutMenu.classList.add("hide")
        loggedInMenu2.classList.remove("hide")
        loggedInMenu.classList.remove("hide")
        loggedInMenu3.classList.remove("hide")
        loggedInMenu4.classList.remove("hide")
        loggedInMenu5.classList.remove("hide")
        await Render('weatherdata')
    }
    else{
        loggedUser = null
        loggedOutMenu2.classList.remove("hide")
        loggedOutMenu.classList.remove("hide")
        loggedInMenu2.classList.add("hide")
        loggedInMenu3.classList.add("hide")
        loggedInMenu4.classList.add("hide")
        loggedInMenu.classList.add("hide")
        loggedInMenu5.classList.add("hide")
        await Render('login')
    }
    return loggedUser
}

loadTheme()
getLoggedUser()
