$(document).ready(function(){
    if(localStorage.username != undefined){
        var user = localStorage.username;
        loginUpdate(user, true);
    }
    var loginStatus = $(".login").html();
    $(document).on( "click", '.login', function() {
        if( loginStatus == "Logout"){
            loginUpdate(user, false);
            location.assign("index.html");
        }else if( loginStatus == "Login"){
            location.assign("login.html");
        }
    });
    
    if(loginStatus == "Logout"){
        var cartArray = [];
        var x = (localStorage.getItem("currentCart"));
        if(x == "" || x == "[]"){ 
            cartContent(["empty"]);
        } else{
            cartArray = JSON.parse(localStorage.getItem("currentCart"));
            cartContent(cartArray);
        }
        updateCartIndex();
        $(document).on( "click", '.add-to-cart', function() {
            var keyItem = $(this).attr("data-productID");
            addToCart(keyItem, cartArray);
            event.preventDefault();
        });
        $(".glyphicon-cart-modified, .go-to-cart").css("color", "#646").click( function(){
            location.assign("cart.html");
        });
        $('body').on({
            mouseenter: function() {
                $(".glyphicon-cart-modified").css("background","white");
                $(".hover-cart").addClass("hover-cart-displayed");
            },
            mouseleave: function() {
                $(".glyphicon-cart-modified").css("background","none");
                $(".hover-cart").removeClass("hover-cart-displayed");
        }   }, '.glyphicon-cart-modified, .hover-cart');
    } else{
        $(".glyphicon-cart-modified, .add-to-cart, .go-to-cart").click( function(){
            $("#loginAlert").modal();
            event.preventDefault();
        });
        
    }
    $(document).on( "click", '.remove-from-cart', function() {
        var keyItem = $(this).attr("data-productID");
        removeFromCart(keyItem, cartArray);
        event.preventDefault();
    });  
    
    $(document).on( "click", '.glyphicon-minus-sign', function() {
        setQuantity("minus", this);
    }); 
    $(document).on( "click", '.glyphicon-plus-sign', function() {
        setQuantity("plus", this);
    }); 
});
                  
function cartContent(newArray){
        var temp = newArray;
        var string = "";
        if(temp[0]!="empty"){
            $.each(temp, function(i){
                var param = temp[i].split("-");
                var categoryParam = param[0];
                var index = (param[1]-1);
                var data = productItems[categoryParam]; 

                string += '<tr>'+
                            '<td><a href="productdetail.html?productID=' + data[index].productID + '">'+
                                '<img src="../assets/images/' + data[index].imageSRC + '" class="img-thumbnail" alt="' + data[index].productName + '" style="width:100px">'+
                            '</a></td>'+
                            '<td>'+
                                '<h4><a href="productdetail.html?productID=' + data[index].productID + '">' + data[index].productName + '</a></h4>'+
                                '<div> Price: Rs.' + data[index].price + '</div>'+
                            '</td>'+
                            '<td>'+
                                '<span class="glyphicon glyphicon-minus-sign cart-glyphicon"></span>'+
                                '<span class="quantity" data-price="'+ data[index].price +'">1</span>'+
                                '<span class="glyphicon glyphicon-plus-sign cart-glyphicon"></span>'+
                            '</td>'+
                            '<td>Rs. <span class="total-price">'+ data[index].price +'</span></td>'+
                            '<td><button type="button" class="btn btn-danger remove-from-cart" data-productID="'+ data[index].productID +'">Remove<span class="glyphicon glyphicon glyphicon-remove cart-glyphicon"></span></button></td>'+
                        '</tr>';
            });
        } else if(temp[0]=="empty"){
            string += '<tr><td colspan="5">'+
                                '<div class="alert alert-danger">'+
                                        '<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+
                                        '<strong> No items in cart!</strong>'+
                                '</div>'+
                      '</td></tr>';
        }
        $(".cart-content").html(string);
}

function addToCart(productID, cartArray){
    var param = productID.split("-");
    var categoryParam = param[0];
    var index = (param[1]-1);
    var data = productItems[categoryParam]; 

    var successString = '<div class="alert alert-success">'+
                                '<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+
                                '<strong>"'+ data[index].productName +'" successfully added to cart </strong>'+
                        '</div>';
    var dangerString = '<div class="alert alert-warning">'+
                                '<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+
                                '<strong>"'+ data[index].productName +'" already in the cart </strong>'+
                        '</div>';
    var cartArray = JSON.parse(localStorage.getItem("currentCart"));
    if(cartArray.indexOf(productID) == -1){
        var index = cartArray.length;
        cartArray[index] = productID;
        localStorage.setItem("currentCart", JSON.stringify(cartArray));
        localStorage.setItem("cart-number", cartArray.length);
        $(".addCartMessage").html(successString);
        updateCartIndex();
    }
    else{
        $(".addCartMessage").html(dangerString);
    }
}

function removeFromCart(productID, cartArray){  
    var cartArray = JSON.parse(localStorage.getItem("currentCart"));
    if(cartArray.indexOf(productID) >= 0){
        var index = cartArray.indexOf(productID);
        cartArray.splice(index, 1);
        if(cartArray.length!=0){
            cartContent(cartArray);
        } else{
            cartContent(["empty"]);
        }
        localStorage.setItem("currentCart", JSON.stringify(cartArray));
        localStorage.setItem("cart-number", cartArray.length);
        updateCartIndex();
    }
    else{  
        alert("No such item in the cart!");
    }   
}

function updateCartIndex(){
    var count =  localStorage.getItem("cart-number");
    if(count==null){
        count = 0;
    }
    $("#cart-counter").css("display","block").html(count);
}

function setQuantity(sign, element){
    if(sign=="plus"){
        var quantity = $(element).prev().html();
        var price = $(element).prev().attr("data-price");
        quantity++;
        $(element).prev().html(quantity);
        var totalPrice = quantity*price;
        $(element).parent().next().children("span").html(totalPrice);
        if (quantity>0){ $("#cartError").html("");}
        console.log(price);
    }else if(sign=="minus"){
        var quantity = $(element).next().html();
        var price = $(element).next().attr("data-price");
        if (quantity==1){ 
            $("#cartError").html('<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong> Quantity can not be less than ONE ! </strong></div>');
        }else{
            quantity--;
            $(element).next().html(quantity);
            var totalPrice = quantity*price;
            $(element).parent().next().children("span").html(totalPrice);
            console.log( quantity  + " " + price + " " + totalPrice);
        }
    }
}
function loginUpdate(user, key){
    if(key==true){
        $(".login").html("Logout");
        $("#userSpan").html("Hello "+ user);
    }
    else{
        localStorage.removeItem("username");
        localStorage.removeItem("currentCart");
        $("#userSpan").html("");
        $(".glyphicon-cart-modified").css("color", "black");
        $(".login").html("Login");
    }
}