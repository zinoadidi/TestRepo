viewGoalApp = new Vue({
  el: '#viewGoals',
  data: {
	commonData:commonData	 
  }
});
createGoalApp = new Vue({ 
	el: '#createGoalDivApp',
  data: {
      cgvm: new Goal(null) 
  	}
}); 
var singleGoalApp = new Vue({
	el: '#viewSingleGoal',
	data: {
	  sgdata: new Goal(null)
	}
  });
var isCard = '';

/*createGoalApp.cgvm.UserId = sessionStorage.UserId*/
//renda.get('/dashboardData/'+sessionStorage.UserId,'updateGoalList');
/* if (option == 'new') {
	data = JSON.parse(data);
	sessionStorage.dashboardData = JSON.stringify(data);
	commonData.Dashboard = data['data']
	commonData.User = payday.user
	navApp.data = commonData;
	dashboardApp.data = commonData;
	stopLoad()
} */

renda.loader('stop')
$('.frequency-depend').hide();
$('.frequencies').hide();
goalTab('viewSingleGoal')

function clear(){
	loadDashboardData(null,'dashData')		
	renda.component('goals','goal','dashboardDisplayDiv')
}
function onChangeInput(arg) {
	console.log(arg)
	return false;
	    if(arg === 'Weekly') 
	    {
	       $('.frequency-depend').fadeIn();
	       $('.frequencies').hide();
	       $('#weekDays').show();
	       createGoalApp.cgvm.Duration = $('#custom-duration').val() +' Weeks';
	    }
	    
	    if(arg =='Daily') 
	    {
	       $('.frequency-depend').hide();
	       $('.frequencies').hide();
	       createGoalApp.cgvm.Duration = $('#custom-duration').val() +' Days';
	    }

	    if(arg=='Monthly') 
	    {
	       $('.frequency-depend').fadeIn();
	       $('.frequencies').hide();
	       $('#monthDays').show();
	       createGoalApp.cgvm.Duration = $('#custom-duration').val() +' Months';
	    }
}
function createGoal(data){
    if(data){
    	renda.loader('stop');
    	try{
            data = JSON.parse(data);
        }catch(err){
        	stopLoad()
            toastr.error('An error occured while creating goal. Please try again later.')
            console.dir(err);
            return false;
        }
    	stopLoad();
		data = modResult(data)
    	if (data.data.AppUserId){			
			toastr.success('Weldone!. Goal was created successfully')
			data.data.Firstname = payday.user.Firstname;
			data.data.Email = payday.user.Email;
			
			sendEmail('createGoal',data);
			clear();
		}else{
            toastr.error('Request failed. Please try again');    
		}           
		return false;
    }else{
		startLoad()
		var files = '';
		var url = 'Goal/Create';   
    	files = document.getElementById('GoalUpload').files[0]
		console.log('---------------------before send')
		var GoalUpload = '';
		if(files){
			GoalUpload = renda.fileToBase64(files);			
			GoalUpload.then(function(result) {
				GoalUpload = result.replace(/^data:image\/[a-z]+;base64,/, "");
				console.log(result)
				uploadGoalImage();
			});
		}else{
			GoalUpload = undefined;
			sendGoalReq()
		}
		function uploadGoalImage(data){
			if(data){
				stopLoad()
				data = JSON.parse(data)				
				//if()
				sendGoalReq();
			}else{
				startLoad()
				var data = {"ProfilePic":GoalUpload}
				renda.post('paydaypayment/uploadimage',JSON.stringify(data),'createGoal.uploadGoalImage')				
			}
		}
		function sendGoalReq(){
			console.log('ready to lunch')
			if (createGoalApp.cgvm.Day) {}else{
				createGoalApp.cgvm.Day = createGoalApp.cgvm.weekDays
				if (createGoalApp.cgvm.Day) {}else{
					createGoalApp.cgvm.Day = createGoalApp.cgvm.monthDays
					createGoalApp.cgvm.weekDays = '0'
				}
			}
			if (createGoalApp.cgvm.userCards.CardNo) {}else{
				alert('Please select a card. If you have not added a card yet, please add one before creating a goal');
				stopLoad()
				return false;
			}
			if (createGoalApp.cgvm.monthDays) {}else{
				createGoalApp.cgvm.monthDays = '0'
			}
			try {var _duration =parseInt(createGoalApp.cgvm.GoalAmount.replace(",","")) / parseInt(createGoalApp.cgvm.MonthlyDeduction.replace(",",""))}
			catch(ex){
				var _duration =parseInt(createGoalApp.cgvm.GoalAmount) / parseInt(createGoalApp.cgvm.MonthlyDeduction)
			}
			try {var GoalAmount =parseInt(createGoalApp.cgvm.GoalAmount.replace(",",""))}
			catch(ex){
				var GoalAmount =parseInt(createGoalApp.cgvm.GoalAmount)
			}
			try {var MonthlyDeduction =parseInt(createGoalApp.cgvm.MonthlyDeduction.replace(",",""))}
			catch(ex){
				var MonthlyDeduction =parseInt(createGoalApp.cgvm.MonthlyDeduction)
			}
			var dateCreated = new Date();
			var data = {
				"UserId":sessionStorage.UserId,
				"AppUserId":sessionStorage.UserId,
				"ItemName":createGoalApp.cgvm.ItemName,
				"GoalAmount":GoalAmount,
				"MonthlyDeduction":MonthlyDeduction,
				"Duration":_duration.toString(),				
				"ProductId":"custom",
				"GoalType":"custom",
				"DateCreated":dateCreated.toJSON(),
				"monthDays" : createGoalApp.cgvm.monthDays,
				"weekDays" : createGoalApp.cgvm.weekDays,
				"Day":createGoalApp.cgvm.Day,
				"Frequency":createGoalApp.cgvm.Frequency,
				"GoalImage":GoalUpload,
				"Status":"active",
				"ItemDescription" : createGoalApp.cgvm.ItemDescription,
				"CardId" : createGoalApp.cgvm.userCards.CardNo,
				"CardToken" : createGoalApp.cgvm.userCards.CardToken
			}  
	        if (validateObj(data)){
				data = JSON.stringify(data)
	            renda.post(url,JSON.stringify(data),'createGoal');     
	        }else{
	        	console.log('error occured');
	        	console.dir(data)
				stopLoad()
				return false;
	        }
		}        
	}
}

