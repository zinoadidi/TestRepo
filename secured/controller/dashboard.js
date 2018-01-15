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
    dashboardTitle = new Vue({
        el: '#appTitleDisplayDiv',
        data:{
            title:''
        }
    })
});
function loadDefaults(){
    renda.component('dashboard','navigation','dashboardNavDiv');    
    renda.component('dashboard','header','dashboadHeaderDiv');
    renda.component('dashboard','myDashboard','dashboardDisplayDiv');
    
    stopLoad()
}

function w3_open() {
  setTimeout(function () { navMan.status = 'open' }, 2);
  document.getElementById("dashboadHeaderDiv").style.position = "relative";
  document.getElementById("dashboadHeaderDiv").style.zIndex = "9";
  document.getElementById("mySidebar").style.zIndex = "10";
  document.getElementById("mySidebar").style.width = "50vw";
  document.getElementById("mySidebar").style.display = "block";
  document.getElementById("mySidebar").style.left = '0px';
  document.getElementById("mySidebar").style.clip = 'rect(0px 100% 736px 0.0px)';
  document.getElementById("openNav").style.display = 'none';
  document.getElementById("closeNav").style.display = 'inline-block';
  
  
  
}
function w3_close() { 
    
  navMan.status = 'close';
  $('#mySidebar').hide("slide", { direction: "left" }, 1);
  document.getElementById("mySidebar").style.zIndex = "11";
  document.getElementById("dashboadHeaderDiv").style.zIndex = "10";
  document.getElementById("main").style.marginLeft = "0%";
  document.getElementById("dashboadHeaderDiv").style.position = "fixed";  
  //document.getElementById("mySidebar").style.display = "none";
  document.getElementById("closeNav").style.display = 'none';
  document.getElementById("openNav").style.display = "inline-block";
  document.getElementById("mySidebar").style.clip = 'rect(0px 100% 736px 0.0px)';
  var cp = renda.Config.currentPage;
  if(cp == 'userExtras'){
    dashboardTitle.title = renda.Config.currentComponent;
  }else{
    dashboardTitle.title = renda.Config.currentPage;    
  }
}

function monitorClicks(el){
  var cp = renda.Config.currentPage;
  if(cp == 'userExtras'){
    dashboardTitle.title = renda.Config.currentComponent;
  }else{
    dashboardTitle.title = renda.Config.currentPage;    
  }
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

function loadDashboardData(data,option){
  if(data){
    switch (option) {
      case 'Rate':
        try{
          data = JSON.parse(data);
          temporaryDashData.yield_rate = data.EffectiveYield;
        }catch(err){
          console.dir(err);
          temporaryDashData.yield_rate = 0.00;
        }
        break;

      case 'Goals':
        let goals_done = 0;
        let goals_total = 0;
        let goals_pending = 0;
        let goals_suspended = 0;
        let goals_active = 0;
        try{
          
          data = JSON.parse(data);
          if(data.length){
            goals_total = data.length;
          }
          for(var goals in data){
            if(goals.Status =='Completed'){
              goals_done++;
            }else if(goals.Status =='Active'){
              goals_active++;
            }else if(goals.Status =='Suspended'){
              goals_suspended++;
            }else{
              goals_pending++;
            }

          }
          console.log(data);   

        }catch(err){
          console.dir(err);
        }
        temporaryDashData.goals_done = goals_done;
        temporaryDashData.goals_total = goals_total;
        temporaryDashData.goals_pending = goals_pending;
        temporaryDashData.goals_suspended = goals_suspended;
        temporaryDashData.goals = data;
        break;

      case 'TotalInvestment':
        try{
          data = JSON.parse(data);
          temporaryDashData.net_investment = data;
        }catch(err){
          console.dir(err);
          temporaryDashData.net_investment.AppUserId = data.AppUserId;
        }
        break;
      case 'FetchWallet':
        try{
          data = JSON.parse(data);
          temporaryDashData.fetchWallet = data;
        }catch(err){
          console.dir(err);
          temporaryDashData.fetchWallet.UserId = data.UserId;
        }
        break;
      case 'TopGoal':
        try{
          data = JSON.parse(data);
          temporaryDashData.top_goal = data;
        }catch(err){
          console.dir(err);
        }
        break;
      case 'CurrentBalance':
        try{
          data = JSON.parse(data);
          temporaryDashData.client_balance = data;
        }catch(err){
          console.dir(err);
        }
        break;
      case 'cards':
        break;
      
      case 6:
        day = "Saturday";
      }
      console.dir(temporaryDashData)
      
      if(option == 'cards'){
      }else{
        option = 'new';
      }
      data = modResult(temporaryDashData);
    stats(JSON.stringify(data),option)
    return false;
  }else{
    startLoad()
    let UserId = {'UserId':sessionStorage.UserId}
    UserId = JSON.stringify(UserId)
    switch (option) {
      case 'dashData':
        renda.post('Goal/Rate',null,'loadDashboardData',null,null,'Rate');
        renda.post('Goal/FetchAllGoals',JSON.stringify(UserId),'loadDashboardData',null,null,'Goals');
        renda.post('Goal/TotalInvestment',JSON.stringify(UserId),'loadDashboardData',null,null,'TotalInvestment');
        renda.post('Goal/FetchWallet',JSON.stringify(UserId),'loadDashboardData',null,null,'FetchWallet');
        renda.post('Goal/FetchTopGoal',JSON.stringify(UserId),'loadDashboardData',null,null,'TopGoal');
        renda.post('UserTransactions/CurrentBalance',JSON.stringify(UserId),'loadDashboardData',null,null,'CurrentBalance');
        break;
      case 'cards':
        renda.post('PaymentDetails/FetchPaymentDetails',JSON.stringify(UserId),'loadDashboardData',null,null,'cards');
        break;
      case 6:
          day = "Saturday";
    }
  }
  
}