$(document).ready(function(){
    $(document).on( "click", 'input[type="checkbox"]', function() {
        var checkedValues = $('input:checkbox:checked').map(function() {
            var filterValue = this.value;
            var filterType = $(this).attr("data-filter");
            
            if(filterType == "Sub-Category"){
                filterType = "subCategory";
            } else if(filterType == "Price"){
                filterType = "price";
                if(isNaN(filterValue[0])){
                    minPrice = filterValue.substring(1);
                    maxPrice = 1000000;
                    filterValue = minPrice + "-" +maxPrice;
                }
            } else if(filterType == "Brand"){
                filterType = "brandName";
            } else if(filterType == "Author"){
                filterType = "author";
            }
            var filterArgument = filterType + "==" + filterValue;
            return filterArgument;
        }).get();
        setFilteredProducts(category, checkedValues);
    });
    
    var category = getUrlPath();
    if(category == "productdetail"){
        var productID = getUrlParameter('productID');
        productItemDatail(productID);
    } 
    else if( (category == "index") || (category == "" )){
        setHomeFilters();
        setProductItems("electronics");
        setProductItems("books");
        setProductItems("sports");
        setProductItems("clothing");
    }
    else{
        setFilters(category);
        setProductItems(category);
    }
    $(document).on( "click", '.product-list>li>ul>li>a', function() {
        $(".product-list>li>ul>li>a").css("background","none");
        $(".product-list>li>ul>li>a").next().css("display","none");
        $(this).css("background","rgba(0,0,0,0.3)");
        $(this).next().css("display","block");
        var keys1 = $(this).attr("data-filter");
        var keys2 = $(this).html();
        var keys3 = $(this).attr("data-category");
        var args = [keys1+"=="+keys2]; 
        setFilteredProducts(keys3, args);
        event.preventDefault();
    });
    
    /*var loginStatus = $(".login").html();
    alert(loginStatus);
    if((loginStatus == "Login") && (category == "cart")){
       location.assign("index.html");
    }*/
});

function getUrlPath() {
    var sPageURL = window.location.pathname,
        sURLVariables = sPageURL.split('shoppingbee.com/');
    var sPath = sURLVariables[1].split('.html');
    return sPath[0] === undefined ? true : sPath[0];        
};

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }

};

function setFilters(categoryParam){
    var data = filters[categoryParam];
    var string = "";
    $.each(data, function(i){
        string += '<div class="panel panel-default">'+        
                    '<div class="panel-heading modified-panel-heading">'+
                        '<h4 class="panel-title">' + data[i].filterType + '</h4>' +
                    '</div>'+
                    '<div class="panel-body" class="' + data[i].filterType + '">';
        var temp = data[i].filterItem;
        $.each(temp, function(j){
            string +=   '<div class="checkbox">'+
                            '<label><input type="checkbox" data-filter="' + data[i].filterType + '" value="'+ temp[j] +'">' + temp[j] + '</label>'+
                        '</div>';
        });
        string +=   '</div>'+
                '</div>';
    });
    $(".filter-category").append(string);
}

function setProductItems (categoryParam){
    var data = productItems[categoryParam];
    var string = "";
    string += '<div class="row text-center product-item-container">';

    $.each(data, function(i){
        string += '<div class="col-sm-6 col-md-4">'+
                    '<div class="individual-item">'+
                        '<a href="productdetail.html?productID=' + data[i].productID + '">'+
                            '<img src="../assets/images/' + data[i].imageSRC + '" class="img-thumbnail" alt="' + data[i].productName + '" style="max-height:190px">'+
                             '<h4>' + data[i].productName + '</h4>'+
                        '</a>'+
                        '<div class="row">'+
                            '<div class="col-sm-6">Price: Rs. ' + data[i].price + '</div>'+
                            '<div class="col-sm-6"><a href="#" class="add-to-cart" data-productID="'+ data[i].productID +'">Add to Cart</a></div>'+
                        '</div>'+
                    '</div>'+
                '</div>';
    });
    string += '</div>';

    $(".product-items").append(string);
}

function productItemDatail(productID){
    var param = productID.split("-");
    var category = param[0];
    var index = (param[1]-1);
    var data = productItems[category];
    var string = ""; 
    string +=   '<div class="col-sm-12 col-md-6">'+
                    '<img src="../assets/images/' + data[index].imageSRC + '" class="img-thumbnail" alt="' + data[index].productName + '" width="100%">'+
                '</div>'+
                '<div class="col-sm-12 col-md-6">'+
                    '<h3>' + data[index].productName + '</h3>'+
                    '<div> Price: Rs. ' + data[index].price + '</div>';

    if(category=="books"){
        string += '<div> Author: ' + data[index].author + '</div>';
    }else{
        string += '<div> Brand Name: ' + data[index].brandName + '</div>';
    }
    var specifications = data[index].details;
    string += '<div class="product-specs row">';
    $.each(specifications, function(i){
        string +=       '<div class="col-sm-6">Random ' + data[index].subCategory +" specification "+ specifications[i] +'</div>'+
                        '<div class="col-sm-6">Random ' + data[index].subCategory +" specification "+ (specifications[i]+5) + '</div>';
    });
    string += '</div>';
    string += '<div style="padding: 10px 0;">'+
                    '<a href="#" class="add-to-cart" data-productID="'+ productID +'">'+
                    '<button type="button" class="btn btn-success">Add to cart</button></a>'+
                '</div>'+
            '</div>';
   $(".product-detail").append(string); 
}

