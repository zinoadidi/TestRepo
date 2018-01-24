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
                "ProfilePic": file
            });
            request({url: "employees.json"})
            .then(data => {
                let employees = JSON.parse(data);
                let html = "";
                employees.forEach(employee => {
                    html += `
                        <div>
                            <img src='${employee.picture}'/>
                            <div>
                                ${employee.firstName} ${employee.lastName}
                                <p>${employee.phone}</p>
                            </div>
                        </div>`;
                });
                document.getElementById("list").innerHTML = html;
            })
            .catch(error => {
                console.log(error);
            });
        }
        
            
    }

}




///