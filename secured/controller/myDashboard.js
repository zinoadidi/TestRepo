
 $(document).ready(function(){ 
	dashboardApp = new Vue({
	  el: '#myDashboard',
	  data: {
	      	commonData:commonData
	  }
	});
	navApp = new Vue({
	  el: '#mySidebar',
	  data: {
	      	commonData:commonData
	  }
	});
	
	var testDash = String(sessionStorage.dashboardData)
	if ( testDash != 'undefined' && testDash != 'null' && testDash != ''){
		stats(sessionStorage.dashboardData,'existing');
		 updateDataFromApi(null)
	}else{
		startLoad()
        renda.get('/dashboardData/'+sessionStorage.UserId,'stats','new');
	}

});
/*request stat data*/

