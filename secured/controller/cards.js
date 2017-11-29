var cardRegStep = 0;
var cardVerificationVar = '';
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
        renda.get('/cards/'+sessionStorage.UserId,'stats','cards');
    }

});

function createCard(data){
    var url ='';    
    if(data){
        try{
            JSON.parse(data);
        }catch(err){
            stopLoad();
            toastr.error('An error occured while verfying user information.')
            console.dir(err);
            return false;
        }
        stopLoad();
        console.dir(data)
        data = JSON.parse(data);
        if (data.status == 200){            
            if(cardRegStep != 2){
                toastr.success('Card submission successful. kindly verify your card on the page that will be displayed to you soon')
                /*$('.hideCardPageDivs').hide();
                console.log(data['data']['data']['authurl'])
                $('#verifyCardIframe').attr('src',data['data']['data']['authurl']);
                $('#verifyCardDiv').show()*/
                cardVerificationVar = window.open(encodeURI(data['data']['data']['authurl']), '_blank', 'location=yes');
                //navigator.app.loadUrl(encodeURI(data['data']['data']['authurl']),{openExternal:true});
                return false;
            }else{
                toastr.success('Card Successfully Added!')
                //showAddCardForm('addNewCardForm')  
            }
        }else{
            toastr.error(data['message']);
            alert('An error occured while adding card. Please try again later.')    
        }           
        return false;
    }else{
        var myCard = $('#add-card-form');
        var cardNumber = myCard.CardJs('cardNumber');
        var cardType = myCard.CardJs('cardType');
        var name = myCard.CardJs('name');
        var expiryMonth = myCard.CardJs('expiryMonth');
        var expiryYear = myCard.CardJs('expiryYear');
        var cvc = myCard.CardJs('cvc');

        if(cardRegStep != 2){
            url = '/card/tokinize';   
            data = {
                "ExpiryYear":expiryYear,
                "ExpiryMonth":expiryMonth,
                "CardNo": cardNumber,
                "CVV": cvc,
                "UserId": sessionStorage.UserId
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
                renda.post(url,JSON.stringify(data),'createCard');
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


function showAddCardForm(id) {
    var x = document.getElementById(id);
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
    } else { 
        x.className = x.className.replace(" w3-show", "");
    }
}