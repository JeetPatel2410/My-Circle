var loadFile = function (event) {
    var output = document.getElementById('output');
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function () {

        URL.revokeObjectURL(output.src) // free memory
    }
};
count = 1;
$(document).ready(function () {


    function geturl() {
        let url = "/timeline/posts"
        const sort = $("#post-sorting").val();
        const filter = $("#show-posts").val();
        const search = $("#search-val").val();
        // const page = $(".common-filter").data("id")
        // console.log(page);

        if (filter) {
            url += `?filter=${filter}`;
        }

        if (sort) {
            url += `&sort=${sort}`;
        }

        if (search) {
            url += `&search=${search}`;
        }

        // if(page){
        //     url += `&page=${page}`;
        // }

        return url

    }


    $(".savebtn").unbind().click(function () {
        const id = $(this).attr('id');
        const postId = $(this).attr('data-id');
        $.ajax({
            type: 'PUT',
            url: `/post/${id}/${postId}`,
            success: function (response) {
                alert(response.message)
                window.location.reload();
                // window.location.href = 'http://localhost:3000'
            },
            error: function (err) {
                alert(err.responseJSON.message)
            }
        })
    })


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
                }
            })
        }
    })

    // $("#mine-post").unbind().click(function () {
    //     // console.log($(this).attr("id"));
    //     console.log(geturl());
    //     // const id = $(this).attr("id")
    //     $.ajax({
    //         url: geturl(),
    //         type: 'get',
    //         success: function (response) {
    //             // console.log(response);
    //             $('#posts').html(response)
    //         },
    //         error: function (err) {
    //             alert(err.responseJSON.message)
    //         }
    //     })

    // })

    // $("#others-post").unbind().click(function () {
    //     console.log($(this).attr("id"));
    //     const id = $(this).attr("id")
    //     $.ajax({
    //         url: geturl(),
    //         type: 'get',
    //         success: function (response) {
    //             // console.log(response);
    //             $('#posts').html(response)
    //         },
    //         error: function (err) {
    //             alert(err.responseJSON.message)
    //         }
    //     })

    // })

    // herererrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr
    $(".common-filter").unbind().change(function () {
        console.log(geturl());
        // console.log($(this).attr("id"));
        // const id = $(this).attr("id");


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

    $(".common-filter").unbind().click(function () {
        console.log(geturl());
        // console.log($(this).attr("id"));
        // const id = $(this).attr("id")
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
                // console.log(response);
                // $("#pagination-list").replaceWith(`<li class="page-item" id="pagination-list"><a class="page-link" href="/timeline?page={{this}}">{{this}}</a></li>`)
                $('#posts').html(response)
            },
            error: function (err) {
                alert(err.responseJSON.message)
            }
        })

    })


    // allll post
    // $("#all-post").unbind().click(function () {
    //     // console.log($(this).attr("id"));
    //     const id = $(this).attr("id")
    //     $.ajax({
    //         url: geturl(),
    //         type: 'get',
    //         success: function (response) {
    //             // console.log(response);
    //             $('#posts').html(response)
    //         },
    //         error: function (err) {
    //             alert(err.responseJSON.message)
    //         }
    //     })

    // })



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
    // $("#search-btn").unbind().click(function () {
    //     // console.log($("#search-val").val());
    //     const id = $("#search-val").val();
    //     $.ajax({
    //         url: `/timeline/filter/${id}`,
    //         type: 'get',
    //         success: function (response) {
    //             $('#posts').html(response)
    //             // window.location.href = 'http://localhost:3000'
    //         },
    //         error: function (err) {
    //             alert(err.responseJSON.message)
    //         }
    //     })

    // })

    // $("#search-val").unbind().keyup(function () {
    //     // console.log($("#search-val").val());
    //     // const id = $("#search-val").val();
    //     console.log(geturl());
    //     // const search = "search"

    //     $.ajax({
    //         url: `${geturl()}search`,
    //         type: 'get',
    //         success: function (response) {
    //             $('#posts').html(response)
    //             // window.location.href = 'http://localhost:3000'
    //         },
    //         error: function (err) {
    //             alert(err.responseJSON.message)
    //         }
    //     })

    // })






    $("#saved-post").unbind().click(function () {
        // console.log("clicked");
        $.ajax({
            type: 'post',
            url: `/post/save`,
            success: function (response) {
                // alert("sucesssss")
                // console.log(response);
                // $("#filter-sort-header").replaceWith("")
                $('#posts').html(response)
                // window.location.reload();
            },
            error: function (err) {
                // alert(err.responseJSON.message)
            }
        })
    })

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
                // window.location.href = 'http://localhost:3000'
            },
            error: function (err) {
                alert(err.responseJSON.message)
            }
        })
    })


    $("#all-users").unbind().click(function () {
        $.ajax({
            type: 'get',
            url: `/user`,
            success: function (response) {
                // alert("sucesssss")
                // console.log(response);
                
                $("#filter-sort-header").replaceWith(`<header class="navbar navbar-expand-md navbar-light sticky-top d-print-none" id="filter-sort-header">
                <div class="container-xl">
                    <button type="button" class="btn btn-dark" id="user-sort-btn">Sort</button>
                    <div class="col">
                  <input type="text" class="form-control" placeholder="Search for…" id="search-user-val" style="width:336px;margin-left:906px">
                </div>
                </div>
                
                
            </header><br>`)
                $('#posts').html(response)
                // window.location.reload();
            },
            error: function (err) {
                // alert(err.responseJSON.message)
            }
        })
    })

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


    $(document).unbind().on('click', "#edit-btn", function () {

        const id = $(this).data('postid');
        // console.log(id);
        $.ajax({
            type: 'GET',
            url: `/post/${id}`,
            success: function (response) {

                // $("#post-edit-form").("#")
                // console.log(response);
                $("#post-edit-form #titlefield").val(response.data.title);
                $("#post-edit-form #description").val(response.data.description);
                $("#post-edit-form #post-image").replaceWith(`<img id="post-image" src="../uploads/${response.data.imageId}" style="height: 200px;width: 200px;" />`);
                $("#post-edit-form #hiddenval").replaceWith(`<input type="hidden" id="hiddenval" name="hiddenval" value="${response.data._id}">`)

                // $('#image').html('<img src="data:image/png;base64,' + img  + '" />');
                // // window.location.href = 'http://localhost:3000'
                $("#edit-post").modal("show")
            },
            error: function (err) {
                alert(err.responseJSON.message)
            }
        })
    })

    // $("#archive-btn").unbind().click(function ()
    $(document).off('click', "#archive-btn").on('click', "#archive-btn", function () {
        // $("#archive-btn").click(function () {
        console.log("clicked++++++======+++++");
        const x = "a"
        const id = $(this).data('postid');
        // console.log(id);
        $.ajax({
            type: 'PUT',
            url: `/post/${id}/${id + x}`,
            success: function (response) {
                window.location.reload();
            },
            error: function (err) {
                alert(err.responseJSON.message)
            }
        })
    })
    // $(".user-sort-btn").click(function ()
    // 

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

    $("#report").unbind().click(function () {
        console.log("clicked");
        $.ajax({
            url: "/report",
            type: 'get',
            success: function (response) {
                console.log(response);
            },
            error: function (err) {
                alert(err.responseJSON.message)
            }
        })

    })
})