function setHomeFilters(){
    var data = filters;
    var string = "";
    string += '<ul class="nav nav-stacked product-list">';
    var x = 0;
    $.each(data, function(i){
        x++;
        if(x==1){ 
            var newClass = "active-product-list";
        }else{
            var newClass = "";
        }
        string += '<li href="#collapse' + (x) + '">'+
                        '<a href="#" data-active="#collapse' + (x) + '" class="capitalize '+ newClass +'">' + i + 
                            '<span class="glyphicon glyphicon-plus glyphicon-modified"></span>'+
                        '</a>'+
                        '<ul id="collapse' + x + '" class="product-sub-list">';
        var temp = data[i];
        var temp2 = temp[0].filterItem;
        $.each(temp2, function(j){
            string +=    '<li><a href="#" data-filter="subCategory" data-category="'+ i +'">' + temp2[j] + '</a><span class="glyphicon glyphicon-chevron-right glyphicon-chevron-modified"></span></li>';
        });
        string += '</ul>'+
            '</li>';
    });
    string += '</ul>';
    $(".filter-category").append(string);
}

function setFilteredProducts(categoryParam, filterArg){
    var data = productItems[categoryParam];
    var string = "";
    var successString = "";
    var counter = 0;
    string += '<div class="row text-center product-item-container">';
    $(".product-items").html("");
    var priceFlag = [], subCategoryFlag = [], brandNameFlag = [], authorFlag = [];
    var pflag=0, sflag=0, bflag=0, aflag=0, flag=0, x=0;
    $.each(data, function(i){
        pflag=0, sflag=0, bflag=0,aflag=0, flag=0;
        for (x= 0; x < filterArg.length; x++) {
            var parameters = filterArg[x].split("==");
            var param1 = parameters[0];
            var param2 = parameters[1];
            if(param1 =="price"){
                priceFlag[x] = 0;
                var minMaxPrice = parameters[1].split("-");
                var minPrice = parseInt(minMaxPrice[0]);
                var maxPrice = parseInt(minMaxPrice[1]);
                if((data[i].price >= minPrice) && (data[i].price < maxPrice)){
                    priceFlag[x]=1;
                    pflag += priceFlag[x];
                }
            }
            else if(param1 =="subCategory"){
                subCategoryFlag[x] = 0;
                if(data[i].subCategory == param2) {
                    subCategoryFlag[x]=1;
                    sflag += subCategoryFlag[x];
                }
            } else if(param1 =="brandName"){
                brandNameFlag[x]= 0;
                if(data[i].brandName == param2) {
                    brandNameFlag[x]=1;
                    bflag += brandNameFlag[x];
                }
            }  else if(param1 =="author"){
                authorFlag[x]= 0;
                if(data[i].author == param2) {
                    authorFlag[x]=1;
                    aflag += authorFlag[x];
                }
            }  
            
        }
        var key1=0, key2=0, key3=0, key4=0;
        for (x= 0; x < filterArg.length; x++) {
            if(priceFlag[x]!=undefined){
                key1 = 1;
            }
            if(subCategoryFlag[x]!=undefined){  
                key2 = 1;
            }
            if(brandNameFlag[x]!=undefined){
                key3 = 1;
            }
            if(authorFlag[x]!=undefined){
                key4 = 1;
            }
        }
        if(key1==0){pflag=1;}
        if(key2==0){sflag=1;}
        if(key3==0){bflag=1;}
        if(key4==0){aflag=1;}
        flag = (pflag)*(sflag)*(bflag)*(aflag);
        if(flag==1){
            counter++;
            string += '<div class="col-sm-6 col-md-4">'+
                        '<div class="individual-item">'+
                            '<a href="productdetail.html?productID=' + data[i].productID + '">'+
                                '<img src="../assets/images/' + data[i].imageSRC + '" class="img-thumbnail" alt="' + data[i].productName + '" style="max-height:180px">'+
                                 '<h4>' + data[i].productName + '</h4>'+
                            '</a>'+
                            '<div class="row">'+
                                '<div class="col-sm-6">Price: Rs. ' + data[i].price + '</div>'+
                                '<div class="col-sm-6"><a href="#" class="add-to-cart" data-productID="'+ data[i].productID +'">Add to Cart</a></div>'+
                            '</div>'+
                        '</div>'+
                    '</div>';
        }
    });
    string += '</div>';
    
    if(counter>0){
        successString = '<div class="alert alert-success">'+
                            '<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+
                            '<strong>' + counter + ' results found!</strong>'+
                        '</div>';
    }else{
        successString = '<div class="alert alert-danger">'+
                            '<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+
                            '<strong> No results found!</strong>'+
                        '</div>';
    }
    $(".product-items").append(successString);
    $(".product-items").append(string);
}