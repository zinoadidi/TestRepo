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
renda.get('/cards/'+sessionStorage.UserId,'updateCardList','cards');

renda.loader('stop')
$('.frequency-depend').hide();
$('.frequencies').hide();
goalTab('viewSingleGoal')

function clear(){
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
            JSON.parse(data);
        }catch(err){
        	stopLoad()
            toastr.error('An error occured while verfying user information.')
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
		startLoad()
		var files = '';
		var url = '/new/goal';   
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
			GoalUpload = undefined;
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
			
			var data = {
				"UserId":sessionStorage.UserId,
				"ItemName":createGoalApp.cgvm.ItemName,
				"GoalAmount":createGoalApp.cgvm.GoalAmount,
				"Duration":parseInt(createGoalApp.cgvm.GoalAmount) / parseInt(createGoalApp.cgvm.MonthlyDeduction),
				"MonthlyDeduction":createGoalApp.cgvm.MonthlyDeduction,
				"ProductId":'1',
				"GoalType":'custom',
				"monthDays" : createGoalApp.cgvm.monthDays,
				"weekDays" : createGoalApp.cgvm.weekDays,
				"Day":createGoalApp.cgvm.Day,
				"Frequency":createGoalApp.cgvm.Frequency,
				"GoalImage":GoalUpload,
				"Status":"active",
				"ItemDescription" : createGoalApp.cgvm.ItemDescription,
				"CardId" : createGoalApp.cgvm.userCards.CardNo,
				"ProductId":"1",
				"CardToken" : createGoalApp.cgvm.userCards.CardToken
			}  
	        if (validateObj(data)){
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
	var goarArray = viewGoalApp.commonData.Dashboard.goals;
	goarArray.forEach( function (arrayItem)
	{
		if(arrayItem.GoalId == id){
			singleGoalApp.sgdata = arrayItem;
			
			if(singleGoalApp.sgdata.GoalImage){

			}else{
				singleGoalApp.sgdata.GoalImage = 'secured/assets/img/goalBackground.png'
			}
		}else{}
	});
	goalTab('viewSingleGoal')	
}

function goalTab(tab){
	$('.goalTabs').hide()
	$('#'+tab).show()
}
function updateCardList(data){
	data = JSON.parse(data);
	sessionStorage.userCards = JSON.stringify(data);
	if(data['data']){
		isCard = true;
		createGoalApp.cgvm.userCards = data['data'];		
	}else{
		var confirmCreateCard = confirm('Hi. You have not added a payment method, Please click ok to add a card');
		if(confirmCreateCard){
			renda.component('card','view','dashboardDisplayDiv');
		}else{
			isCard = false;
			goalTab('viewGoals')
		}
		return false;
	}
	
	console.log(data)
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

function goalOptions(id,reqType){
	if(reqType){
		stopLoad()
		data = JSON.parse(id);
		if(data['status'] ==200){
			if(data['data']){
				toastr.success(data['message'])
				singleGoalApp.sgdata = data['data']
				return false
			}else{
				toastr.warning(data['message'])
				clear()
			}
		}else{
			toastr.error(data['message'])			
			return false;
		}
	}else{
		var goal = singleGoalApp.sgdata; 
		var data = '';
		if(id == "Edit_Goal"){
			singleGoalApp.sgdata.userCards = createGoalApp.cgvm.userCards
			$('#extendedGoalUI').show()
			$('.extendGoalDivs').hide()
			$('#editGoal').show()
			//bhvgh
			return false;
		}
		if(id == "Top_Up"){
			singleGoalApp.sgdata.userCards = createGoalApp.cgvm.userCards
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
			if(id == "Suspend_Goal"){
				renda.get('/goal/suspend/' + goal.GoalId, 'goalOptions', 'success');			
				return false
			}
			if(id == "Resume_Goal"){
				renda.get('/goal/resume/' + goal.GoalId, 'goalOptions', 'success');							
				return false
			}
			if(id == "Delete_Goal"){
				renda.get('/goal/delete/' + goal.GoalId, 'goalOptions', 'success');											
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
		startLoad()
		createGoalApp.cgvm = singleGoalApp.sgdata;
		var files = '';
		var url = '/goal/update';   
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
			
			var data = {
				"AppUserId":sessionStorage.UserId,
				"GoalId":singleGoalApp.sgdata.GoalId,
				"ItemName":createGoalApp.cgvm.ItemName,
				"GoalAmount":createGoalApp.cgvm.GoalAmount,
				"Duration":parseInt(createGoalApp.cgvm.GoalAmount) / parseInt(createGoalApp.cgvm.MonthlyDeduction),
				"MonthlyDeduction":createGoalApp.cgvm.MonthlyDeduction,
				"ProductId":'CustomProduct',
				"AmountAttained":singleGoalApp.sgdata.AmountAttained,
				"Status":singleGoalApp.sgdata.Status,
				"DateCreate":singleGoalApp.sgdata.DateCreated,
				"GoalType":'custom',				
				"Day":createGoalApp.cgvm.Day,
				"Frequency":createGoalApp.cgvm.Frequency,
				"GoalImage":GoalUpload
				
				/* "monthDays" : createGoalApp.cgvm.monthDays,
				"weekDays" : createGoalApp.cgvm.weekDays,
				"ItemDescription" : createGoalApp.cgvm.ItemDescription,
				"CardId" : createGoalApp.cgvm.userCards.CardNo,
				"ProductId":"1",
				"CardToken" : createGoalApp.cgvm.userCards.CardToken */
			}  
			if (validateObj(data)){
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
			url = '/goal/topup';
			var element = $('#topUpCards').find('option:selected'); 
			var cardToken = element.attr('fwCode');
			
			var data = {
				"UserId":sessionStorage.UserId,
				"GoalId":singleGoalApp.sgdata.GoalId,
				"GoalAmount":$('#GoalAmount').val(),
				"CardToken" : cardToken
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
			url = '/wallet/transferToWallet';
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
		url = '/goal/moveExess';
		var data = {
			
			"GoalId":singleGoalApp.sgdata.GoalId,
			"Excess":$('#excessAmount').val()
			
		}  
		if(data.Amount){
		}else{
			toastr.warning('Please Enter Amount')
			return false;
		}
		
		if (validateObj(data)){
			startLoad()
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

function transferToWallet(){
	
}