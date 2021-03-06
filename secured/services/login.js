"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Login = function Login() {
    _classCallCheck(this, Login);

    this.serverSettings = {
        "armOneBaseUrl": armOneBaseUrl,
        "Password": "abamiedA1980@arm.com",
        "EmailAddress": "zinoadidi@gmail.com",
        "Username": "PaydayMobile",
        "IPAddress": "null",
        "CustomerReference": "",
        "lastGenerated": "",
        "numOfTimesGenerated": 0

    };
    this.generateArmOneToken = function () {
        checkInternet();
        //alert('gen token')
        if (this.serverSettings.numOfTimesGenerated >= 3) {
            if (this.serverSettings.numOfTimesGenerated >= 7) {
                alert('An error occured. Please try again');
                renda.page('login');
                return false;
            }
            //console.log('token request exceed maximum')
            //alert('token request exceed maximum');
            alert('PayDay may be experiencing some difficulties performing your request, kindly restart the app and try again. If you are still seeing this message, kindly check that your internet connection is stable. If this problem persist, please contact admin for help.');
            stopLoad();

            return false;
        }
        this.serverSettings.numOfTimesGenerated++;
        var data = JSON.stringify({
            "Password": this.serverSettings.Password,
            "EmailAddress": this.serverSettings.EmailAddress,
            "Username": this.serverSettings.Username
        });

        var xhr = new XMLHttpRequest();

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4 || this.readyState === 3) {
                //alert(this.responseText);
                var checkResponse = JSON.parse(this.responseText);
                if (checkResponse.CustomerReference) {
                    loginClass.serverSettings.CustomerReference = checkResponse.CustomerReference;

                    loginClass.serverSettings.numOfTimesGenerated = 0;
                } else {
                    //alert('ARM token request failed')
                    console.log('ARM token request failed')
                    checkInternet()
                    //toastr.warning('An error occured while performing request. Please confirm you that your device has network coverage. If the problem persist, please contact an administrator.');
                    loginClass.serverSettings.numOfTimesGenerated = 0;
                }
            } else {
                //alert(this.status);
                //alert(this.readyState);
                //alert(this.response);
            }
        });
        var lastGenerated = new Date();
        loginClass.serverSettings.lastGenerated = lastGenerated.getHours() + lastGenerated.getMinutes();
        xhr.open("POST", this.serverSettings.armOneBaseUrl + "/OAuth/Token");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(data);
    };
    this.authenticateUser = function (data) {
        //alert('auth user')
        //alert(data)
        //alert(loginClass.serverSettings.armOneBaseUrl)
        checkInternet();
        var lastGenerated = new Date();
        var newtime = lastGenerated.getHours() + lastGenerated.getMinutes();
        if (newtime - loginClass.serverSettings.lastGenerated <= 5) {
            var data = data;
            var xhr = new XMLHttpRequest();

            xhr.addEventListener("readystatechange", function () {
                //alert(this.readyState+':'+this.status+':'+this.response);
                if (this.readyState === 4) {
                    if (xhr.status == 401) {
                        //alert('arm auth failed')
                        loginClass.generateArmOneToken();
                        //toastr.error('Login attempt failed. Check that you have good network coverage and try again. If this problem persist, please contact an administrator ');
                        console.log('login armOne failed')
                        checkInternet()
                        
                    }
                    login(this.response, 'armOne');
                }
            });

            xhr.open("POST", loginClass.serverSettings.armOneBaseUrl + "/v1/ARMONE/Login");
            xhr.setRequestHeader("Authorization", loginClass.serverSettings.CustomerReference);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(data);
        } else {
            //alert('generating new token old:'+loginClass.serverSettings.lastGenerated+' new:'+newtime)
            this.generateArmOneToken();
            this.authenticateUser(data);
        }
    };
    this.resetPassword = function (data) {
        //alert('auth user')
        checkInternet();
        var lastGenerated = new Date();
        var newtime = lastGenerated.getHours() + lastGenerated.getMinutes();
        if (newtime - loginClass.serverSettings.lastGenerated <= 10) {
            var data = data;
            var xhr = new XMLHttpRequest();

            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    if (xhr.status == 401) {
                        //alert('arm auth failed')
                        loginClass.generateArmOneToken();
                        toastr.error('Failed to communicate with server. Check that you have good network coverage and try again. If this problem persist, please contact an administrator ');
                    }
                    reset_password(this.response);
                }
            });
            xhr.open("POST", loginClass.serverSettings.armOneBaseUrl + "/v1/ARMONE/ResetPassword");
            xhr.setRequestHeader("Authorization", loginClass.serverSettings.CustomerReference);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(data);
        } else {
            //alert('generating new token old:'+loginClass.serverSettings.lastGenerated+' new:'+newtime)
            this.generateArmOneToken();
            this.resetPassword(data);
        }
    };

    this.forgotPassword = function (data) {
        //alert('auth user')
        checkInternet();
        var lastGenerated = new Date();
        var newtime = lastGenerated.getHours() + lastGenerated.getMinutes();
        if (newtime - loginClass.serverSettings.lastGenerated <= 10) {
            var data = data;
            var xhr = new XMLHttpRequest();

            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    if (xhr.status == 401) {
                        //alert('arm auth failed')
                        loginClass.generateArmOneToken();
                        toastr.error('Failed to communicate with server. Check that you have good network coverage and try again. If this problem persist, please contact an administrator ');
                    }
                    reset_password(this.response, 'forgot_password');
                }
            });

            xhr.open("POST", loginClass.serverSettings.armOneBaseUrl + "/v1/ARMONE/AnswerSecurityChallenge");
            xhr.setRequestHeader("Authorization", loginClass.serverSettings.CustomerReference);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(data);
        } else {
            alert('generating new token old:' + loginClass.serverSettings.lastGenerated + ' new:' + newtime);
            this.generateArmOneToken();
            this.forgotPassword(data);
        }
    };
    this.changePassword = function (data) {
        //alert('auth user')
        checkInternet();
        var lastGenerated = new Date();
        var newtime = lastGenerated.getHours() + lastGenerated.getMinutes();
        if (newtime - loginClass.serverSettings.lastGenerated <= 10) {
            var data = data;
            var xhr = new XMLHttpRequest();

            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    if (xhr.status == 401) {
                        //alert('arm auth failed')
                        loginClass.generateArmOneToken();
                        toastr.error('Failed to communicate with server. Check that you have good network coverage and try again. If this problem persist, please contact an administrator ');
                    }
                    change_password(this.response);
                }
            });
            xhr.open("POST", loginClass.serverSettings.armOneBaseUrl + "/v1/ARMONE/ResetPassword");
            xhr.setRequestHeader("Authorization", loginClass.serverSettings.CustomerReference);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(data);
        } else {
            //alert('generating new token old:'+loginClass.serverSettings.lastGenerated+' new:'+newtime)
            this.generateArmOneToken();
            this.changePassword(data);
        }
    };
};