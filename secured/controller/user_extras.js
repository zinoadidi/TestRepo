renda.get('/investmentOne','updateUserExtras','investment101');

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
	}

}


function updateUserExtras(data,option){
	if (data) {
        stopLoad()
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