function viewSingleGoal(id){
	if(sessionStorage.userCards){
		updateCardList(JSON.stringify(sessionStorage.userCards))	
	 }
	console.log('id:',id)
	if(typeof(id) !== null && typeof id === 'object'){
		singleGoalApp.sgdata = id;
		if(singleGoalApp.sgdata.GoalImage){
		}else{
			singleGoalApp.sgdata.GoalImage = 'secured/assets/img/goalBackground.png'
		}	
	}else{
		var goarArray = viewGoalApp.commonData.Dashboard.goals;
		goarArray.forEach( function (arrayItem){
			if(arrayItem.GoalId == id){
				singleGoalApp.sgdata = arrayItem;
				if(singleGoalApp.sgdata.GoalImage){

				}else{
					singleGoalApp.sgdata.GoalImage = 'secured/assets/img/goalBackground.png'
				}
			}else{}
		});
	}
	goalTab('viewSingleGoal')	
} 

function goalTab(tab){
	$('.goalTabs').hide()
	$('#'+tab).show()
}
function updateCardList(data){
	try{
		data = JSON.parse(data);
		data = JSON.parse(data);
		
		data = modResult(data);
		console.log("=====================================================")
		console.log(data)
		if(data['data']){
			isCard = true;
			createGoalApp.cgvm.userCards = data['data'];
			singleGoalApp.sgdata.userCards = "";	
			singleGoalApp.sgdata.userCards = data['data']
		}else{
			var confirmCreateCard = confirm('Hi. You have not added a payment method, Please click ok to add a card');
			if(confirmCreateCard){
				renda.component('card','view','dashboardDisplayDiv');
			}else{
				isCard = false;
				goalTab('viewGoals')
			}
		}
	  }catch(err){
		console.dir(err);
		var confirmCreateCard = confirm('Hi. You have not added a payment method, Please click ok to add a card');
		if(confirmCreateCard){
			renda.component('card','view','dashboardDisplayDiv');
		}else{
			isCard = false;
			goalTab('viewGoals')
		}
	  }
	  return false;
}
goalTab('viewGoals')

function onChangeCard(){
	var element = $('#cards').find('option:selected'); 
	createGoalApp.cgvm.userCards.CardNo = element.attr('id');
	createGoalApp.cgvm.userCards.CardToken = element.attr('fwCode');
	var data = JSON.parse(sessionStorage.userCards);
	if(isCard == false){
		var confirmCreateCard = confirm('Hi. You have not added a payment method, Please click ok to add a card');
		if(confirmCreateCard){
			renda.component('card','view','dashboardDisplayDiv');
		}else{
			isCard = false;
			goalTab('viewGoals')
		}	
	}else{
		
	}
}

