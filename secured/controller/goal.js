

        createGoalApp = new Vue({
		  el: '#createGoalDiv',
		  data: {
		      cgvm: new Goal(null)
		  }
		});
        createGoalApp.cgvm.UserId = sessionStorage.UserId
        renda.loader('stop')
		$('.frequency-depend').hide();
	    $('.frequencies').hide();


function clear(){
	renda.component('goals','view','dashboardDisplayDiv')
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
    	stopLoad();
	    data = JSON.parse(data);
    	if (data.status == 200){              
            toastr.success(data['message'])
            updateDataFromApi(null)
            clear();
		}else{
            toastr.error(data['message']);    
		}           
		return false;
    }else{
    	startLoad()
		var files = '';
		var url = '/new/goal';   
    	files = document.getElementById('GoalUpload').files[0]
    	var GoalUpload = renda.fileToBase64(files);
    	console.log('---------------------before send')
		GoalUpload.then(function(result) {
			GoalUpload = result;
			console.log(result)
			sendGoalReq();
		});
		function sendGoalReq(){
			console.log('ready to lunch')
			if (createGoalApp.cgvm.Day) {}else{
				createGoalApp.cgvm.Day = '0'
			}
			if (createGoalApp.cgvm.CardId) {}else{
				createGoalApp.cgvm.CardId = '0'
			}
			var data = {
				"UserId":sessionStorage.UserId,
				"ItemName":createGoalApp.cgvm.ItemName,
				"GoalAmount":createGoalApp.cgvm.GoalAmount,
				"Duration":parseInt(createGoalApp.cgvm.GoalAmount) / parseInt(createGoalApp.cgvm.MonthlyDeduction),
				"MonthlyDeduction":createGoalApp.cgvm.MonthlyDeduction,
				"ProductId":'1',
				"GoalType":'custom',
				"Day":createGoalApp.cgvm.Day,
				"Frequency":createGoalApp.cgvm.Frequency,
				"GoalImage":GoalUpload,
				"Status":"active",
				"ItemDescription" : createGoalApp.cgvm.ItemDescription,
				"CardId" : "0"
			}  
	        if (validateObj(data)){
	            renda.post(url,JSON.stringify(data),'createGoal');     
	        }else{
	        	console.log('error occured');
	        	console.dir(data)
	            return false;
	        }
		}        
	}
}