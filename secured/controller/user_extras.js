renda.get('/investmentOne','updateUserExtras','investment101');
<<<<<<< HEAD
$("a").click(function(event){
    var link = this.href;
    return false;
});
=======

>>>>>>> eb95b086eb835a7d8866f07beb8ec85cdb29a53e
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
<<<<<<< HEAD
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
=======
	}
>>>>>>> eb95b086eb835a7d8866f07beb8ec85cdb29a53e

}


function updateUserExtras(data,option){
<<<<<<< HEAD

	if (data) {
        stopLoad()
        $("a").click(function(event){
            var link = this.href;
            alert(link);
            return false;
        });
=======
	if (data) {
        stopLoad()
>>>>>>> eb95b086eb835a7d8866f07beb8ec85cdb29a53e
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
<<<<<<< HEAD
            $('a').each(function() {
                var href = $(this).attr('href') || '';
                $(this).attr('href', 'javascript:void(0)');
            });
=======
>>>>>>> eb95b086eb835a7d8866f07beb8ec85cdb29a53e
            return false;
        }else if (option == 'cards') {
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
