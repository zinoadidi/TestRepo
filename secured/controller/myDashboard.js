
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
}

function stats(data,option){
	if (data) {

		if (option == 'new') {
			data = JSON.parse(data);
			sessionStorage.dashboardData = JSON.stringify(data);
			commonData.Dashboard = data['data']
			commonData.User = payday.user
			navApp.data = commonData;
			dashboardApp.data = commonData;	
			stopLoad()
		}else{
			data = JSON.parse(data);
			commonData.Dashboard = data['data']
			commonData.User = payday.user
			navApp.data = commonData;
			dashboardApp.data = commonData;	
		}
		if(String(commonData.User.ProfilePic)!='null'){
            
		}else{
			navApp.commonData.User.ProfilePic = 'secured/assets/img/profile.jpg'
			dashboardApp.commonData.User.ProfilePic = 'secured/assets/img/profile.jpg'

		}
		//drawChart()
	}
}

function drawChart(){
	if(temporaryApp.vm.pendingContents == '' || 
		temporaryApp.vm.rejectedContents == '' ||
		temporaryApp.vm.approvedContents == '' ||
		temporaryApp.vm.totalContents == ''
		){
		return false;
	}else{
		var ctx = document.getElementById("myChart");
		var myChart = new Chart(ctx, {
		    type: 'horizontalBar',
		    data: {
		        labels: ["Total Contents", "Pending Contents", "Approved Contents", "Rejected Contents"],
		        datasets: [{
		            label: '# of Contents',
		            data: [temporaryApp.vm.totalContents,temporaryApp.vm.pendingContents , temporaryApp.vm.approvedContents,  temporaryApp.vm.rejectedContents],
		            backgroundColor: [
		                'rgba(81, 45, 168, 1)',
		                'rgba(255, 100, 20, 1)',
		                'rgba(20, 255, 100, 1)',
		                'rgba(136, 14, 79, 1)'
		            ],
		            borderColor: [
		                'rgba(54, 120, 235, 0.6)',
		                'rgba(255, 100, 20, 0.6)',
		                'rgba(20, 255, 100, 0.6)',
		                'rgba(255, 20, 50, 0.6)'
		            ],
		            borderWidth: 1
		        }]
		    },
		    options: {
		        scales: {
		            yAxes: [{
		                ticks: {
		                    beginAtZero:true
		                }
		            }]
		        }
		    }
		});
		return false;
	}
};

