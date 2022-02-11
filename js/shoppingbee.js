$(document).ready(function(){
    var navigation = $('#navigation');
    var pos = navigation.offset();
    $(window).scroll(function(){
        if($(this).scrollTop() > pos.top){
            $("#navigation").addClass("affix");
            $("#product-nav").addClass("fixed-product-nav");
         } 
        else{
            $("#navigation").removeClass("affix");
            $("#product-nav").removeClass("fixed-product-nav");
        }
    });
    
    $(document).on( "ready", document, function() {
        $(".product-list>li:first-child>a span").removeClass("glyphicon-plus").addClass("glyphicon-minus");
    });
    
    $(document).on( "click", ".product-list>li>a", function() {
        $(".product-list>li>a").removeClass("active-product-list");
        $(this).addClass("active-product-list");
        var activeTab = $(this).attr('data-active');
        $(".product-sub-list:not("+activeTab+")").slideUp("slow");
        $(".product-list>li>a span").removeClass("glyphicon-minus").addClass("glyphicon-plus");
        $("span", this).removeClass("glyphicon-plus").addClass("glyphicon-minus");
        $(activeTab).slideDown("slow");
        event.preventDefault();
    });
    
    $(document).on( "keyup", '#search', function() {
        $("#searchResults").css("display", "block");
        $(':not(".modified-search")').click( function(){
            $("#searchResults").css("display", "none");
        });
        searchProducts($(this).val());
    });
    
    $('body').on({
      mouseenter: function() {
         $(this).children().css("display", "block");
      },
      mouseleave: function() {
         $(this).children().css("display", "none");
      }
    }, '#searchResults a');
    
    var modal = '<div class="modal fade" id="loginAlert" role="dialog">'+
                    '<div class="modal-dialog">'+
                        '<div class="modal-content">'+
                            '<div class="modal-header modified-modal-header">'+
                                  '<h4 class="modal-title text-center">You are not logged in</h4>'+
                            '</div>'+
                            '<div class="modal-body text-center">'+
                                '<p>You need to login to access the cart</p>'+
                                '<a href="login.html"><button type="button" class="btn btn-primary">Login</button></a>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>';
          
    $("body").append(modal);
});

function searchProducts(searchKey){
    var data = productItems;
    var string = "";
    string += '<ul class="nav nav-stacked">';
    var counter = 0;
    var regEx = new RegExp($.map(searchKey.trim().split(' '), function(v) {
        return '(?=.*?' + v + ')';
    }).join(''), 'i');
    //console.log(regEx);
    $.each(data, function(i){
        var temp = data[i];
        $.each(temp, function(j){
            var productName = temp[j].productName;
            //console.log(regEx.exec(productName));
            if((regEx.exec(productName) != null) && counter<10){
                string += '<li>'+
                                '<a href="productdetail.html?productID=' + temp[j].productID + '">' + productName + 
                                    '<span class="glyphicon glyphicon-chevron-right glyphicon-chevron-modified" style="color: black;"></span>'+
                                '</a>'+
                          '</li>';
                counter++;
            }
        });
    });
    counter++;
    if(counter>9){ string += '<li><a href="#" style="color:black">See more results...</a></li>';}
    string += '</ul>';
    $("#searchResults").html(string);
}