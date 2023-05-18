$(document).ready(function () {

    $(".spec-user").unbind().click(function () {
        // console.log($(this).attr("id"), "clicked user chatatatatatatataattaatatataat");
        const specId = $(this).attr("id");
        $.ajax({
            type: "post",
            url: `/chat/details?specId=${specId}`,
            success: function (response) {
                $("#filter-sort-header").hide()
                $('#chat-box').html(response)
                $(`#count-${specId}`).replaceWith(`<span id=count-${specId}></span>`)
            },
            error: function (err) {
                console.log(err);
            }
        })
    })
    // $(".send").unbind().click(function ()

    $(document).on("click", ".send", function () {
        // console.log($("#message-info").val(), "message");
        const message = $("#message-info").val();
        const receiveBy = $(this).attr("id");
        // console.log($(this).attr("id"),"send click");
        $.ajax({
            type: "post",
            url: `/chat/message/`,
            data: { message: message, receiveBy: receiveBy },
            success: function (response) {
                console.log("send clickckckckckckc");
                $("#message-info").val("");
                // $("#chat-messages").append(`<div class="card bg-primary" style="width:300px;height:40px;margin-left:753px;">${message}</div>`)
                $("#chat-messages").append(`<div class="bg-primary mt-2 p-3 rounded mb-2" style="max-width:500px;clear:both;float:right">${message}</div>`)
            },
            error: function (err) {
                console.log(err);
            }
        })
    })

    $(document).on("keyup", "#message-info", function (event) {
        if (event.keyCode === 13) {
            const message = $("#message-info").val();
            const receiveBy = $(".send").attr("id");
            $.ajax({
                type: "post",
                url: `/chat/message/`,
                data: { message: message, receiveBy: receiveBy },
                success: function (response) {
                    console.log("send clickckckckckckc");
                    $("#message-info").val("");
                    // $("#chat-messages").append(`<div class="card" style="width:300px;height:40px;margin-left:753px;">${message}</div>`)
                    $("#chat-messages").append(`<div class="bg-primary mt-2 p-3 rounded mb-2" style="max-width:500px;clear:both;float:right">${message}</div>`)

                },
                error: function (err) {
                    console.log(err);
                }
            })
        }
    })

})

// var socket = io({
//     query: {
//         userId: $("#user-id-hidden").val()
//     }
// });

let count = 0;
socket.on("chat", (arg) => {
    // console.log(arg,"argaragaragarag");
    // console.log($(".send").attr("id") === arg.sendBy,"chatboxcheckinggg");
    if ($(".send").attr("id") === arg.sendBy) {
        // $("#chat-messages").append(`<div class="card bg-success" style="width:300px;height:40px;">${arg.message}</div>`)
        $("#chat-messages").append(`<div class="bg-green mt-2 p-3 rounded" style="max-width:500px;clear:both;float:left">${arg.message}</div>`)
        

    } else {
        console.log(arg, "elseeee");
        count++;
        // console.log($(`#count-${arg.sendBy}`),"isidchecking");
        $(`#count-${arg.sendBy}`).replaceWith(`<span class="countNotification badge bg-red" id =count-${arg.sendBy}>${count}</span>`)
    }
})

