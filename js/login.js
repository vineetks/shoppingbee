$(document).ready(function(){
    $(".modified-container").css("height", $(window).height());
    $("#loginSubmit").click( function(){
        var username = $("#username").val();
        var password = $("#password").val();
        checkLogin(username, password);
    });
    function checkLogin(username, password){
        var data = credentials[username];
        if(typeof(data)=="undefined"){
            $("#username").css("border-color","red").next().css("display","block");
        }else if(data[0].password != password){
            $("#password").css("border-color","red").next().css("display","block");;
            $("#username").css("border-color","black").next().css("display","none");
        }else{ 
            localStorage.setItem("username", username);
            var userdata = credentials[username];
            if(typeof(userdata)!="undefined"){
                var temp = userdata[0].cart;
                var index = temp.length;
                localStorage.setItem("currentCart", JSON.stringify(temp));
                localStorage.setItem("cart-number", index);
            }
            location.assign("index.html");
        }      
    }
});