$(document).ready(function () {
    $(".spec-user").click(function () {
        // console.log($(this).attr("id"), "clicked user chatatatatatatataattaatatataat");
        const specId = $(this).attr("id");
        $.ajax({
            url: `/chat/details?specId=${specId}`,
            method: "post",
            success: function (response) {
                $('#chat-box').html(response)
            },
            error: function (err) {
                console.log(err);
            }
        })
    })

    $(".send").unbind().click(function () {
        // console.log($("#message-info").val());
        const message = $("#message-info").val();
        const receiveBy = $(this).attr("id");
        // console.log($(this).attr("id"),"send click");
        $.ajax({
            url: `/chat/message?message=${message}&receiveBy=${receiveBy}`,
            method: "post",
            success: function (response) {
                $("#message-info").val("");
                $("#chat-messages").append(`<div class="card" style="width:300px;height:40px;margin-left:753px;">${message}</div>`)
                
            },
            error: function (err) {
                console.log(err);
            }
        })
    })

})

var socket = io({
    query: {
        userId: $("#user-id-hidden").val()
    }
});



socket.on("chat", (arg) => {
    $("#chat-messages").append(`<div class="card" style="width:300px;height:40px;">${arg}</div>`)
})