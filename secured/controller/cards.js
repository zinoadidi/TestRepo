var cardRegStep = 0;

$(document).ready(function(){ 
    //load extra files
    $("#read-btn-1").click(function() {
        createCard(null)
    });
    cardsApp = new Vue({
      el: '#viewCards',
      data: {
        cards:Cards(null)
      }
    });
    var testDash = String(sessionStorage.dashboardData)
    if ( testDash != 'undefined' && testDash != 'null' && testDash != ''){
        stats(sessionStorage.userCards,'cards');
         updateDataFromApi(null)
    }else{
        startLoad()
        renda.post('PaymentDetails/FetchPaymentDetails',JSON.stringify(JSON.stringify({'UserId':sessionStorage.UserId})),'stats',null,null,'cards');
    }
    showAddCardForm('addNewCardForm')
    //obsolute: check for kyc
   /* if(checKycStatus()){
        console.log('===============check kyc passed')
    }else{
        var confirm = window.confirm('You have not completed your registration. Please upload your KYC information to continue. If your KYC is pending approval, you can ignore this message. You will not be able to add a card or perform any transaction until your KYC is approved')        
        if(confirm){renda.page('setup_profile')}else{}
    }*/
if(payday.user.IsCXCreated){
    console.log('===============check kyc passed')
}else{
    var confirm = window.confirm('Your account has not been verified. You will not be able to add a card until your account is verified.')        
    if(confirm){renda.page('setup_profile')}else{}
}
});

