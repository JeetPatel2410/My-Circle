var loadFile = function (event) {
    var output = document.getElementById('output');
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function () {

        URL.revokeObjectURL(output.src) // free memory
    }
};
count = 1;
$(document).ready(function () {

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
    $(".savebtn").unbind().click(function () {
        const id = $(this).attr('id');
        const postId = $(this).attr('data-id');
        $.ajax({
            type: 'PUT',
            url: `/post/${id}/${postId}`,
            success: function (response) {
                alert(response.message)
                window.location.reload();
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

    // Unsave Button
    $(".unsavebtn").unbind().click(function () {
        console.log("clicked");
        const id = $(this).attr('id');
        const postId = $(this).attr('data-id');
        $.ajax({
            type: 'PUT',
            url: `/post/${id}/${postId}`,
            success: function (response) {
                alert(response.message)
                window.location.reload();
            },
            error: function (err) {
                alert(err.responseJSON.message)
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
            url: `/post/${id}`,
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
                // alert("sucesssss")
                // console.log(response);
                // $("#filter-sort-header").remove()

                $('#posts').html(response)
                // window.location.reload();
            },
            error: function (err) {
                // alert(err.responseJSON.message)
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
                window.location.reload();
            },
            error: function (err) {
                alert(err.responseJSON.message)
            }
        })
    })

    // like-posyt-list
    $(".liked-post").unbind().mouseenter(function () {
        const likeId = $(this).attr("id")
        console.log(likeId);
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
})