function onChangeCardEdit(){

	var element = $('#cardsEdit').find('option:selected'); 
	createGoalApp.cgvm.userCards.CardNo = element.attr('id');
	createGoalApp.cgvm.userCards.CardToken = element.attr('fwCode');
	var data = JSON.parse(sessionStorage.userCards);
	if(isCard == false){
		var confirmCreateCard = confirm('Hi. You have not added a payment method, Please click ok to add a card');
		if(confirmCreateCard){
			renda.component('card','view','dashboardDisplayDiv');
		}else{
			isCard = false;
			goalTab('viewGoals')
		}	
	}else{
		
	}
}

function calculateGoalDuration(){
	var _duration =parseInt(createGoalApp.cgvm.GoalAmount.replace(",","")) / parseInt(createGoalApp.cgvm.MonthlyDeduction.replace(",",""))
	createGoalApp.cgvm.Duration = _duration;
}

function goalOptions(id,reqType){
	
	if(reqType){
		stopLoad()
		console.log(reqType)
		if(reqType == 'delete'){
			if(id == true || id == 'true'){
				clear()
			}else{
				toastr.error(id)
			}

		}
		try{
            JSON.parse(id);
        }catch(err){
            toastr.error(id)
            console.dir(err);
			
			return false;			
        }
		var data = JSON.parse(id);
		data = modResult(data)

		if(data['data']){
			toastr.success('Goal Updated Successful')
			singleGoalApp.sgdata = data['data']
			data.data.Firstname = payday.user.Firstname;
			data.data.Email = payday.user.Email;
			sendEmail('editGoal',data);
			
		}else{
			toastr.warning(data)
		}
		return false
	}else{
		var goal = singleGoalApp.sgdata; 
		var data = '';
		if(id == "Edit_Goal"){
			
			singleGoalApp.sgdata.userCards = createGoalApp.cgvm.userCards
			$('#extendedGoalUI').show()
			$('.extendGoalDivs').hide()
			$('#editGoal').show()
			if(createGoalApp.cgvm.userCards){
				var counter = 0;
				for(counter = 0; counter < createGoalApp.cgvm.userCards.length; counter++){
					var cards = createGoalApp.cgvm.userCards[counter]
					$('#cardsEdit').append("<option fwCode='"+cards.FWCode+"' id='"+cards.Id+"'>"+cards.CardNo+ "</option>")					
				}
			}
			

			return false;
		}
		if(id == "Top_Up"){
			singleGoalApp.sgdata.userCards = createGoalApp.cgvm.userCards
			if(createGoalApp.cgvm.userCards){
				var counter = 0;
				for(counter = 0; counter < createGoalApp.cgvm.userCards.length; counter++){
					var cards = createGoalApp.cgvm.userCards[counter]
					$('#topUpCards').append("<option fwCode='"+cards.FWCode+"' id='"+cards.Id+"'>"+cards.CardNo+ "</option>")					
				}
			}
			$('#extendedGoalUI').show()
			$('.extendGoalDivs').hide()			
			$('#topUpGoal').show()
			//bhvgh
			return false;
		}
		if(id == "More_Options"){
			$('#moreOptionsDiv').toggle();
			return false;
		}
		if(id == "Redeem_Goal"){
			$('#extendedGoalUI').show()
			$('.extendGoalDivs').hide()
			$('#redeemGoal').show()
			return false;
		}
		if(id == "Part_Withdrawal"){
			$('#extendedGoalUI').show()
			$('.extendGoalDivs').hide()
			$('#partWithdrawalGoal').show()
			return false;
		}
		if(id == "Move_Excess"){
			$('#extendedGoalUI').show()
			$('.extendGoalDivs').hide()
			$('#moveExcess').show()
			return false;
		}
		if(id == "Transfer_To_Wallet"){
			$('#extendedGoalUI').show()
			$('.extendGoalDivs').hide()
			$('#transferToWallet').show()
			return false;
		}
		
		var confirmAction = confirm('You are about to '+id+'. Continue?')
		if(confirmAction){
			startLoad()
			data = singleGoalApp.sgdata;
			if(id == "Suspend_Goal"){
				data.Status = 'Suspended';
				data = JSON.stringify(data);							
				renda.post('Goal/Update', JSON.stringify(data), 'goalOptions',null,null, 'success');			
				return false
			}
			if(id == "Resume_Goal"){
				data.Status = 'Active';		
				data = JSON.stringify(data);									
				renda.post('Goal/Update', JSON.stringify(data), 'goalOptions',null,null, 'success');							
				return false
			}
			if(id == "Delete_Goal"){
				data = {
					"GoalId":singleGoalApp.sgdata.GoalId
				};
				data = JSON.stringify(data);			
				renda.post('Goal/Delete', JSON.stringify(data), 'goalOptions',null,null, 'delete');											
				return false
			}
			if(id == "Top_Up"){
				
			}
			
			stopLoad()
		}else{
			return false;
		}	
	}
	
}

