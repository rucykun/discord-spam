
$(function () {
    $('#btn').click(function () {
        var token = $('#token').val();
        var channelid = $('#channelid').val();
        var content = $('#content').val();
        var delay = $('#delay').val();
        if (token == null || token == "", channelid == null || channelid == "", content == null || content == "") {
            alert("すべてのオプションに入力してください。");
            return false;
        }

        let i = 0;
        let inteval = setInterval(function () {
            $.post(token, { "delay": delay, "content": content, "channelid": channelid, });
            time.sleep(delay)

    
      
        }, 50)



    });
});
