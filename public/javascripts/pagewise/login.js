$(document).ready(function () {
    // console.log("=====++++++++++++++++++");
    $(".submit-btn").submit(function (e) {
        // console.log("=====")
        e.preventDefault();
    })

    $("#login").validate({
        rules: {

            email: {
                required: true
            },
            password: {
                required: true
            }
        },
        messages: {

            email: {
                required: "  Please enter email"
            },
            password: {
                required: "  Please enter password"
            },
        }, submitHandler: function (form) {
         //   alert("Submitted!");
        //    $('.submit-btn').attr('disabled', 'disabled');
            form.submit();
        
        }
    })
})