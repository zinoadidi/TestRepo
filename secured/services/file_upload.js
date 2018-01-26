class FileUpload{
    constructor() {
        this.serverSettings={
            "armOneBaseUrl": "http://192.168.250.29:8000/armauth",
            "numOfTimesGenerated":0
        }
       
        this.uploadGoalImage = function(data){
            //alert('auth user')
            checkInternet()
            var lastGenerated = new Date();
            var newtime = lastGenerated.getHours()+lastGenerated.getMinutes();
            if(newtime - loginClass.serverSettings.lastGenerated <= 10){
                var data = data;
                var xhr = new XMLHttpRequest();
            
                xhr.addEventListener("readystatechange", function () {
                    if (this.readyState === 4) {
                        if(xhr.status == 200){
                            //alert('arm auth failed')
                            loginClass.generateArmOneToken()
                            toastr.error('Login attempt failed. Check that you have good network coverage and try again. If this problem persist, please contact an administrator ')
                        }else{
                            alert('An error occured while uploading file. Please try again')
                        }
                        login(this.response,'armOne')
                    }
                });
                
                xhr.open("POST", loginClass.serverSettings.armOneBaseUrl+"/v1/ARMONE/Login");
                xhr.setRequestHeader("Authorization", "Basic "+authToken);            
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.setRequestHeader("Accept", "application/json");
                xhr.setRequestHeader("Access-Control-Allow-Credentials", "true");

                xhr.send(data);
            }else{
               
            }
            
        
        }
        
            
    }

}




///