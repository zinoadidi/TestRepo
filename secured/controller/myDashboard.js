
dashboardApp = new Vue({
  el: '#myDashboard',
  data: {
      	commonData:commonData
  }
}); 
var navApp = new Vue({
  el: '#mySidebar',
  data: {
      	commonData:commonData
  }
});
 
/*request stat data*/
var testDash = String(sessionStorage.dashboardData)
if ( testDash != 'undefined' && testDash != 'null' && testDash != ''){
	stats(sessionStorage.dashboardData,'existing');
}else{
	startLoad()
	renda.get('/dashboardData/'+sessionStorage.UserId,'stats','new');
	renda.get('/cards/' + sessionStorage.UserId, 'stats', 'cards');
}

$( document ).ready(function() {

  w3_close()
  $('#loadInvestment101Btn').click(function(){
      w3_close()
      startLoad()
      renda.component('userExtras','investment101','dashboardDisplayDiv');
  });
  $('#loadDashboardBtn').click(function(){
      w3_close()
      startLoad()
      renda.component('dashboard','myDashboard','dashboardDisplayDiv')
    });
  $('#loadGoalManagementBtn').click(function(){
      w3_close()
      startLoad()
      renda.component('goals','goal','dashboardDisplayDiv');
  });

  $('#loadCardManagementBtn').click(function(){
      w3_close()
      startLoad()
      renda.component('card','view','dashboardDisplayDiv');
  });
  $('#loadTransactionBtn').click(function(){
      w3_close()
      startLoad()
      renda.component('userExtras','transactions','dashboardDisplayDiv');
  });

  $('#loadAccountSettings').click(function(){
      w3_close()
      startLoad()
      renda.component('userExtras','account','dashboardDisplayDiv');
  });
  $('#loadActivitiesBtn').click(function(){
      w3_close()
      startLoad()
      renda.component('userExtras','activities','dashboardDisplayDiv');
  });
});
