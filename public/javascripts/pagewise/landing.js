$(document).ready(function () {
    $("#landing-login").unbind().click(function () {
        window.location.href = '/login'
    })
    $("#landing-register").unbind().click(function () {
        window.location.href = '/registration'
    })
   
})