function createCard(data,cardRegStep){
    var url ='';    
    if(data){
        try{
            JSON.parse(data);
        }catch(err){
            stopLoad();
            checkInternet()            
            toastr.error('An error occured while adding card. Please try again')
            //alert(err);
            //alert(data)
            console.log(err);
            return false;
        }
        stopLoad();
        console.dir(data)
        data = JSON.parse(data);
        if (data.status == 200){            
            if(cardRegStep != 2){
                toastr.success('kindly verify your card on the page that will be displayed to you soon')
                
                cardVerificationVar = window.open(encodeURI(data['data']['data']['authurl']), '_blank', 'location=yes');
                
                cardVerificationVar.addEventListener('loadstart', function(event) { 
                    var url = event.url;
                    //alert(url)
                    var urlSearch = url.search('/card/tokinze/getFeedback/')
                    var urlSearch2 = url.search('tokinze/card/')
                    //alert(event.url); 
                    if(urlSearch2 == -1){

                    }else{
                        sendRequest()
                    }
                    if (urlSearch == -1){
                       
                    }else{
                        sendRequest()
                    }
                    function sendRequest(){
                     cardVerificationVar.close();
                    /*  url = url.replace('http://41.216.170.131/api/v1/','')
                     url = url.replace('https://41.216.170.131/api/v1/','')
                     url = url.replace('http://paydayinvestor.arm.com.ng/api/v1/','')
                     url = url.replace('https://paydayinvestor.ng/api/v1/','')
                     url = url.replace('http://paydayinvestor.ng/api/v1/','') */
                     //url = url.replace('tokinze/card/','card/tokinze/')
                     console.log(url)       
                    // url = renda.Config.serverUrl+'paydaypayment/'+url;
                     //var oldAuthToken = renda.Config.httpRequestAuth.authToken
                     //renda.Config.httpRequestAuth.authToken = paydayWebAuthToken;  
                     promiseXmlHTTP({
                        url:url,
                        method:'GET',
                        headers:{
                            "Authorization": "Basic " + paydayWebAuthToken,
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                            "Access-Control-Allow-Credentials":"true"
                        }
                    }).then(function(result){
                        createCard(result,2)
                    });           
                     //renda.get('paydaypayment/'+url,'createCard',2)
                    //renda.Config.httpRequestAuth.authToken = oldAuthToken;
                     
                     /* promiseXmlHTTP({url:url,method:'GET'}).then(function(result){
                         createCard(result,2)
                     }); */
                     toastr.warning('Finalizing transaction, Please wait.')
                    }
                 }); 
               /*  cardVerificationVar.addEventListener('loadstop', function() { alert(event.url); }); */
               
                //navigator.app.loadUrl(encodeURI(data['data']['data']['authurl']),{openExternal:true});
                cardRegStep = 2;
                
                return false;
            }else{
                toastr.success('Card Successfully Added!')
                startLoad()
                renda.component('card','view','dashboardDisplayDiv');
                //showAddCardForm('addNewCardForm')  
            }
        }else{
            if(data['message']){
                alert(data['message']);
            }else{
                alert('An error occurred while adding card. Please try again later.')    
            }
        }           
        return false;
    }else{
       /*  if(checKycStatus()){
            console.log('===============check kyc passed')
        }else{
            var confirm = window.confirm('You have not completed your registration. Please upload your KYC information to continue. If your KYC is pending approval, you can ignore this message. You will not be able to add a card or perform any transaction until your KYC is approved');
            if(confirm){renda.page('setup_profile')}else{
            }
            return false;
        } */
        if(payday.user.IsCXCreated){
            console.log('===============check kyc passed')
        }else{
            var confirm = window.confirm('Your account has not been verified. You will not be able to add a card until your account is verified.')        
            if(confirm){renda.page('setup_profile')}else{}
        }
        var myCard = $('#add-card-form');
        var cardNumber = myCard.CardJs('cardNumber');
        var cardType = myCard.CardJs('cardType');
        var expiryMonth = myCard.CardJs('expiryMonth');
        var expiryYear = myCard.CardJs('expiryYear');
        var cvc = myCard.CardJs('cvc');
        cardNumber = cardNumber.replace(/\s/g, '');
        
        var expiry = $('.expiry').val();
        expiry = expiry.replace(/\s+/g, '');
        expiry = expiry.split("/");
        expiryMonth = expiry[0]
        expiryYear = expiry[1]

        if(cardRegStep != 2){
            url = 'paydaypayment/tokinize/card';   
            data = { 
                "ExpiryYear":expiryYear,
                "ExpiryMonth":expiryMonth,
                "CardNo": cardNumber,
                "CVV": cvc,
                "UserId": sessionStorage.UserId,
                "AppUserId": sessionStorage.UserId,
                "MembershipNumber":payday.user.MembershipNumber
            }
            alert('EXPMN:::'+data.ExpiryMonth+'EXPYR:'+data.ExpiryYear)  
            if(String(cardNumber).length < 12){
                toastr.error('Kindly Confirm the Length of Your Card Number')
                return false
            }
            if(String(cvc).length < 3){
                toastr.error('Kindly Confirm That Your CVC is 3 Digits')
                return false
            }
            if (String(expiryYear).length < 2) {
                toastr.error('Kindly Confirm That You Entered Expiry Year')
                return false
            }
            if (String(expiryMonth).length < 2) {
                toastr.error('Kindly Confirm That You Entered Expiry Month')
                return false
            }
            if (validateObj(data)){
                startLoad() 
                var oldAuthToken = renda.Config.httpRequestAuth.authToken
                renda.Config.httpRequestAuth.authToken = paydayWebAuthToken;
                renda.post(url,JSON.stringify(data),'createCard');
                renda.Config.httpRequestAuth.authToken = oldAuthToken;
                /* promiseXmlHTTP({
                    url:url,
                    method:'POST',
                    data:JSON.stringify(data),
                    Authorization:'Basic '+paydayWebAuthToken
                }).then(function(result){
                    uploadProfileImage(JSON.stringify(result))
                }); */
            }else{
                return false;
            }
            return false;
        }else{
            
            return false;
             
        }
        return false;
    }
 
}

function deleteCard(data,id){
    var url ='';    
    if(data){
        try{
            JSON.parse(data);
        }catch(err){
            stopLoad();
            toastr.error(data)
            console.dir(err);
            return false;
        }
        stopLoad();
        console.dir(data)
        data = JSON.parse(data);
        if (data){         
            toastr.success("Card Deleted Successfully");
            startLoad()
            renda.component('card','view','dashboardDisplayDiv');
        }else{
            toastr.error(data);
            alert('An error occurred while removing card. Please try again later.')    
        }           
        return false;
    }else{
        if(id){
            startLoad()
            url = 'PaymentDetails/Delete';   
            data = {
                "cardNo":id,
                "UserId":sessionStorage.UserId,
                "PaymentDetId":id
            };
            data = JSON.stringify(data)
            renda.post(url,JSON.stringify(data),'deleteCard');
        }else{
            toastr.error('an error occured while identifying card')
        }
        return false;
    }

}

function showAddCardForm(id) {
    var x = document.getElementById(id);
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
    } else { 
        x.className = x.className.replace(" w3-show", "");
    }
}

