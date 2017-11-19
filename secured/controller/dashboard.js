startLoad();
var navMan = {
    status:'closed'
}
$(document).ready(function(){ 
    $( document ).ajaxStart(function() {
        startLoad();
    });
    $( document ).ajaxComplete(function() {
        stopLoad();
    });
    $( "*", document.body ).click(function( event ) {  
        event.stopPropagation();  
        var domElement = $( this ).get( 0 );  
        monitorClicks(domElement)  
    });  
    authenticateUser(); 
    loadDefaults();

});
function loadDefaults(){
    loadComponent('dashboard','header','dashboadHeaderDiv');
    loadComponent('dashboard','navigation','dashboardNavDiv');
    loadComponent('dashboard','stats','dashboardDisplayDiv');
}

function w3_open() {
    setTimeout(function () { navMan.status = 'open' }, 300);
  document.getElementById("dashboadHeaderDiv").style.position = "relative";
  document.getElementById("dashboadHeaderDiv").style.zIndex = "0";
  document.getElementById("mySidebar").style.zIndex = "1";
  document.getElementById("mySidebar").style.width = "50vw";
  document.getElementById("mySidebar").style.display = "block";
  document.getElementById("openNav").style.display = 'none';
  document.getElementById("closeNav").style.display = 'inline-block';
  
}
function w3_close() { 
  navMan.status = 'close';
  $('#mySidebar').hide("slide", { direction: "left" }, 200);
  //document.getElementById("dashboadHeaderDiv").style.zIndex = "10";
  //document.getElementById("mySidebar").style.zIndex = "0";
  document.getElementById("main").style.marginLeft = "0%";
  document.getElementById("dashboadHeaderDiv").style.position = "fixed";  
  //document.getElementById("mySidebar").style.display = "none";
  document.getElementById("closeNav").style.display = 'none';
  document.getElementById("openNav").style.display = "inline-block";

}

function monitorClicks(el){
    //console.log(el.id)
    if (el.id == 'dashboardNavDiv' || el.id == 'dashboadHeaderDiv'){
        if (el.id == 'dashboadHeaderDiv' && navMan.status == 'open'){
            w3_close()
          }
    }else{
        w3_close()
    }
  


}