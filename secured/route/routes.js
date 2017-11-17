function loadPage(page){
	startLoad();
	var url = monetizeViewBaseUrl+page;
    $.get(url,
    {
    },
    function(data,status){
        if(data) {
        	currentPage = page;
            $('#display').html(data);
            var stateObj = { page: page };
            var title = "Monetize | "+page;
            document.title = title;
			history.pushState(stateObj, title, "#/"+page);
            console.log(page," loaded");
            stopLoad();
        }else{
            alert("Network connection down.");
            console.log(page," load failed");
        }
        
    });
}
function loadComponent(page,component,element){
	startLoad();
    console.log("load component start");

	var url = monetizeViewBaseUrl+page+'Components'+'/'+component;
    $.get(url,
    {
    },
    function(data,status){
        if(data) {
        	currentPage = page;
        	currentComponent = component;
            var stateObj = { page: page };
            var title = "Monetize | "+page+" - "+component;
			history.pushState(stateObj, title, "#/"+page+'/'+component);
        	document.title = title;
            $('#'+element).html(data);
        	console.log(page,"load component: "+component);
        	stopLoad();
        }else{
            alert("Network connection down.");
            console.log(page," load failed: "+component);
            
        }
        
    });
}

function sendAPIData(url,data,method){
	startLoad();
    $.ajax({
        url: monetizeBaseUrl+url,
        type: 'POST',
        data:data,
        beforeSend:function(xhr){
            $(".loadingbar").show();
            xhr.setRequestHeader('Authorization','Bearer ' + sessionStorage.usertoken);
        },
        success: function (result) {
            callback(result,method);
        },
        error: function (result) {
            callback(result,method);
        }
    });   

}

function requestAPIData(url,method, callbackData){
	startLoad();
    if( callbackData){}else{ callbackData = null};
    $.ajax({
        url: monetizeBaseUrl+url,
        type: 'GET',
        beforeSend:function(xhr){ 
            $(".loadingbar").show();
            xhr.setRequestHeader('Authorization','Bearer ' + sessionStorage.usertoken);
        },
        success: function (result) {
            callback(result,method, callbackData);
        },
        error: function (result) {
            callback(result,method, callbackData);
        }
    });   

}

function updateAPIData(url,data,method){
    startLoad();
    $.ajax({
        url: monetizeBaseUrl+url,
        type: 'PUT',
        data:data,
        beforeSend:function(xhr){
            $(".loadingbar").show();
            xhr.setRequestHeader('Authorization','Bearer ' + sessionStorage.usertoken);
        },
        success: function (result) {
            callback(result,method);
        },
        error: function (result) {
            callback(result,method);
        }
    });   

}


function callback(data,method, callbackData){
    stopLoad();
    if (method == 'login') {login(data);return false;}
    if (method == 'createCategory') {createCategory(data);return false;}
    if (method == 'listCategory') {listCategory(data);return false;}
    if (method == 'listUsers') {listUsers(data);return false;}
    if (method == 'listContents') {listContents(data);return false;}
    if (method == 'listContentType') {listContentType(data);return false;}
    if (method == 'stats') {stats(data, callbackData);return false;}
    if (method == 'createContentType') {createContentType(data, callbackData);return false;}
    if (method == 'viewSingleContent') {viewSingleContent(data, callbackData);return false;}
    if (method == 'verifyContent') {viewSingleContent(data, callbackData);return false;}
    
    toastr.error('unable to complete request.<br/> An error occured while locating function: '+method);
    console.log('error locating method:'+method,data);
    return false;

}