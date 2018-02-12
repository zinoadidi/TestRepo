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
    if(checKycStatus()){
        console.log('===============check kyc passed')
    }else{
        var confirm = window.confirm('You have not completed your registration. Please upload your KYC information to continue. If your KYC is pending approval, you can ignore this message. Do note: You will not be able to add a perform any transaction until your KYC is verified')        
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
            toastr.error('An error occured while performing request. Please try again')
            console.log(err);
            return false;
        }
        stopLoad();
        console.dir(data)
        data = JSON.parse(data);
        if (data.status == 200){            
            if(cardRegStep != 2){
                toastr.success('Card submission successful. kindly verify your card on the page that will be displayed to you soon')
                
                cardVerificationVar = window.open(encodeURI(data['data']['data']['authurl']), '_blank', 'location=yes');
                cardVerificationVar.addEventListener('loadstop', function(event) { 
                   var url = event.url;
                   //alert(url)
                   var urlSearch = url.search('tokinze/card/getFeedback/')
                   //alert(event.url); 
                   if (urlSearch == -1){
                   }else{
                    cardVerificationVar.close();
                    url = url.replace('http://41.216.170.131/api/v1/','')
                    url = url.replace('https://41.216.170.131/api/v1/','')
                    url = url.replace('http://paydayinvestor.arm.com.ng/api/v1/','')
                    url = url.replace('https://paydayinvestor.ng/api/v1/','')
                    console.log(url) 
                    var oldAuthToken = renda.Config.httpRequestAuth.authToken
                    renda.Config.httpRequestAuth.authToken = paydayWebAuthToken;                   
                    renda.get('paydaypayment/'+url,'createCard',2)
                    renda.Config.httpRequestAuth.authToken = oldAuthToken;
                    
                    /* promiseXmlHTTP({url:url,method:'GET'}).then(function(result){
                        createCard(result,2)
                    }); */
                    toastr.warning('Finalizing transaction, Please wait.')
                   }
                   
                }); 
                cardVerificationVar.addEventListener('loadstart', function(event) { 
                    var url = event.url;
                    //alert(url)
                    var urlSearch = url.search('/card/tokinze/getFeedback/')
                    //alert(event.url); 
                    if (urlSearch == -1){
                    }else{
                     cardVerificationVar.close();
                     url = url.replace('http://41.216.170.131/api/v1/','')
                     url = url.replace('https://41.216.170.131/api/v1/','')
                     url = url.replace('http://paydayinvestor.arm.com.ng/api/v1/','')
                     url = url.replace('https://paydayinvestor.ng/api/v1/','')
                     console.log(url)       
                     var oldAuthToken = renda.Config.httpRequestAuth.authToken
                     renda.Config.httpRequestAuth.authToken = paydayWebAuthToken;             
                     renda.get('paydaypayment/'+url,'createCard',2)
                    renda.Config.httpRequestAuth.authToken = oldAuthToken;
                     
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
            if(data[message]){
                alert(data['message']);
            }else{
                alert('An error occured while adding card. Please try again later.')    
            }
        }           
        return false;
    }else{
        if(checKycStatus()){
            console.log('===============check kyc passed')
        }else{
            var confirm = window.confirm('You have not completed your registration. Please upload your KYC information to continue. If your KYC is pending approval, you can ignore this message. Do note that you will not be able to add a card or perform any transaction until your KYC is verified');
            if(confirm){renda.page('setup_profile')}else{
            }
            return false;
        }
        var myCard = $('#add-card-form');
        var cardNumber = myCard.CardJs('cardNumber');
        var cardType = myCard.CardJs('cardType');
        var expiryMonth = myCard.CardJs('expiryMonth');
        var expiryYear = myCard.CardJs('expiryYear');
        var cvc = myCard.CardJs('cvc');
        cardNumber = cardNumber.replace(/\s/g, '');
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
            if(String(cardNumber).lenght < 12){
                toastr.error('Please Confirm The Lenght of Your Card Number')
                return false
            }
            if(String(cvc).lenght < 3){
                toastr.error('Please Confirm That Your CVC is 3 Digits')
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
            alert('An error occured while removing card. Please try again later.')    
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