var step = 0;
 $(document).ready(function(){ 
 		$('.stages').hide()
        updateUserData()
        checkProfileState();
        temporaryApp = new Vue({
		  el: '#setupProfileDiv',
		  data: {
		      vm: new User(null)
		  }
		});
        temporaryApp.vm.Firstname = payday.user.Firstname
        temporaryApp.vm.Email = payday.user.Email
        renda.loader('stop')
    });

 function checkProfileState(){
    if(payday.user["BVN"] == null || payday.user["Gender"] == null || 
		String(payday.user["ProgressStatus"]) != "Stage 2 Completed" ){
			if(
				String(payday.user["ProgressStatus"]) == "KYC Submitted" ||
				String(payday.user["ProgressStatus"]) == "KYC Rejected"){
					step2()	
			
				}else{
					step1()
					return false;
				}
          
    }else{
        step2()
    }
 }

function skip(){
	renda.page('dashboard')
	return false;
}

function step1(){
	step = 1;
	$('#step2').hide()
	$('#step1').show()
}

function step2(){
	step = 2;
	if(String(payday.user["ProgressStatus"]) == "KYC Submitted"){
		alert('Your KYC is pending approval. You will not be able to perform any transaction until it is approved.')
        skip();
        return false
	}
	if(payday.user["ProgressStatus"] == 'KYC Rejected'){
		alert("Hello, We noticed that the documents you submitted for KYC where not approved because \"" + payday.user.KYCFeedback + "\". Click ok to update your KYC ");
	}	
	$('#step1').hide()
	$('#step2').show()
}

function updateStage(data){
	var url ='';    
    if(data){
    	try{
            JSON.parse(data);
        }catch(err){
        	stopLoad();
            toastr.error('An error occured while submitting data. Please try again later.')
            console.dir(err);
            return false;
        }
    	renda.loader('stop');
		data = JSON.parse(data);     
    	if (data.UserId){
			data = modResult(data);
    		sessionStorage.UserInfo = JSON.stringify(data)                 
	        if(step == 1){
	            toastr.success('Profile Update Was Successful')
	            step2();
	        }else if(step == 2){
	            toastr.success('Document Submission Successful')
	            skip();
	        }else{
	            console.log('Error With Step Selection')
	        }
		}else{
            alert(data);    
		}           
		return false;
    }else{
	    if(step == 1){
	        if(temporaryApp.vm.BankAccountNo.length != 10 || temporaryApp.vm.BVN.length != 11 ){
	            toastr.error('BVN and Bank Account Number Must be 11 and 10 Digits Respectively.');
	            return false;
	        }
	        url = 'Account/RegisterSTG2';   
	        data = {
                UserId: sessionStorage.UserId,
                Gender: temporaryApp.vm.Gender,
                Email: temporaryApp.vm.Email,
                Address: temporaryApp.vm.Address,
                MaritalStatus: temporaryApp.vm.MaritalStatus,
                DOB: temporaryApp.vm.DOB,
                State: temporaryApp.vm.State,
                BVN: temporaryApp.vm.BVN,
                BankName:temporaryApp.vm.BankName,
                BankAccountNo:temporaryApp.vm.BankAccountNo
            }
            if (validateObj(data)){
				renda.loader('start')
				data = JSON.stringify(data)
	            renda.post(url,JSON.stringify(data),'updateStage');
	        }else{
	        }
	        return false;
	    }else if(step == 2){
	    	startLoad()
	    	url = "Account/RegisterSTG3";
	    	var files = '';
			files = document.getElementById('PassportUpload').files[0]
			if(files.size > 525000){
				alert('Please ensure that your passport photo is lesser than 500kb in size')
				stopLoad()
				return false;
			}else{}   
	    	var PassportUpload = renda.fileToBase64(files);
			PassportUpload.then(function(result) {
				PassportUpload = result.replace(/^data:image\/[a-z]+;base64,/, "");
			});
			
			files = document.getElementById('SignatureUpload').files[0]
			if(files.size > 525000){
				alert('Please ensure that your signature image is not larger than 500kb in size')				
				stopLoad()
				return false;
			}else{}   
	    	var SignatureUpload = renda.fileToBase64(files);
			SignatureUpload.then(function(result) {
				SignatureUpload = result.replace(/^data:image\/[a-z]+;base64,/, "");
				sendReq();
			});
			/* files = document.getElementById('ThumbUpload').files[0]
	    	var ThumbUpload = renda.fileToBase64(files);
			ThumbUpload.then(function(result) {
				ThumbUpload = result.replace(/^data:image\/[a-z]+;base64,/, "");
				sendReq()
			}); */
			files = document.getElementById('IdentificationUpload').files[0]
			if(files.size > 525000){
				alert('Please ensure that your identification document is not larger than 500kb in size')				
				stopLoad()
				return false;
			}else{}   
	    	var IdentificationUpload = renda.fileToBase64(files);
			IdentificationUpload.then(function(result) {
				IdentificationUpload = result.replace(/^data:image\/[a-z]+;base64,/, "");
				sendReq()
			});
			files = document.getElementById('UtilityUpload').files[0]
			if(files.size > 525000){
				alert('Please ensure that your utility document is not larger than 500kb in size')
				stopLoad()
				return false;
			}else{}   
	    	var UtilityUpload = renda.fileToBase64(files);
			UtilityUpload.then(function(result) {
				UtilityUpload = result.replace(/^data:image\/[a-z]+;base64,/, "");
				sendReq()
			});
			function sendReq(){
				data = {
	                "UserId": sessionStorage.UserId,
	                "PassportUpload":PassportUpload,
	                "SignatureUpload":SignatureUpload,
	                /* "ThumbUpload":ThumbUpload, */
	                "IdentificationUpload":IdentificationUpload,
	                "IdentificationNumber":temporaryApp.vm.IdentificationNumber,
                	"UtilityUpload":UtilityUpload
	            } 
	            if (validateObj(data,true)){
					if(
						typeof(data.UtilityUpload) !== 'string' ||
						typeof(data.PassportUpload) !== 'string' ||
						typeof(data.SignatureUpload) !== 'string' ||
						typeof(data.IdentificationUpload) !== 'string'
					){
						return false;
					}else{
						renda.loader('start')
						data = JSON.stringify(data)
						var checkKyc = JSON.parse(sessionStorage.UserInfo);
						if(checkKyc.data.ProgressStatus == 'KYC Rejected'){
							url = "Account/UpdateKYC"
						} 
						renda.post(url,JSON.stringify(data),'updateStage');   
					}
		        }else{
		            return false;
		        }
	            
			}
			        
	    }
	    
    }
}
