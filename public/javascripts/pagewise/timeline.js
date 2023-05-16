var loadFile = function (event) {
    var output = document.getElementById('output');
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function () {
        URL.revokeObjectURL(output.src) // free memory
    }
};

// count = 1;
$(document).ready(function () {

    toastr.options = {
        "closeButton": true,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }

    // Function() Create Coman URL
    function geturl() {
        let url = "/timeline/posts"
        const sort = $("#post-sorting").val();
        const filter = $("#show-posts").val();
        const search = $("#search-val").val();

        if (filter) {
            url += `?filter=${filter}`;
        }

        if (sort) {
            url += `&sort=${sort}`;
        }

        if (search) {
            url += `&search=${search}`;
        }

        return url
    }

    // Save Post
    $('body').on("click", ".savebtn", function () {
        console.log("clicked");
        const id = $(this).attr('id');
        const postId = $(this).attr('data-id');
        console.log(id, "id");
        console.log(postId, "postid");
        $.ajax({
            type: 'PUT',
            url: `/post/${id}/${postId}`,
            success: function (response) {
                alert(response.message)
                // window.location.reload();
                $(`#unsavebtn-${postId}`).replaceWith(`<div class="d-flex justify-content-end" id=savebtn-${postId}>
            <svg id=${id} data-id=${postId} xmlns="http://www.w3.org/2000/svg"
              style="margin-top: -74px;margin-right: 31px;" class="unsavebtn icon icon-tabler icon-tabler-bookmark"
              width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
              stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M9 4h6a2 2 0 0 1 2 2v14l-5 -3l-5 3v-14a2 2 0 0 1 2 -2"></path>
            </svg>
          </div>`)

                if (response.status == 203) {
                    $(`#savebtn-${postId}`).replaceWith(`<div class="d-flex justify-content-end" id=unsavebtn-${postId}>
        <svg id=${id} data-id=${postId} style="margin-top: -74px;margin-right: 31px;"
          xmlns="http://www.w3.org/2000/svg" class="savebtn icon icon-tabler icon-tabler-bookmark-off" width="24"
          height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
          stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M3 3l18 18"></path>
          <path d="M17 17v3l-5 -3l-5 3v-13m1.178 -2.818c.252 -.113 .53 -.176 .822 -.176h6a2 2 0 0 1 2 2v7"></path>
        </svg>
      </div>`)
                }
            },
            error: function (err) {
                alert(err.responseJSON.message)
            }
        })
    })


    // Unsave Button
    $('body').on("click", ".unsavebtn", function () {
        console.log("clicked");
        const id = $(this).attr('id');
        const postId = $(this).attr('data-id');
        $.ajax({
            type: 'PUT',
            url: `/post/${id}/${postId}`,
            success: function (response) {
                alert(response.message)
                // window.location.reload();
                $(`#savebtn-${postId}`).replaceWith(`<div class="d-flex justify-content-end" id=unsavebtn-${postId}>
                <svg id=${id} data-id=${postId} style="margin-top: -74px;margin-right: 31px;"
                  xmlns="http://www.w3.org/2000/svg" class="savebtn icon icon-tabler icon-tabler-bookmark-off" width="24"
                  height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                  stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M3 3l18 18"></path>
                  <path d="M17 17v3l-5 -3l-5 3v-13m1.178 -2.818c.252 -.113 .53 -.176 .822 -.176h6a2 2 0 0 1 2 2v7"></path>
                </svg>
              </div>`)
            },
            error: function (err) {
                alert(err.responseJSON.message)
            }
        })
    })


    // Edit Profile
    $("#user-update-form").validate({
        rules: {
            fname: {
                required: true
            },
            lname: {
                required: true
            }
        },
        messages: {
            fname: {
                required: "Please Enter Fname"
            },
            lname: {
                required: "Please enter lname"
            }
        }, submitHandler: function (form) {
            const formData = new FormData($(form)[0]);
            $.ajax({
                url: "/user",
                method: 'PUT',
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
                    // console.log(err.responseJSON);
                }
            })
        }
    })

    // Filter & Sorting Post
    $(".common-filter").unbind().change(function () {
        console.log(geturl());
        $.ajax({
            url: geturl(),
            type: 'get',
            success: function (response) {
                $('#posts').html(response)
            },
            error: function (err) {
                alert(err.responseJSON.message)
            }
        })

    })

    // Searching
    $(".common-filter").unbind().click(function () {
        console.log(geturl());
        $.ajax({
            url: geturl(),
            type: 'get',
            success: function (response) {
                $('#posts').html(response)
            },
            error: function (err) {
                alert(err.responseJSON.message)
            }
        })

    })

    // Paggination with commna URL
    $(".common-filter").unbind().click(function () {
        console.log($(this).data("id"));
        let page = $(this).data("id")
        if (page == undefined) {
            page = "1"
        }
        let url = geturl();
        url += `&page=${page}`;
        $.ajax({
            url: url,
            type: 'get',
            success: function (response) {
                $('#posts').html(response)
            },
            error: function (err) {
                alert(err.responseJSON.message)
            }
        })

    })

    //  Logout
    $("#logout").click(function () {
        $.ajax({
            url: `/logout`,
            type: 'get',
            success: function (response) {

                window.location.href = 'http://localhost:3000'
            },
            error: function (err) {
                alert(err.responseJSON.message)
            }
        })

    })

    // Show Saved Post
    $("#saved-post").unbind().click(function () {
        $.ajax({
            type: 'post',
            url: `/post/save`,
            success: function (response) {
                $("#filter-sort-header").hide()
                $('#posts').html(response)
            },
            error: function (err) {
            }
        })
    })



    //Show Users
    $("#all-users").unbind().click(function () {
        $.ajax({
            type: 'get',
            url: `/user`,
            success: function (response) {
                $(".searchbar").hide()
                $("#filter-sort-header").replaceWith(`<header class="navbar navbar-expand-md navbar-light sticky-top d-print-none" id="filter-sort-header">
                <div class="container-xl">
                    <button type="button" class="btn btn-dark" id="user-sort-btn">Sort</button>
                    <div class="col">
                  <input type="text" class="form-control" placeholder="Search for…" id="search-user-val" style="width:336px;margin-left:906px">
                </div>
                </div>
            </header><br>`)
                $('#posts').html(response)
            },
            error: function (err) {
            }
        })
    })

    // Search User
    $("#search-user-val").unbind().keyup(function () {
        console.log($(this).val());
        $.ajax({
            type: 'get',
            url: `/user/search?search=${$(this).val()}`,
            success: function (response) {
                $('#posts').html(response)
            },
            error: function (err) {
                alert(err.responseJSON.message)
            }
        })
    })

    // Edit Post
    $(document).unbind().on('click', "#edit-btn", function () {
        const id = $(this).data('postid');
        $.ajax({
            type: 'GET',
            url: `/post/edit?id=${id}`,
            success: function (response) {
                $("#post-edit-form #titlefield").val(response.data.title);
                $("#post-edit-form #description").val(response.data.description);
                $("#post-edit-form #post-image").replaceWith(`<img id="post-image" src="../uploads/${response.data.imageId}" style="height: 200px;width: 200px;" />`);
                $("#post-edit-form #hiddenval").replaceWith(`<input type="hidden" id="hiddenval" name="hiddenval" value="${response.data._id}">`)
                $("#edit-post").modal("show")
            },
            error: function (err) {
                alert(err.responseJSON.message)
            }
        })
    })

    // Archiev Btn
    $(document).off('click', "#archive-btn").on('click', "#archive-btn", function () {
        // $("#archive-btn").click(function () {
        console.log("clicked++++++======+++++");
        const x = "a"
        const id = $(this).data('postid');
        let archiev = $(this)
        // console.log(id);
        $.ajax({
            type: 'PUT',
            url: `/post/${id}/${id + x}`,
            success: function (response) {
                archiev.closest(".card").remove();
                // window.location.reload();
            },
            error: function (err) {
                alert(err.responseJSON.message)
            }
        })
    })

    // Sort User
    $(document).off('click', "#user-sort-btn").on('click', "#user-sort-btn", function () {
        console.log("clickedddddd=========+++++");
        count++;
        console.log(count);
        let type = "dessendig";
        if (count % 2 == 0) {
            type = "assending"
        }
        $.ajax({
            type: 'get',
            url: `/user/sort/${type}`,
            success: function (response) {
                $('#posts').html(response)
            },
            error: function (err) {
                alert(err.responseJSON.message)
            }
        })
    })

    // Report
    // $("#report").unbind().click(function () {
    //     console.log("clicked");
    //     $.ajax({
    //         url: "/report",
    //         type: 'get',
    //         success: function (response) {
    //             $('#posts').html(response)
    //         },
    //         error: function (err) {
    //             alert(err.responseJSON.message)
    //         }
    //     })
    // })

    $("#report").unbind().click(function () {
        console.log("clicked");
        $.ajax({
            url: "/report",
            type: 'get',
            success: function (response) {
                $("#filter-sort-header").hide()
                $('#posts').html(response)
            },
            error: function (err) {
                alert(err.responseJSON.message)
            }
        })
    })

    // paggination saved post
    $(".save-post-page").unbind().click(function () {
        const page = $(this).data("id")
        $.ajax({
            url: `/post/save?page=${page}`,
            type: 'post',
            success: function (response) {
                $('#posts').html(response)
            },
            error: function (err) {
                alert(err.responseJSON.message)
            }
        })
    })

    //Like - btn
    $(".like-btn").unbind().dblclick(function () {
        const id = $(this).attr("id")
        $.ajax({
            url: `/post/like?postId=${id}`,
            type: 'post',
            success: function (response) {
                // alert(response.message)
                // console.log(response);
                // console.log(response.status);
                if (response.status == 202) {
                    $(`.${id}`).replaceWith(`<div class="${id} d-flex justify-content-end">
                    <svg xmlns="http://www.w3.org/2000/svg" class="liked-post icon icon-filled text-red" width="24" height="24"
                    viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                    stroke-linejoin="round" style="margin-top: -74px;margin-right: 81px;" id="{{_id}}">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"></path>
                    </svg>
                    </div>`)
                }
                if (response.status == 201) {
                    $(`.${id}`).replaceWith(`<div class="${id} d-flex justify-content-end">
                    <svg xmlns="http://www.w3.org/2000/svg" class="liked-post icon" width="24" height="24" viewBox="0 0 24 24"
                      stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"
                      style="margin-top: -74px;margin-right: 81px;" id="{{_id}}">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                      <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"></path>
                    </svg>
                  </div>`)
                }
                $(`#like-${id}`).replaceWith(`<div class="d-flex justify-content-end" id="like-${id}">
                <p style="margin-top: -73px;margin-right: 107px;">${response.likeCount}</p>
              </div>`)
                // window.location.reload();
            },
            error: function (err) {
                alert(err.responseJSON.message)
            }
        })
    })

    // like-post-list
    $(".liked-post").unbind().click(function () {
        const likeId = $(this).attr("id")
        $.ajax({
            url: `?likeId=${likeId}`,
            type: 'get',
            success: function (response) {
                $(`.${likeId}`).css({ "display": "block" });
                // window.location.reload();
            },
            error: function (err) {
                alert(err.responseJSON.message)
            }
        })
    })

    // Home btn
    $("#homebtn").unbind().click(function () {
        $.ajax({
            url: `/timeline`,
            type: 'get',
            success: function (response) {
                $('#main-page').html(response)
            },
            error: function (err) {
                alert(err.responseJSON.message)
            }
        })
    })

    //Notification 
    $(".notification").click(function(){
        const id = $(this).attr("id");
        $(`#${id}`).remove()
        console.log($(this).attr("id"),"Notification Clicked");  
        
        $.ajax({
            url: `/user/notification?notifcation=${id}`,
            type: 'get',
            success: function (response) {
                // $('#main-page').html(response)
            },
            error: function (err) {
                alert(err.responseJSON.message)
            }
        })
    })

})

var socket = io("http://localhost:3000", {
    query: {
        userId: $("#user-id-hidden").val()
    }
});

socket.on("hello", (arg) => {
    console.log(arg);
})


// io.on("connection", function (socket) {
//     conso    le.log("jffvifkvnlomfvfvofv");
//     socket.to("someroom").emit("some event");
// });

socket.on("postlike", (arg) => {
    // alert(arg);
    const previousNotificationCount = parseInt($(".countNotification").text() || 0);
    $(".countNotification").text(previousNotificationCount + 1);
    toastr.success(arg)
})


socket.on("postdislike", (arg) => {
    // alert(arg);
    const previousNotificationCount = parseInt($(".countNotification").text() || 0);
    $(".countNotification").text(previousNotificationCount - 1);
    // toastr.success(arg)
})