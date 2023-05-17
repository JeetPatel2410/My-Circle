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

    $("#forgot-pwd").click(function () {
        $.ajax({
            type: "get",
            url: '/forgot',
            success: function (response) {
                $("#main-login").html(response)
            },
            error: function (err) {
                alert(err.responseJSON.message);
            }
        })
    })

    $("#forgot-password").validate({
        rules: {
            email: {
                required: true
            }
        },
        messages: {

            email: {
                required: "  Please enter email"
            }
        }, submitHandler: function (form) {
            $form = $(form)
            $.ajax({
                type: "post",
                url: "/forgot",
                data: $form.serialize(),
                success: function (response) {
                    $("#email").val("")
                    $("#main-login").html(response)
                },
                error: function (err) {
                    alert(err.responseJSON.message)
                    window.location.href = "/registration"
                }
            })
        }
    })


    $("#otp-password").validate({
        rules: {
            otpp: {
                required: true
            }
        },
        messages: {
            otpp: {
                required: "  Please enter Otp"
            }
        }, submitHandler: function (form) {
            $form = $(form)
            $.ajax({
                type: "post",
                url: "/otp",
                data: $form.serialize(),
                success: function (response) {
                    // $("#email").val("")
                    $("#main-login").html(response)
                },
                error: function (err) {
                    alert(err.responseJSON.message)
                    $("#otp").val('')
                }
            })
        }
    })

    $("#create-new-password").validate({
        rules: {
            otp: {
                required: true
            }
        },
        messages: {
            otp: {
                required: "Please Enter Otp"
            }
        }, submitHandler: function (form) {
            $form = $(form)
            $.ajax({
                type: "put",
                url: "/password",
                data: $form.serialize(),
                success: function (response) {
                    // $("#email").val("")
                    alert(response.message)
                    window.location.href = "/login"
                    // $("#main-login").html(response)
                },
                error: function (err) {

                }
            })
        }
    })

})