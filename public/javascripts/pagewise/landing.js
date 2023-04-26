$(document).ready(function () {
    $("#landing-login").unbind().click(function () {
        window.location.href = 'http://localhost:3000/login'
    })
    $("#landing-register").unbind().click(function () {
        window.location.href = 'http://localhost:3000/registration'
    })
   
})