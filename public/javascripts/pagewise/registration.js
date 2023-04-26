$(document).ready(function () {
    // console.log("=====++++++++++++++++++");
    $(".submit-btn").submit(function (e) {
        console.log("=====")
        e.preventDefault();
    })

    $("#save-user").validate({
        rules: {
            firstname: {
                required: true
            },
            lastname: {
                required: true
            },
            email: {
                required: true,
                remote:"/email"
            },
            gender: {
                required: true
            },
            password: {
                required: true
            },
            confirmpassword: {
                required: true,
                equalTo: "#password"
            }
        },
        messages: {
            firstname: {
                required: "  Please enter first Name"
            },
            lastname: {
                required: "  Please enter last name"
            },
            email: {
                required: "  Please enter email",
                remote:"Email already exists !"
            },
            gender: {
                required: "Please "
            },
            password: {
                required: "  Please set password"
            },
            confirmpassword: {
                required: "  Please confirm password"
            },
        }, submitHandler: function (form) {
            var $form = $(form)
            $.ajax({
                url: "/save",
                type: 'POST',
                data: $form.serialize(),
                // data:{
                //     fname:$("#fname").val().trim(),
                //     lname:$("#lname").val().trim(),
                //     password:$("#password").val().trim(),
                //     repassword:$("#repassword").val().trim(),
                // },
                success: function (response) {
                    alert(response.message)
                    window.location.href = 'http://localhost:3000/'
                },
                error: function (err) {
                    alert(err.responseJSON.message)
                }
            })
        }
    })
})