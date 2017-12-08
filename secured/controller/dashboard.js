//startLoad(); 
var navMan = {
    status:'closed',
    selected:'false'
}
$(document).ready(function(){ 
    $( "*", document.body ).click(function( event ) {  
        event.stopPropagation();  
        var domElement = $( this ).get( 0 );  
        monitorClicks(domElement)  
    });  
    authenticateUser(); 
    loadDefaults();
    
});
function loadDefaults(){
    renda.component('dashboard','header','dashboadHeaderDiv');
    renda.component('dashboard','navigation','dashboardNavDiv');
    renda.component('dashboard','myDashboard','dashboardDisplayDiv');
    
    stopLoad()
}

function w3_open() {
  setTimeout(function () { navMan.status = 'open' }, 100);
  document.getElementById("dashboadHeaderDiv").style.position = "relative";
  document.getElementById("dashboadHeaderDiv").style.zIndex = "9";
  document.getElementById("mySidebar").style.zIndex = "10";
  document.getElementById("mySidebar").style.width = "50vw";
  document.getElementById("mySidebar").style.display = "block";
  document.getElementById("openNav").style.display = 'none';
  document.getElementById("closeNav").style.display = 'inline-block';
  
}
function w3_close() { 
  navMan.status = 'close';
  $('#mySidebar').hide("slide", { direction: "left" }, 70);
  document.getElementById("mySidebar").style.zIndex = "11";
  document.getElementById("dashboadHeaderDiv").style.zIndex = "10";
  document.getElementById("main").style.marginLeft = "0%";
  document.getElementById("dashboadHeaderDiv").style.position = "fixed";  
  //document.getElementById("mySidebar").style.display = "none";
  document.getElementById("closeNav").style.display = 'none';
  document.getElementById("openNav").style.display = "inline-block";

}

function monitorClicks(el){
  var cp = renda.Config.currentPage;
  if(cp =='login' || cp == 'register' || cp == 'setup_profile'
    ){
    return false;
  }
  if (el.id == 'display' || el.id == 'dashboardDisplayDiv') {
    if(navMan.status == 'open' || document.getElementById("mySidebar").style.display == "block"){
      w3_close()
    }
  }
  


}

function switchTabs(evt, tabName) {
    var i, x, tablinks;
    x = document.getElementsByClassName("dashboardTabs");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < x.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" dash-tab-current", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " dash-tab-current";
}