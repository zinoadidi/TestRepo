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
          temporaryDashData.yield_rate = data.EffectiveYield.toFixed(2)
        }catch(err){
          console.dir(err);
          temporaryDashData.yield_rate = 0.00;
        }
        break;

      case 'Goals':
        var goals_done = 0;
        var goals_total = 0;
        var goals_pending = 0;
        var goals_suspended = 0;
        var goals_active = 0;
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
          //console.log(data);   

        }catch(err){
          console.dir(err);
        }
        /* if(goals_suspended == 0){
          goals_suspended = goals_active
        } */
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
          temporaryDashData.fetchWallet.Amount = addCommas(data.Amount)
          
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
          temporaryDashData.client_balance.AvailableBalance = addCommas(data.AvailableBalance)
          temporaryDashData.client_balance.BookBalnce = addCommas(data.BookBalnce)
          temporaryDashData.client_balance.AccruedIntrest = addCommas(data.AccruedIntrest)
                  
        }catch(err){
          console.dir(err);
        }
        break;
      case 'cards':
        //console.log(data)
      }
      
      if(option == 'cards'){
        stats(data,option)
      }else{
        option = 'new';
        data = modResult(temporaryDashData);
        stats(JSON.stringify(data),option)
      }
      
    return false;
  }else{
    startLoad()
    var UserId = {'UserId':sessionStorage.UserId}
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
var httpReq = function httpReq(obj) {
  return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open(obj.method || "GET", obj.url);
      if (obj.headers) {
          Object.keys(obj.headers).forEach(function (key) {
              xhr.setRequestHeader(key, obj.headers[key]);
          });
      }
      xhr.onload = function () {
          if (xhr.status >= 200 && xhr.status < 300) {
              resolve(xhr.response);
          } else {
              reject(xhr.statusText);
          }
      };
      xhr.onerror = function () {
          return reject(xhr.statusText);
      };
      xhr.send(obj.body);
  });
};

function showWithdrawPopUp(){
  $('#extendedWalletUI').show()
  $('.extendWalletDivs').hide()
  $('#walletWithdrawal').show()
  $('.walletWithdrawExtras').hide()
  $('#walletWithdrawExtrasOtp').hide()
  $('.walletWithdrawExtrasHide').show()
}

function walletWithdrawal(data,option){
  if (data) {
      stopLoad()
      try{
          JSON.parse(data);
      }catch(err){
          if(data){
              alert(data)            
              
          }else{
              toastr.error('An error occured while performing request.')
          }
          console.dir(err);
          return false;
      }            
      var result = JSON.parse(data);
      //var result = USERDATA;
      console.dir(result);
      if (option == 'otp'){
          result = modResult(result);
          result.message = 'Please provide the OTP code that was sent to your email';
          alert(result.message); 
          showWalletWithdrawExtras()
      }else{
          result = modResult(result);
          result.message = 'Redemption request has been submitted successful';
          alert(result.message); 
          startLoad()
          renda.component('dashboard','myDashboard','dashboardDisplayDiv')
      }
      return false;
  }else{
      if(payday.user.IsKYCApproved == false &&  payday.user.ProgressStatus != 'Existing Customer'){
          var confirm = window.confirm('You have not completed your registration. Please upload your KYC information to continue. If your KYC is pending approval, you can ignore this message. You will not be able to use this feature until your KYC is approved');
          if(confirm){renda.page('setup_profile')}else{}
          return false;
      }
      var UserId = sessionStorage.UserId;
      var url = '';
      var data = {};
      switch (option) {
          case 'otp':
              data = {"UserId":UserId}
              url = 'Utility/SendOTP';
              break;
          case 'withdrawal':
              data = {
                  "AppUserId":UserId,
                  "Amount":$('#walletAmount').val(),
                  "Reason":$('#walletReason').val(),
                  "OTP":$('#walletOtp').val(),
                  "RedemptionType":'WalletRedemption'
              }
              url = 'UserTransactions/RedemptionRequest';
              if(data.OTP == '' || data.Amount == '' || data.Reason == ''){
                  alert('Please Provide All Fields to Process Redemption')
                  return false;
              }else{

              }
              break;
          default:
              break;
      }
      if(url){
          data = JSON.stringify(data)
          renda.post(url,JSON.stringify(data),'walletWithdrawal',null,null,option)            
      }else{
          alert('invalid command. Please try again')
      }
  }
  
  return false;  
}

function showWalletWithdrawExtras(){
  $('.walletWithdrawExtras').show()
  $('#walletWithdrawExtrasOtp').show()    
  $('.walletWithdrawExtrasHide').hide()
}