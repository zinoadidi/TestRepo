$(document).ready(function(){ 
    //load extra files
    $("#read-btn-1").click(function() {

        var myCard = $('#my-card-1');

        var cardNumber = myCard.CardJs('cardNumber');
        var cardType = myCard.CardJs('cardType');
        var name = myCard.CardJs('name');
        var expiryMonth = myCard.CardJs('expiryMonth');
        var expiryYear = myCard.CardJs('expiryYear');
        var cvc = myCard.CardJs('cvc');

        console.log(cardNumber);
        console.log(name);

      });

});

function createCard(data){}