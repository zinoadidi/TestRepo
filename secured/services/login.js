class Login{
    constructor() {
        this.serverSettings={
            "armOneBaseUrl": "http://192.168.250.29:8000/armauth",
            "Password": "abamiedA1980@arm.com",
            "EmailAddress": "zinoadidi@gmail.com",
            "Username": "PaydayMobile",
            "IPAddress": "null",
            "CustomerReference":"",
            "lastGenerated":"",
            "numOfTimesGenerated":0
            
        }
        this.generateArmOneToken = function(){
            if(this.serverSettings.numOfTimesGenerated >= 5){
                console.log('token request exceed maximum')
                stopLoad();
                if(this.serverSettings.numOfTimesGenerated >= 1000) {
                    renda.page('login');
                    toastr.warning('An error occured. Please try again')
                }
                return false;
            }
            this.serverSettings.numOfTimesGenerated ++;
            var data = JSON.stringify({
                "Password": this.serverSettings.Password,
                "EmailAddress": this.serverSettings.EmailAddress,
                "Username": this.serverSettings.Username
              });
              
            var xhr = new XMLHttpRequest();
               
            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    var checkResponse = JSON.parse(this.responseText);
                    if (checkResponse.CustomerReference){
                        loginClass.serverSettings.CustomerReference = checkResponse.CustomerReference;
                        var lastGenerated = new Date();
                        loginClass.serverSettings.lastGenerated = lastGenerated.getHours()+lastGenerated.getMinutes();
                        loginClass.serverSettings.numOfTimesGenerated = 0;                                            
                    }else{
                        console.log('ARM token request failed')
                        toastr.error('An error occured while performing request. Please confirm you that your device has network coverage. If the problem persist, please contact an administrator.')
                        loginClass.serverSettings.numOfTimesGenerated = 0;                                                
                    }
                }
            });
              
            xhr.open("POST", this.serverSettings.armOneBaseUrl+"/OAuth/Token");
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(data);
        }
        this.authenticateUser = function(data){
            var lastGenerated = new Date();
            var newtime = lastGenerated.getHours()+lastGenerated.getMinutes();
            if(newtime - loginClass.serverSettings.lastGenerated <= 10){
                var data = data;
                var xhr = new XMLHttpRequest();
            
                xhr.addEventListener("readystatechange", function () {
                    if (this.readyState === 4) {
                        if(xhr.status == 401){
                            loginClass.generateArmOneToken()
                            toastr.error('Login attempt failed. Check that you have good network coverage and try again. If this problem persist, please contact an administrator ')
                        }
                        login(this.response,'armOne')
                    }
                });
                
                xhr.open("POST", loginClass.serverSettings.armOneBaseUrl+"/v1/ARMONE/Login");
                xhr.setRequestHeader("Authorization", loginClass.serverSettings.CustomerReference);            
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.send(data);
            }else{
                this.generateArmOneToken()
                this.authenticateUser(data)
            }
            
        }
            
    }

}

