temporaryApp = new Vue({
  el: '#statsDiv',
  data: {
      vm: new Dashboard(null)
  }
});
/*request stat data*/
requestAPIData('user/count/all','stats','users');
requestAPIData('client/count/all','stats','clients');
requestAPIData('user/count/all/content_providers','stats','cProviders');
requestAPIData('content/count/all','stats','allContents');
requestAPIData('content/count/all/approved','stats','approved');
requestAPIData('content/count/all/pending','stats','pending');
requestAPIData('content/count/all/rejected','stats','rejected');
requestAPIData('content/downloaded/count/all','stats','downloaded');

function stats(data,option){
	if (data) {
		if (option == 'users') {
			temporaryApp.vm.totalUsers = data.data.count;
		}
		if (option == 'clients') {
			temporaryApp.vm.totalClients = data.data.count;
		}
		if (option == 'cProviders') {
			temporaryApp.vm.totalContentCreators = data.data.count;
		}
		if (option == 'allContents') {
			temporaryApp.vm.totalContents = data.data.count;
		}
		if (option == 'approved') {
			temporaryApp.vm.approvedContents = data.data.count;
		}
		if (option == 'pending') {
			temporaryApp.vm.pendingContents = data.data.count;
		}
		if (option == 'rejected') {
			temporaryApp.vm.rejectedContents = data.data.count;
		}
		if (option == 'downloaded') {
			temporaryApp.vm.totalDownloads = data.data.count;
		}
	}
}

var setChart = setInterval(function(){ drawChart() }, 200);

function drawChart(){
	if(temporaryApp.vm.pendingContents == '' || 
		temporaryApp.vm.rejectedContents == '' ||
		temporaryApp.vm.approvedContents == '' ||
		temporaryApp.vm.totalContents == ''
		){
		return false;
	}else{
		clearInterval(setChart);
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

