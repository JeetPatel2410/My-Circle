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

                }
            })
        }
    })

})