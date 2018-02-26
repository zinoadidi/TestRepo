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
function openImgHolder(){
	document.getElementById('GoalUploadCreate').click()
	
}

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
var ___duration = 0;
function onChangeInput(arg) {

	arg = $('#frequency').val()
	createGoalApp.cgvm.Frequency = arg;
	calculateGoalDuration()
	//console.log(arg)
	addCommaToGoal('monthly-deduct1')
	addCommaToGoal('goal-amount1')
	return false;
}
var rawGoalImage = '';
function prepareGoalUpload(files){
	files = document.getElementById('GoalUploadCreate').files[0]
    if(files){
        rawGoalImage = renda.fileToBase64(files);
        rawGoalImage.then(function(result) {
            createGoalApp.cgvm.GoalImage = result
            rawGoalImage = result.replace(/^data:image\/[a-z]+;base64,/, "");
        });
    }else{
        toastr.error('Please Select An Image');
        return false;
	}
	return false;
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
			toastr.success('Weldone!. Goal created successfully')
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
    	files = document.getElementById('GoalUploadCreate').files[0]
		//console.log('---------------------before send')
		var GoalUpload = '';
		if(files){
			GoalUpload = renda.fileToBase64(files);			
			GoalUpload.then(function(result) {
				GoalUpload = result.replace(/^data:image\/[a-z]+;base64,/, "");
				/* //console.log('===============================goal image')
				//console.log(result) */
				uploadGoalImage();
			});
		}else{
			//console.log('got here=======no image')
			GoalUpload = undefined;
			sendGoalReq()
		}
		function uploadGoalImage(data){
			if(data){
				stopLoad()
				//console.log(data)
				//newdata = JSON.parse(data)	
				try {
					var ndata = JSON.parse(data);
					data = ndata;
				} catch (error) {
					//console.log('Failed to parse',data)
				}
				GoalUpload = data['data'].imagepath
				//console.log(GoalUpload)	
				//if()
				sendGoalReq();
			}else{
				startLoad()
				var data = {"ProfilePic":GoalUpload};
				//console.log(data)
				var url = renda.Config.serverUrl+'paydaypayment/image-upload';
				promiseXmlHTTP({
					url:url,
					method:'POST',
					data:JSON.stringify(data),
					headers:{
						"Authorization": "Basic " + paydayWebAuthToken,
						"Content-Type": "application/json",
						"Accept": "application/json",
						"Access-Control-Allow-Credentials":"true"
					}
				}).then(function(result){
					uploadGoalImage(JSON.stringify(result))
				});
			}
		}
		function sendGoalReq(){
			//console.log('ready to lunch')
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
			if (createGoalApp.cgvm.ItemName) {}else{
				alert('Please Enter Goal Name');
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

			//knock out item discription on new create goal form
			createGoalApp.cgvm.ItemDescription = createGoalApp.cgvm.ItemName

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
				console.dir(data)				
				data = JSON.stringify(data)
				startLoad()				
	            renda.post(url,JSON.stringify(data),'createGoal');     
	        }else{
	        	//console.log('error occured');
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
	//console.log('id:',id)
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
		//console.log("=====================================================")
		//console.log(data)
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
var __duration =0;
function calculateGoalDuration(){
	var goalAmount = createGoalApp.cgvm.GoalAmount.replace(/\,/g, '');
	//console.log('Here comes goalAmount',goalAmount)
	
	var monthlyDeduct = createGoalApp.cgvm.MonthlyDeduction.replace(/\,/g, '');
	//console.log('Here comes monthlyDeduct',monthlyDeduct)
	
	__duration = parseInt(goalAmount) / parseInt(monthlyDeduct)
	createGoalApp.cgvm.Duration= Math.round(__duration * 100) / 100;
	//console.log('Here comes duration',__duration)
}

function addCommaToGoal(id){
	
	var newValue = $('#'+id).val()
	newValue = newValue.replace(/\,/g, '');
	newValue = newValue.replace(/\./g, '');
	if(newValue){
		newValue = addCommas(newValue);
	}else{
		if(newValue == '' || parseInt(newValue)==NaN || newValue=='NaN'){
			newValue = '';
		}else{newValue = 0;}
	}
	if(newValue == '' || parseInt(newValue)==NaN || newValue=='NaN'){
		newValue = '';
	}
	//newValue = newValue.replace(/\,/g, '.');
	/* if(newValue == NaN || newValue == null){
		newValue = 0;
	} */
	document.getElementById(id).value = newValue;
	///////////////////
		newValue = newValue = $('#monthly-deduct1').val()
		newValue = newValue.replace(/\,/g, '');
		newValue = newValue.replace(/\./g, '');
		createGoalApp.cgvm.MonthlyDeduction = newValue;
		
		newValue = addCommas(newValue);
		if(newValue == '' || parseInt(newValue)==NaN || newValue=='NaN'){
			newValue = '';
		}
		document.getElementById('monthly-deduct1').value = newValue;	
		///////////////////
		newValue = $('#goal-amount1').val()
		newValue = newValue.replace(/\,/g, '');
		newValue = newValue.replace(/\./g, '');
		createGoalApp.cgvm.GoalAmount = newValue;
		
		newValue = addCommas(newValue);
		if(newValue == '' || parseInt(newValue)==NaN || newValue=='NaN'){
			newValue = '';
		}
		document.getElementById('goal-amount1').value = newValue;		
		
		
	//////////////////////////

	calculateGoalDuration()
	
}

function goalOptions(id,reqType){
	
	if(reqType){
		stopLoad()
		//console.log(reqType)
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
			toastr.error('An error occured while verifying user information.')
			console.dir(err);
			return false;
		}
		stopLoad();
		data = JSON.parse(data);
		data= modResult(data)
		if (data.status == 200){
			toastr.success('Goal Edited Successfully')
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
		//console.log('---------------------before send')
		var GoalUpload = '';
		if(files){
			GoalUpload = renda.fileToBase64(files);			
			GoalUpload.then(function(result) {
				GoalUpload = result.replace(/^data:image\/[a-z]+;base64,/, "");
				//console.log(result)
				uploadGoalImage();
			});
		}else{
			GoalUpload = singleGoalApp.sgdata.GoalImage;
			sendGoalReq()
		}
		function uploadGoalImage(data){
			if(data){
				stopLoad()
				//console.log(data)
				//newdata = JSON.parse(data)	
				try {
					var ndata = JSON.parse(data);
					data = ndata;
				} catch (error) {
					//console.log('Failed to parse',data)
				}
				GoalUpload = data['data'].imagepath
				//console.log(GoalUpload)	
				singleGoalApp.sgdata.GoalImage = GoalUpload
				//if()
				sendGoalReq();
			}else{
				startLoad()
				var data = {"ProfilePic":GoalUpload};
				//console.log(data)
				var url = renda.Config.serverUrl+'paydaypayment/image-upload';
				promiseXmlHTTP({
					url:url,
					method:'POST',
					data:JSON.stringify(data),
					headers:{
						"Authorization": "Basic " + paydayWebAuthToken,
						"Content-Type": "application/json",
						"Accept": "application/json",
						"Access-Control-Allow-Credentials":"true"
					}
				}).then(function(result){
					uploadGoalImage(JSON.stringify(result))
				});
			}
		}
		function sendGoalReq(){
			//console.log('ready to lunch')
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
				//console.log('error occured');
				console.dir(data)
				stopLoad()
				return false;
			}
		}        
	}

} 

function freqChange(){
	var currentVal = $('#frequency').val()
	addCommaToGoal('monthly-deduct1')
	addCommaToGoal('goal-amount1')
}

function Top_Up_Goal(data,option){
	if(data){
		stopLoad()
		if(option == 'cardTopUp' || option == 'cardTopUp'){
			if(data==true){
				alert('Goal Top Up Was Successful!')
				document.getElementById('extendedGoalUI').style.display='none';				
			}else{
				toastr.error('An error occured while performing top up. Please try again later')					
			}
			return false; 					
		}else{
			
		}
		try{
			JSON.parse(data);
			
		}catch(err){			
			stopLoad()
			
			if(data){
				if(data.length<70){
					alert(data)
				}else{
					toastr.error('An error occured while performing request. Please try again later')
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
		if(data == false && (option == 'cardTopUp' || option == 'walletTopUp')){
			alert('An error occured while performing top up request. Please try again later')					
			return false;			
		}
		if(option == 'card'){
			url = 'UserTransactions/ChargeCard';
			var element = $('#topUpCards').find('option:selected'); 
			var cardToken = element.attr('fwCode');
			var cardId = element.attr('id');
			
			var data = {
				"AppUserId":sessionStorage.UserId,
				"GoalId":singleGoalApp.sgdata.GoalId,
				"Amount":$('#GoalAmount').val(),
				"CardId" : cardId
			}  
			if(data.CardId){
			}else{
				toastr.warning('Please Enter Amount')
				return false;
			}
			if(data.CardId){
				
			}else{
				toastr.warning('Select a card to top up with. If you do not have a card on your account yet, please add one to continue')			
				return false;
			}
			if (validateObj(data)){
				startLoad()
				//console.log(data)
				data = JSON.stringify(data)
				renda.post(url,JSON.stringify(data),'Top_Up_Goal',null,null,'cardTopUp');     
			}else{
				//console.log('error occured');
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
				renda.post(url,JSON.stringify(data),'Top_Up_Goal',null,null,'walletTopUp');     
			}else{
				//console.log('error occured');
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
			//console.log('error occured');
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
			//console.log('error occured');
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
			//console.log('error occured');
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
			//console.log('error occured');
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
 
