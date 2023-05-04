var loadFile = function (event) {
    var output = document.getElementById('output');
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function () {

        URL.revokeObjectURL(output.src) // free memory
    }
};
$(document).ready(function () {
    // Edit Modal Form
    $("#post-edit-form").validate({
        rules: {
            title: {
                required: true
            },
            description: {
                required: true
            }
        },
        messages: {
            title: {
                required: "Please Enter title"
            },
            description: {
                required: "Please enter description"
            }
        }, submitHandler: function (form) {
            const formData = new FormData($(form)[0]);
            // console.log(formData);
            // console.log("clicked");
            const id = $("#hiddenval").val()
            // console.log(id);
            const postId = $(this).attr('data-id');
            // formData.append("file", fileupload.files[0]);
            $.ajax({
                url: `/post/${id}/${postId}`,
                method: 'PUT',
                data: formData,
                enctype: "multipart/form-data",
                contentType: false,
                processData: false,
                // body: formData,
                success: function (response) {
                    // alert(response.message)
                    window.location.reload();
                },
                error: function (err) {
                    alert(err.responseJSON.message)
                }
            })
        }
    })

    // Post create Modal Form
    $("#post-add-form").validate({
        rules: {

            postavatar: {
                required: true
            },
            title: {
                required: true
            },
            description: {
                required: true
            }
        },
        messages: {
            postavatar: {
                required: "This field is required"
            },
            title: {
                required: "Please Enter title"
            },
            description: {
                required: "Please enter description"
            }
        }, submitHandler: function (form) {
            const formData = new FormData($(form)[0]);
            console.log(formData);
            // formData.append("file", fileupload.files[0]);
            $.ajax({
                url: "/post",
                method: 'POST',
                data: formData,
                enctype: "multipart/form-data",
                contentType: false,
                processData: false,
                // body: formData,
                success: function (response) {
                    window.location.reload();
                },
                error: function (err) {
                    alert(err.responseJSON.message)
                }
            })
        }
    })

    // $(".comment").unbind().click(function () {
    //     const postId = $(this).attr("id")
    //     console.log(postId);
    //     // $.ajax({
    //     //     url: `/post/comment?postId=${postId}`,
    //     //     type: 'post',
    //     //     success: function (response) {
    //     //         $('#posts').html(response)
    //     //     },
    //     //     error: function (err) {
    //     //         alert(err.responseJSON.message)
    //     //     }
    //     // })
    // })


    $(".comment").unbind().click(function () {
        const id = $(this).attr('id');
        console.log(id,"clicked");
        $.ajax({
            type: 'GET',
            url: `/post?id=${id}`,
            success: function (response) {
                $("#postId-hidden").replaceWith(`<input type="hidden" id="postId-hidden" name="hiddenval" value="${id}">`)
                $('#commentBody').html(response)
            },
            error: function (err) {
                alert(err.responseJSON.message)
            }
        })
    })


    $("#post-comment-form").validate({
        rules: {
            comment: {
                required: true
            }
        },
        messages: {
            comment: {
                required: "This field is required"
            }
        }, submitHandler: function (form) {
            var $form = $(form)
            $.ajax({
                url: "/post/comment",
                method: 'POST',
                data: $form.serialize(),
                success: function (response) {
                    // alert(response.message)
                },
                error: function (err) {
                    alert(err.responseJSON.message)
                }
            })
        }
    })
    // $(".commnetbutton").unbind().click(function () {
    //     $.ajax({
    //         type: 'post',
    //         url: `/post/comment`,
    //         success: function (response) {

    //         },
    //         error: function (err) {
    //             alert(err.responseJSON.message)
    //         }
    //     })
    // })




})