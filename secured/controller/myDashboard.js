
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

var statsData = new Vue({
    el: '#myChat',
    data:{
        labels:[0,1,3,4],
        data:[0,0,0,0],
        backgroundColor:'#02ff1030',
        color:'#4daf51',
        pointBackgroundColor:'#fff'

    }
})


/*request stat data*/
var testDash = String(sessionStorage.dashboardData)
if (testDash != 'undefined' && testDash != 'null' && testDash != ''){
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
  $('#loadContactUsBtn').click(function(){
    w3_close()
    startLoad()
    renda.component('userExtras','contact','dashboardDisplayDiv');
  });
  $('#loadFAQBtn').click(function(){
    w3_close()
    startLoad()
    renda.component('userExtras','faq','dashboardDisplayDiv');
  });
  if(sessionStorage.monthlyTrans){
    dashboardStats(sessionStorage.monthlyTrans);
    dashboardStats();
  }else{
    dashboardStats();
  }
});


function dashboardStats(data){
    if(data){
		renda.loader('stop');
		try{
			JSON.parse(data);
		}catch(err){
			stopLoad()
			console.dir(err);
			return false;
		}
		stopLoad();
		data = JSON.parse(data);
		if (data.status == 200){
            console.log(data)
            if(data.data){
                sessionStorage.monthlyTrans = JSON.stringify(data);
                var counter = 0;
                statsData.data = [];
                statsData.labels=[];
                data.data.data.forEach( function (arrayItem)
                {
                    statsData.data[counter] = arrayItem.Amount;
                    var date = new Date(arrayItem.TransactionDate)
                    var label = date.getDate()+'/'+(parseInt(date.getMonth()) + 1);
                    statsData.labels[counter] = label;
                    counter ++;
                });
                
            }else{

            }
            var ctx = document.getElementById("myChart").getContext("2d");
            var myChart = 
            new Chart(ctx, {
                type: 'line',
            
                data: {
                    labels: statsData.labels,
                    datasets: [{
                        label: '#Transaction',
                        data: statsData.data,
                        backgroundColor: statsData.backgroundColor,
                        borderColor: statsData.color,
                        pointBackgroundColor:statsData.pointBackgroundColor
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
        }else{
			console.log(data['message']);    
		}           
		return false;
	}else{
        var date = new Date();
        var today = date.getFullYear()+'-'+(parseInt(date.getMonth())+1)+'-'+date.getDate();
        if(parseInt(date.getMonth())<=1){
            var startDate = (date.getFullYear()-1)+'-'+'12'+'-'+date.getDate();                
        }else{
            var startDate = date.getFullYear()+'-'+(parseInt(date.getMonth()))+'-'+date.getDate();        
        }
        data= {  
            "UserId": sessionStorage.UserId,
            "FromDate":startDate,             
            "ToDate": today,             
            "TransactionType": "Credit"  
        } 
        startLoad()
        renda.post('/transaction/history',JSON.stringify(data),'dashboardStats');
    }
    return false;
}