function editGoal(data){
	if(data){
		renda.loader('stop');
		try{
			JSON.parse(data);
		}catch(err){
			stopLoad()
			toastr.error('An error occured while verfying user information.')
			console.dir(err);
			return false;
		}
		stopLoad();
		data = JSON.parse(data);
		data= modResult(data)
		if (data.status == 200){
			toastr.success('Goal Edited Successfuly')
			data.data.Email = payday.user.Email;
			data.data.Firstname = payday.user.Firstname;
			
			sendEmail('editGoal',data)
			clear();
		}else{
			if(data['message']){
				toastr.error(data['message']);    
			}else{
				toastr.error(data); 
			}
		}           
		return false;
	}else{
		startLoad()
		createGoalApp.cgvm = singleGoalApp.sgdata;
		var files = '';
		var url = 'Goal/Update';   
		files = document.getElementById('GoalUpload').files[0]
		console.log('---------------------before send')
		var GoalUpload = '';
		if(files){
			GoalUpload = renda.fileToBase64(files);			
			GoalUpload.then(function(result) {
				GoalUpload = result.replace(/^data:image\/[a-z]+;base64,/, "");
				console.log(result)
				sendGoalReq();
			});
		}else{
			GoalUpload = singleGoalApp.sgdata.GoalImage;
			sendGoalReq()
		}
		
		function sendGoalReq(){
			console.log('ready to lunch')
			if (createGoalApp.cgvm.Day) {}else{
				createGoalApp.cgvm.Day = createGoalApp.cgvm.weekDays
				if (createGoalApp.cgvm.Day) {}else{
					createGoalApp.cgvm.Day = createGoalApp.cgvm.monthDays
					createGoalApp.cgvm.weekDays = '0'
				}
			}
			if (createGoalApp.cgvm.userCards.CardNo) {}else{
				alert('Please select a card. If you have not added a card yet, please add one before creating a goal');
				stopLoad()
				return false;
			}
			if (createGoalApp.cgvm.monthDays) {}else{
				createGoalApp.cgvm.monthDays = '0'
			}
			
			try {var _duration =parseInt(createGoalApp.cgvm.GoalAmount.replace(",","")) / parseInt(createGoalApp.cgvm.MonthlyDeduction.replace(",",""))}
			catch(ex){
				var _duration =parseInt(createGoalApp.cgvm.GoalAmount) / parseInt(createGoalApp.cgvm.MonthlyDeduction)
			}
			try {var GoalAmount =parseInt(createGoalApp.cgvm.GoalAmount.replace(",",""))}
			catch(ex){
				var GoalAmount =parseInt(createGoalApp.cgvm.GoalAmount)
			}
			try {var MonthlyDeduction =parseInt(createGoalApp.cgvm.MonthlyDeduction.replace(",",""))}
			catch(ex){
				var MonthlyDeduction =parseInt(createGoalApp.cgvm.MonthlyDeduction)
			}
			var data = {
				"GoalId":singleGoalApp.sgdata.GoalId,
				"AppUserId":sessionStorage.UserId,
				"ItemName":createGoalApp.cgvm.ItemName,
				"GoalAmount":GoalAmount,
				"MonthlyDeduction":MonthlyDeduction,
				"Duration":_duration.toString(),				
				"ProductId":singleGoalApp.sgdata.ProductId,
				"GoalType":singleGoalApp.sgdata.GoalType,
				"monthDays" : createGoalApp.cgvm.monthDays,
				"weekDays" : createGoalApp.cgvm.weekDays,
				"Day":createGoalApp.cgvm.Day,
				"Frequency":createGoalApp.cgvm.Frequency,
				"GoalImage":singleGoalApp.sgdata.GoalImage,
				"Status":singleGoalApp.sgdata.Status,
				"ItemDescription" : createGoalApp.cgvm.ItemDescription,
				"CardId" : createGoalApp.cgvm.userCards.CardNo,
				"CardToken" : createGoalApp.cgvm.userCards.CardToken,
				"DateCreated" : createGoalApp.cgvm.userCards.DateCreated,
				"AmountAttained" : createGoalApp.cgvm.userCards.AmountAttained,
				"ExcessFund" : createGoalApp.cgvm.userCards.ExcessFund
			}  
			if (validateObj(data)){
				data = JSON.stringify(data)
				renda.post(url,JSON.stringify(data),'editGoal');     
			}else{
				console.log('error occured');
				console.dir(data)
				stopLoad()
				return false;
			}
		}        
	}

}

