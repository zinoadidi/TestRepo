renda.get('/investmentOne','updateUserExtras','investment101');
renda.get('/userNotification/'+sessionStorage.UserId+'?page=1','updateUserExtras','activities');
$("a").click(function(event){
    var link = this.href;
    return false;
});
function initInvestment101Page(){
    
	investment101 = new Vue({
	  el: '#investment101Page', 
	  data: {
      	data:{
      		"title": "Investment 101 – Realising Ambitions",
	        "link": "http://realisingambitions.com",
	        "description": "The ARM Blog",
	        "lastBuildDate": "Tue, 28 Nov 2017 15:23:50 +0000",
	        "language": "en-US",
	        "generator": "https://wordpress.org/?v=4.7.7",
		    "item": []
      	}
	  }
	});
	if(sessionStorage.investment101){
		investment101.data = JSON.parse(sessionStorage.investment101);
        $('a').each(function() {
          var href = $(this).attr('href') || '';
            $(this).attr('href', 'javascript:void(0)');
        });
	}
    $("a").click(function(event){
        var link = this.href;
        alert(link);
        return false;
    });

}

function initActivitiesPage(){
    
	activities = new Vue({
	  el: '#activitiesPage',
	  data: {
      	data:{
            "total": 0,         
            "per_page": 0,         
            "current_page": 0,         
            "last_page": 0,         
            "next_page_url": "",         
            "prev_page_url": "",         
            "from": 0,         
            "to": 0,         
            "data": {}
      	}
	  }
	});
	if(sessionStorage.activities){
		activities.data = JSON.parse(sessionStorage.activities);
    }
    
}

function initTransactionsPage(){
	transactions = new Vue({
	  el: '#transactionPage',
	  data: {
      	data:{
            "AppUserId ": 0,         
            "TransactionType ": 0,         
            "Status ": 0,         
            "Amount ": 0,         
            "TransactionKind ": "",         
            "Details ": "",         
            "TransactionDate ": "",         
            "GoalId ": 0       
      	}
	  }
	});
	if(sessionStorage.activities){
		activities.data = JSON.parse(sessionStorage.activities);
    }
    
}




function updateUserExtras(data,option){

	if (data) {
        stopLoad()
        $("a").click(function(event){
            var link = this.href;
            alert(link);
            return false;
        });
        try{
            JSON.parse(data);
        }catch(err){
            toastr.error('An error occured while verfying user information.')
            console.dir(err);
            return false;
        }
        if ( option == 'investment101') {
            data = JSON.parse(data);
            sessionStorage.investment101 = JSON.stringify(data);
            investment101.data = data['data']
            $('a').each(function() {
                var href = $(this).attr('href') || '';
                $(this).attr('href', 'javascript:void(0)');
            });
            return false;
        
        }
        else if ( option == 'activities') {
            data = JSON.parse(data);
            sessionStorage.activities = JSON.stringify(data);
            activities.data = data['data']
            return false;
        }
        else if ( option == 'transactions') {
            data = JSON.parse(data);
            sessionStorage.transactions = JSON.stringify(data);
            transactions.data = data['data']
            return false;
        }
        else if (option == 'cards') {
            data = JSON.parse(data);
            sessionStorage.userCards = JSON.stringify(data);
            cardsApp.cards = data['data'];   
            
        }else{
            data = JSON.parse(data);
            commonData.Dashboard = data['data']
            commonData.User = payday.user
            navApp.data = commonData;
            dashboardApp.commonData = commonData;   
        }
        if(String(commonData.User.ProfilePic)!='null'){
            
        }else{
            navApp.commonData.User.ProfilePic = 'secured/assets/img/profile.jpg'
            dashboardApp.commonData.User.ProfilePic = 'secured/assets/img/profile.jpg'
        }
        //drawChart()
    }

}


function nextActivityPage(){
    startLoad()
    var page = parseInt(activities.data.current_page);
    page ++;
    if(page <= 0 || page > (parseInt(activities.data.per_page) / parseInt(activities.data.total))){
        page = 1;
    }else{
        page = page +1;
    }
    renda.get('/userNotification/'+sessionStorage.UserId+'?page='+page,'updateUserExtras','activities');

}

function prevActivityPage(){
    startLoad()
    var page = parseInt(activities.data.current_page);
    page++;
    if(page <= 0 || page > (parseInt(activities.data.per_page) / parseInt(activities.data.total))){
        page = 1;
    }else{
        page = page -1;
    }
    renda.get('/userNotification/'+sessionStorage.UserId+'?page='+page,'updateUserExtras','activities');

}

function filterTransactions(data){
    if (data) {
        try{
            JSON.parse(data);
        }catch(err){
            stopLoad()
            toastr.error('An error occured while verfying user information.')
            console.dir(err);
            return false;
        } 
        let result = JSON.parse(data);
        //let result = USERDATA;
        console.dir(result);
        if (result.status == 200){
            if(result.data){
             updateUserExtras(data,'transactions')            
            }else{
                toastr.error(result.message);
                stopLoad()
                return false
            }
        }else{
            toastr.error(result['message']);    
        }
        stopLoad()            
        return false;
    }else{
        let FromDate = $('#FromDate').val();
        let ToDate = $('#ToDate').val(); 
        let TransactionType = $('#TransactionType').val(); 
        data = {
            "UserId": sessionStorage.UserId,
            "FromDate": FromDate,             
            "ToDate": ToDate,             
            "TransactionType": TransactionType 
        };
        console.log(data)
        if(FromDate == undefined || FromDate == null 
            || ToDate == undefined || ToDate == null
            || TransactionType == undefined || TransactionType == null ){
            alert("Please provide information for filter")
            return false;
        }
        if (validateObj(data)){
            startLoad()
            renda.post('/transaction/history',JSON.stringify(data),'filterTransactions');
        }else{
            return false;
        }
    }
    
    return false;  
}