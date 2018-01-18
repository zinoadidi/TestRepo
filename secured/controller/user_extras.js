
//renda.get('/investmentOne','updateUserExtras','investment101');
renda.post('Utility/FetchAllActivities',JSON.stringify(JSON.stringify({'UserId':sessionStorage.UserId})),'updateUserExtras',null,null,'activities');
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
    startLoad()
    promiseXmlHTTP({url:'https://paydayinvestor.arm.com.ng/api/v1/investment-one',method:'GET'}).then(function(result){
    updateUserExtras(result,'investment101')
    });
	if(sessionStorage.investment101){
		investment101.data = JSON.parse(sessionStorage.investment101);
        $('a').each(function() {
          var href = $(this).attr('href') || '';
            $(this).attr('href', 'javascript:void(0)');
        });
        stopLoad()
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
	if(sessionStorage.transactions){
		transactions.data = JSON.parse(sessionStorage.transactions);
    }
    
}

function updateUserExtras(data,option){
	if (data) {
        stopLoad()
        if ( option == 'investment101') {
            sessionStorage.investment101 = JSON.stringify(data);
            investment101.data = data['data']
            $('a').click(function(e) {
                e.preventDefault();
            });
            $('#investment101LoaderDiv').hide()
            return false;
        }
        try{
            JSON.parse(data);
        }catch(err){
            toastr.error('An error occured while perfoming request.')
            console.dir(err);
            return false;
        }
        
        if ( option == 'activities') {
            data = JSON.parse(data);
            data = modResult(data)          
            sessionStorage.activities = JSON.stringify(data);
            activities.data = JSON.parse(sessionStorage.activities);
            return false;
        }
        else if ( option == 'transactions') {
            data = JSON.parse(data);
            data = modResult(data) 
            sessionStorage.transactions = JSON.stringify(data);
            transactions.data = JSON.parse(sessionStorage.transactions);
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
            toastr.error(data)
            console.dir(err);
            return false;
        } 
        let result = JSON.parse(data);
        //let result = USERDATA;
        console.dir(result);
        if (result){
            updateUserExtras(data,'transactions')            
            stopLoad()
            return false
        }else{
            toastr.error(result);    
        }
        stopLoad()            
        return false;
    }else{
        let FromDate = $('#FromDate').val();
        let ToDate = $('#ToDate').val(); 
        let TransactionType = $('#TransactionType').val(); 
        data = {
            "UserId": sessionStorage.UserId,
            "AppUserId": sessionStorage.UserId,
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
            data =JSON.stringify(data)
            renda.post('UserTransactions/TransactionHistory',JSON.stringify(data),'filterTransactions');
        }else{
            return false;
        }
    }
    
    return false;  
}


function profileTab(tab){
    $('.profileTab').hide()
	$('#'+tab).show()
}


function initUserProfilePage(){
    
	userProfile = new Vue({
	  el: '#profilePage',
	  data: {
      	userDetails:{
           "Gender":"",
           "Address":"",
           "Surname":"",
           "Firstname":"",
           "Middlename":"",
           "SecurityQuestion":"",
           "SecurityAnswer":'',
           "BankName":"",
           "BankAccountNo":"",
           "Phonenumber":"",
           "Email":"",
           "AccountStatus":""
        },
        userExtras:{
            "ProgressStatus":"",
            "ProfilePic":"",

        }
	  }
	});
	if(sessionStorage.UserInfo){
        var data =  JSON.parse(sessionStorage.UserInfo);
		userProfile.userDetails.Gender = data['data'].Gender;
		userProfile.userDetails.Address = data['data'].Address;
		userProfile.userDetails.Surname = data['data'].Surname;
		userProfile.userDetails.Firstname = data['data'].Firstname;
		userProfile.userDetails.Middlename = data['data'].Middlename;
		userProfile.userDetails.SecurityQuestion = data['data'].SecurityQuestion;
		userProfile.userDetails.SecurityAnswer = '***********';
		userProfile.userDetails.BankName = data['data'].BankName;
		userProfile.userDetails.BankAccountNo = data['data'].BankAccountNo;
		userProfile.userDetails.Phonenumber = data['data'].Phonenumber;
		userProfile.userDetails.Email = data['data'].Email;
		userProfile.userDetails.AccountStatus = data['data'].Status;
		userProfile.userExtras.ProgressStatus = data['data'].ProgressStatus;
        if(data['data'].ProfilePic){
            userProfile.userExtras.ProfilePic = data['data'].ProfilePic;
        }else{
            userProfile.userExtras.ProfilePic = 'assets/images/profile-img.jpg'
        }
		
    }
    profileTab('viewProfile')
    
}

function prepareProfileUpload(data){
    if (data) {
        stopLoad()
        try{
            JSON.parse(data);
        }catch(err){
            toastr.error('An error occured while verfying user information.')
            console.dir(err);
            return false;
        }
        
        data = JSON.parse(data);
        if(data['status'] == 200){
            toastr.success(data['message'])
            if(confirm('would you like to logout to refresh your account?')){
                logout();
            }else{
                return false;
            }
        }else{
            toastr.error('An error occured while updating profile.')            
        }
        
        
        return false;
        
    }
    var files = '';
    files = document.getElementById('ProfileUpload').files[0]
    if(files){
        var ProfileUpload = renda.fileToBase64(files);
        ProfileUpload.then(function(result) {
            userProfile.userExtras.ProfilePic = result
            ProfileUpload = result.replace(/^data:image\/[a-z]+;base64,/, "");
            sendRegReq()
        });
    }else{
        toastr.error('Please Select An Image');
        return false;
    }
    function sendRegReq(){
        var confirmUpload = window.confirm('Your profile picture is about to be updated. Continue?')
        if(confirmUpload){
            data = {
                "ProfilePic":ProfileUpload,
                "UserId":sessionStorage.UserId
            } 
            if (validateObj(data)){
                console.dir(data)
                startLoad()
                renda.post("/user/update",JSON.stringify(data),'prepareProfileUpload');     
            }else{
                return false;
            }
        }else{
            return false;
        }
    }    
}

function prepareContactForm(){

}
function submitContactForm(data){
    if (data) {
        stopLoad()
        try{
            JSON.parse(data);
        }catch(err){
            toastr.error('An error occured while performing requeest.')
            console.dir(err);
            return false;
        }
        
        data = JSON.parse(data);
        if(data['status'] == 200){
            toastr.success('Thank you for contacting us. We will get back to you shortly')
        }else{
            toastr.error('An error occured, Please try again later.')            
        }
        return false;
        
    }
    if($('#FullName').val()&&$('#PhoneNumber').val()&&$('#Email').val()&&$('#Message').val()){

    }else{
        toastr.error('Please Provide All Fields');
        return false;
    }
    var confirmUpload = window.confirm('Submit Contact Form?')
    if(confirmUpload){
        var confirmData = {
            "FullName":$('#FullName').val(),
            "PhoneNumber":$('#PhoneNumber').val(),
            "Email":$('#Email').val(),
            "ContactOption":$('#ContactOption').val(),
            "Message":$('#Message').val(),
        } 
        
        data = {
            "name": confirmData.FullName,
            "phone": confirmData.PhoneNumber,
            "email": confirmData.Email,
            "subject":""+ confirmData.ContactOption+" From "+ confirmData.FullName,
            "message":confirmData.Message
        }
        console.dir(data)            
        startLoad()
        renda.post("/sendContactMessage",JSON.stringify(data),'prepareProfileUpload');     
       
    }else{
        return false;
    }
      
}