function freqChange(){
	var currentVal = $('#frequency').val()

}

function Top_Up_Goal(data,option){
	if(data){
		renda.loader('stop');
		try{
			JSON.parse(data);
		}catch(err){
			stopLoad()
			toastr.error('An error occured while performing request.')
			if(data){
				if(data.length<70){
					alert(data)
				}else{

				}
				
			}
			console.dir(err);
			return false;
		}
		stopLoad();
		data = JSON.parse(data);
		if (data.status == 200){
			renda.get('/dashboardData/'+sessionStorage.UserId,'stats','new');				
			toastr.success(data['message'])
			clear();
			updateDataFromApi(null)
		}else{
			toastr.error(data['message']);    
		}           
		return false;
	}else{
		if(option == 'card'){
			url = 'paydaypayment/goal/topup';
			var element = $('#topUpCards').find('option:selected'); 
			var cardToken = element.attr('fwCode');
			
			var data = {
				"UserId":sessionStorage.UserId,
				"UserId":sessionStorage.UserId,
				"GoalId":singleGoalApp.sgdata.GoalId,
				"GoalAmount":$('#GoalAmount').val(),
				"CardToken" : cardToken,
				"MembershipNumber":sessionStorage.UserId
			}  
			if(data.GoalAmount){
			}else{
				toastr.warning('Please Enter Amount')
				return false;
			}
			if(data.CardToken){
				
			}else{
				toastr.warning('Select a card to top up with. If you do not have a card on your account yet, please add one to continue')			
				return false;
			}
			if (validateObj(data)){
				startLoad()
				renda.post(url,JSON.stringify(data),'Top_Up_Goal');     
			}else{
				console.log('error occured');
				console.dir(data)
				stopLoad()
				return false;
			} 
			return false;       
		}
		if(option == 'wallet'){
			url = 'Goal/WallettoGoal';
			var element = $('#topUpCards').find('option:selected'); 
			var cardToken = element.attr('fwCode');
			
			var data = {
				"UserId":sessionStorage.UserId,
				"GoalId":singleGoalApp.sgdata.GoalId,
				"Amount":$('#walletAmount').val()
			}  
			if(data.Amount){
			}else{
				toastr.warning('Please Enter Amount')
				return false;
			}
			
			if (validateObj(data)){
				startLoad()
				data = JSON.stringify(data)
				renda.post(url,JSON.stringify(data),'Top_Up_Goal');     
			}else{
				console.log('error occured');
				console.dir(data)
				stopLoad()
				return false;
			} 
			return false;       
		}
	}
}

function redeemGoal(data){
	if(data){
		renda.loader('stop');
		try{
			JSON.parse(data);
		}catch(err){
			stopLoad()
			toastr.error('An error occured while performing request.')
			console.dir(err);
			return false;
		}
		stopLoad();
		data = JSON.parse(data);
		if (data.status == 200){
			renda.get('/dashboardData/'+sessionStorage.UserId,'stats','new');				
			toastr.success(data['message'])
			clear();
			updateDataFromApi(null)
		}else{
			toastr.error(data['message']);    
		}           
		return false;
	}else{
		url = '/goal/redeem';
		var data = {
			"UserId":sessionStorage.UserId,
			"GoalId":singleGoalApp.sgdata.GoalId,
			"Amount":$('#RedeemAmount').val(),
			"Reason":$('#RedeemReason').val(),
			"OTP":payday.user.Token,
			"RedemptionType":'Redemption',
			"GoalType":singleGoalApp.sgdata.GoalType
		}  
		if(data.Amount){
		}else{
			toastr.warning('Please Enter Amount')
			return false;
		}
		if(data.Reason){
			
		}else{
			toastr.warning('Please Provide Reason For Redemption')			
			return false;
		}
		if (validateObj(data)){
			startLoad()
			renda.post(url,JSON.stringify(data),'redeemGoal');     
		}else{
			console.log('error occured');
			console.dir(data)
			stopLoad()
			return false;
		} 
		return false;       
	}
}

