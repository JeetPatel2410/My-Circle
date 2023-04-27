$(document).ready(function () {
    // console.log("=====++++++++++++++++++");
    $(".submit-btn").submit(function (e) {
        console.log("=====")
        e.preventDefault();
    })

    
    $("#email-validation").hide()
    $("#email").keyup(function () {
        var VAL = this.value;
        var emailregex = new RegExp(/^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/);
        if (!emailregex.test(VAL)) {
            $("#email-validation").show();
        }
        if (emailregex.test(VAL)) {
            $("#email-validation").hide();
        }
    });

    $("#password-validation").hide()
    $("#password").keyup(function () {
        var VAL = this.value;
        var password = new RegExp(/^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,15}$/);
        if (!password.test(VAL)) {
            $("#password-validation").show();
        }
        if (password.test(VAL)) {
            $("#password-validation").hide();
        }
    });

    // User Registraion    
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
                remote: "/email"
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
                remote: "Email already exists !"
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