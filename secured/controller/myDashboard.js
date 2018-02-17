
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
      startLoad()
      renda.component('userExtras','investment101','dashboardDisplayDiv');
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
        let result = JSON.parse(data);
        //let result = USERDATA;
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
dashboardStats();

//dashboardTour()