function partWithdrawal(data){
	if(data){
		renda.loader('stop');
		try{
			JSON.parse(data);
		}catch(err){
			stopLoad()
			toastr.error('An error occured while performing request.')
			console.dir(err);
			return false;
		}
		stopLoad();
		data = JSON.parse(data);
		if (data.status == 200){
			renda.get('/dashboardData/'+sessionStorage.UserId,'stats','new');				
			toastr.success(data['message'])
			clear();
			updateDataFromApi(null)
		}else{
			toastr.error(data['message']);    
		}           
		return false;
	}else{
		url = '/goal/redeem';
		var data = {
			
			"GoalId":singleGoalApp.sgdata.GoalId,
			"Amount":$('#partAmount').val()
			
		}  
		if(data.Amount){
		}else{
			toastr.warning('Please Enter Amount')
			return false;
		}
		
		if (validateObj(data)){
			startLoad()
			renda.post(url,JSON.stringify(data),'partWithdrawal');     
		}else{
			console.log('error occured');
			console.dir(data)
			stopLoad()
			return false;
		} 
		return false;       
		
	}
}

function moveExcess(data){
	if(data){
		renda.loader('stop');
		try{
			JSON.parse(data);
		}catch(err){
			stopLoad()
			toastr.error('An error occured while performing request.')
			alert(data)
			console.dir(err);
			return false;
		}
		stopLoad();
		data = JSON.parse(data);
		if (data){
			//renda.get('/dashboardData/'+sessionStorage.UserId,'stats','new');				
			toastr.success(data)
			clear();
			updateDataFromApi(null)
		}else{
			toastr.error(data);    
		}           
		return false;
	}else{
		url = 'Goal/ExcessFund';
		var data = {
			
			"GoalId":singleGoalApp.sgdata.GoalId,
			"Amount":$('#excessAmount').val()
			
		}  
		if(data.Amount){
		}else{
			toastr.warning('Please Enter Amount')
			return false;
		}
		
		if (validateObj(data)){
			startLoad()
			data = JSON.stringify(data);
			renda.post(url,JSON.stringify(data),'moveExcess');     
		}else{
			console.log('error occured');
			console.dir(data)
			stopLoad()
			return false;
		} 
		return false;       
		
	}
}

function topUpOptionsTab(tab){
	$('.topUpOptions').hide()
	$('#'+tab).show()
}

function transferToWallet(data){
	if(data){
		renda.loader('stop');
		try{
			JSON.parse(data);
		}catch(err){
			stopLoad()
			toastr.error('An error occured while performing request.')
			if(data){
				
				alert(data)
				
			}
			console.dir(err);
			return false;
		}
		stopLoad();
		data = JSON.parse(data);
		if (data){
			//renda.get('/dashboardData/'+sessionStorage.UserId,'stats','new');				
			toastr.success(data)
			clear();
			updateDataFromApi(null)
		}else{
			toastr.error(data);    
		}           
		return false;
	}else{
		
		url = 'Goal/PartWithdrawal';
		
		
		var data = {
			"UserId":sessionStorage.UserId,
			"GoalId":singleGoalApp.sgdata.GoalId,
			"Amount":$('#walletTransferAmount').val()
		}  
		if(data.Amount){
		}else{
			toastr.warning('Please Enter Amount')
			return false;
		}
		
		if (validateObj(data)){
			startLoad()
			data = JSON.stringify(data)
			renda.post(url,JSON.stringify(data),'transferToWallet');     
		}else{
			console.log('error occured');
			console.dir(data)
			stopLoad()
			return false;
		} 
		return false;       
		
	}
}

 function updateGoalList(data){
	viewGoalApp.commonData.Dashboard.goals.push(data)
 }

 if(sessionStorage.userCards){
	updateCardList(JSON.stringify(sessionStorage.userCards))	
 }else{
	renda.post('PaymentDetails/FetchPaymentDetails',JSON.stringify(JSON.stringify({'UserId':sessionStorage.UserId})),'updateCardList');
 }
 