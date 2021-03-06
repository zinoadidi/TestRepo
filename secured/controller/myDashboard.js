
var statsData = '';
dashboardApp = new Vue({
  el: '#myDashboard',
  data: {
      	commonData:commonData
  }
}); 

if(renda.Config.currentPage =='dashboard'){
    statsData = new Vue({
        el: '#transactiontDiv',
        data:{
            labels:[0,1,3,4],
            data:[0,0,0,0],
            backgroundColor:'#2ae532',
            color:'#4daf51',
            pointBackgroundColor:'#fff'

        }
    })
}

//Trand=sparent background #02ff1030
 

/*request stat data*/
var testDash = String(sessionStorage.dashboardData)
if (testDash != 'undefined' && testDash != 'null' && testDash != ''){
    loadDashboardData(null,'dashData')
	//stats(sessionStorage.dashboardData,'existing');
}else{
    loadDashboardData(null,'cards');
    loadDashboardData(null,'dashData')
}

$( document ).ready(function() {
    $(window).scrollTop(0);
  w3_close()
  $('#loadInvestment101Btn').unbind().click(function(){
      w3_close()
      //startLoad()
      //renda.component('userExtras','investment101','dashboardDisplayDiv');
      investment101WebView = window.open('http://realisingambitions.com', '_blank', 'location=yes');
      
  });
  $('#loadDashboardBtn').unbind().click(function(){
      w3_close()
      startLoad()
      renda.component('dashboard','myDashboard','dashboardDisplayDiv')
    });
  $('#loadGoalManagementBtn').unbind().click(function(){
      w3_close()
     
      startLoad()
      renda.component('goals','goal','dashboardDisplayDiv');
      return false
  });

  $('#loadCardManagementBtn').unbind().click(function(){
      w3_close()
      startLoad()
      renda.component('card','view','dashboardDisplayDiv');
  });
  $('#loadTransactionBtn').unbind().click(function(){
      w3_close()
      startLoad()
      renda.component('userExtras','transactions','dashboardDisplayDiv');
  });

$('#loadRedemptionBtn').unbind().click(function(){
    w3_close()
    if(renda.Config.currentPage == 'dashboard'){
    }else{
        activateWalletPopUpOnLoad = true;
        startLoad()
        renda.component('dashboard','myDashboard','dashboardDisplayDiv')
    }
    showWithdrawPopUp()

});

  $('#loadAccountSettings').unbind().click(function(){
      w3_close()
      startLoad()
      renda.component('userExtras','account','dashboardDisplayDiv');
  });
  $('#loadActivitiesBtn').unbind().click(function(){
      w3_close()
      startLoad()
      renda.component('userExtras','activities','dashboardDisplayDiv');
  });
  $('#loadContactUsBtn').unbind().click(function(){
    w3_close()
    startLoad()
    renda.component('userExtras','contact','dashboardDisplayDiv');
  });
  $('#loadFAQBtn').unbind().click(function(){
    w3_close()
    startLoad()
    renda.component('userExtras','faq','dashboardDisplayDiv');
  });
  
  dashboardStats();
/*   var ctx =  document.getElementById("myPieChart").getContext("2d");
  var myDoughnutChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: [
            'Red',
            'Yellow',
            'Blue'
        ],
        datasets: [{
            data: [10, 20, 30],
            label: 'Dataset 1',            
            backgroundColor: [
                '#223344',
                '#aabbcc',
                '#332244'
            ]
        }]
    },
    
    options: []
  }); */
});


function dashboardStats(data){
    if(renda.Config.currentPage !='dashboard'){

        return false
    };
    statsData = new Vue({
        el: '#transactiontDiv',
        data:{
            labels:[0,1,3,4],
            data:[0,0,0,0],
            backgroundColor:'#2ae532',
            color:'#4daf51',
            pointBackgroundColor:'#fff'

        }
    })
    if(data){
		renda.loader('stop');
		try{
            JSON.parse(data);
            sessionStorage.monthlyTrans = data;                        
            data = JSON.parse(data);
		}catch(err){
			stopLoad()
			console.dir(err);
			data = []
		}
		stopLoad();
		
		if (data){
            //console.log(data)
            data.data = modResult(data);
            if(data.data){
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
                statsData.data = [0];
                statsData.labels=[0];
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
                        backgroundColor: '#02ff1030',
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
			//console.log(data);    
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
            "AppUserId": sessionStorage.UserId,
            "UserId": sessionStorage.UserId,
            "FromDate":startDate,             
            "ToDate": today,             
            "TransactionType": "Credit"  
        } 
        startLoad()
        data = JSON.stringify(data);
        renda.post('UserTransactions/TransactionHistory',JSON.stringify(data),'dashboardStats');
    }
    return false;
}


dashboardStats();
if(activateWalletPopUpOnLoad == true){
    showWithdrawPopUp()
    activateWalletPopUpOnLoad = false;
}
//dashboardTour()
