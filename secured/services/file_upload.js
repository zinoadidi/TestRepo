class FileUpload{
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
        this.Upload = function(file){
            
            var data = JSON.stringify({
                "ProfilePic": file,
                "EmailAddress": this.serverSettings.EmailAddress,
                "Username": this.serverSettings.Username
              });
              
            var xhr = new XMLHttpRequest();
               
            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    
                }
            });
              
            xhr.open("POST", this.serverSettings.armOneBaseUrl+"/OAuth/Token");
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(data);
        }
        
            
    }

}




///