var loadFile = function (event) {
    var output = document.getElementById('output');
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function () {

        URL.revokeObjectURL(output.src) // free memory
    }
};
$(document).ready(function () {
    // $(".submitbtn").click(function (event) {
    //     event.preventDefault();
    // })
    // $(".editbutton").unbind().click(function(){
    //     const id = $(this).attr('id');
    //     $.ajax({
    //         url: `/post/${id}`,
    //         type: 'PUT',
    //         success: function (response) {
    //             alert(response.message)
    //             // window.location.href = 'http://localhost:3000'
    //         },
    //         error: function (err) {
    //             alert(err.responseJSON.message)
    //         }
    //     })
    // })
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
})