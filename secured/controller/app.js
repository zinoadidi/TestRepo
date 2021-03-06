    
   $(document).ready(function(){ 
        //load extra files
        //goToTest();
        //goToHttp();
        // live to test switch
        
        checklogin();   
        $("#loadDashboardBtn").click(function(){
            loadDashboardStatsDiv();
        }); 
        $("#createClientBtn").click(function(){
            loadCreateClientForm();
        }); 
        $("#viewClientBtn").click(function(){
            loadViewClientList();
        }); 
        $(".ViewVendorBtn").click(function(){
            loadViewVendorsList(this.id);
        }); 
        
        $('.manageClientBtn').click(function(){alert()});

        $("#logoutBtn").click(function(){
            logout();
        }); 
        loginClass = new Login();
        loginClass.generateArmOneToken()
        if(localStorage.appUniqieId){}else{
            localStorage.appUniqieId= generateToken(5);
            sendAppLog('New Install First Lunch'+localStorage.appUniqieId)
        } 
        // check app cache
        
    });
    /* Basic Functions */
    function login(data,option){
        //alert("data:"+data+" option:"+option)
        if (data || option == 'armOne') {
            //alert('got back')
            try{
                JSON.parse(data);
            }catch(err){
                stopLoad()
                toastr.error('An error occured while performing request.')
                console.dir(err);
                sendAppLog('custom',err+'::'+option+'::'+data+'::'+document.getElementById('Username').value)
                //alert('::::'+err+'::'+option+'::'+data)
                return false;
            } 
            var result = JSON.parse(data);
            //var result = USERDATA;
            //console.dir(result);

            if(option == 'armOne'){
                if(result.ResponseCode && result.ResponseCode== "00"){ 
                    loginClass.serverSettings.numOfTimesGenerated = 0;
                    if(result.StatusMessage == ''){
                        result.StatusMessage = 'Login successful.';
                    }else{
                        result.StatusMessage = 'Login successful. Please wait while we prepare your account';
                    }
                    //toastr.success(result.StatusMessage);
                    data = {
                        "Email":result.EmailAddress
                    };
                    data = JSON.stringify(data); 
                    renda.post('Account/FetchUserByEmail',JSON.stringify(data),'login')
                }else{
                    stopLoad()
                    toastr.error(result['StatusMessage']);    
                } 
                return false
            }else{
                //console.log(result)
                if (result.UserId){
                    result = modResult(result);
                    result.message = 'Welcome Back '+result.data.Firstname;
                    toastr.success(result.message); 
                    //decode token
                    sessionStorage.UserId = result.data['UserId'];
                    sessionStorage._id = result.data['UserId'];
                    sessionStorage.UserInfo = JSON.stringify(result)
                    updateUserData()
                    sessionStorage.loggedin = true;
     
                    // confirm user state
                        if (String(result['data']['ProgressStatus']) == 'KYC Submitted' || String(result['data']['ProgressStatus']) == "Existing Customer"){
                            renda.page('dashboard')
                            return false;
                        }
                        if (String(result['data']['Status']) !== 'active') {
                            renda.page('register_otp')
                            return false;
                        } 
                        if (
                            result['data']['ProgressStatus'] == null || result['data']['ProgressStatus'] == 'null' ||
                            result['data']['ProgressStatus'] == 'Stage 1 Completed' || result['data']['ProgressStatus'] == 'Stage 2 Completed' ||
                            result['data']['BVN'] == null || result['data']['Gender'] == null
                        ){
                            renda.page('setup_profile')
                            return false;                                
                        }
                        if(result['data']['ProgressStatus'] == 'KYC Rejected'){
                            renda.page('setup_profile')
                            return false;  
                        }
                       
                        renda.page('dashboard')
                        return false;                   
                }else{
                    toastr.error(result['message']);    
                }
                stopLoad()            
                return false;
            }
        }else{
            var email = document.getElementById('Username').value;
            var pass = document.getElementById('Password').value; 
            if(email.length<4 || pass.length < 4){
                alert('Please provide username and password');
                return false;
            } 
            data = {
                "Membershipkey": email,
                "Password": pass,
                "RedirectURL": "#!/dashboard",
                "Channel": "ARM_PAYDAY_MOBILE"
            };
            if (validateObj(data)){
                renda.loader('start')
                loginClass.authenticateUser(JSON.stringify(data));
                //alert('passed')

            }else{
                return false;
            }
        }   
        return false;  
    }
    function reset_password(data,option){
        if (data) {

            try{
                JSON.parse(data);
            }catch(err){
                stopLoad()
                toastr.error('An error occured while verfying user information.')
                console.dir(err);
                return false;
            } 
            var result = JSON.parse(data);
            
            console.dir(result);
            if (result.ResponseCode == "00"){
               if(option){
                    toastr.warning('We are finalizing your request please wait..')
                    startLoad()
                    renda.loader('start')
                    
                    var userdetails = JSON.parse(sessionStorage.resetPasswordDetail)
                    console.dir(userdetails);
                    var SecurityQuestion = $('#resetSecurityQuestion').val();
                    var SecurityAnswer = $('#resetSecurityAnswer').val();
                    var password = $('#resetpassword').val();
                    var confirmPassword = $('#resetConfirmPassword').val();
                    
                    data = {
                        "Membershipkey": userdetails.data.Email,
                        "OldPassword": "",
                        "NewPassword": password,
                        "IsReset": true,
                        "Channel": "ARM_PAYDAY_MOBILE"
                    }
                    renda.loader('start')
                    
                    if (validateObj(data)){
                        renda.loader('start')
                        loginClass.resetPassword(JSON.stringify(data))
                        //renda.post('armAuth/v1/ARMONE/ResetPassword',JSON.stringify(data),'reset_password')            
                    }else{
                        return false;
                    } 
                }else{
                    var userdetails = JSON.parse(sessionStorage.resetPasswordDetail)
                    var data = {
                        data:{
                            Email:userdetails.data.Email,
                            Firstname:userdetails.data.Firstname
                        }
                    }
                    
                    sendEmail('passwordChanged',data)
                    alert('Password Reset Successful. Please login to continue')
                    logout()

                }      
            }else{
                if(option){
                    toastr.error(result['StatusMessage']);                                            
                }else{
                    toastr.error(result['StatusMessage']); 
                    alert('Please confirm that you are not using your old password. Your new password should contain numbers, symbols and not less than 8 characters.')                       
                }
                
            }
            stopLoad()                                    
            return false;
        }
        if(option){
           
        }else{
            var email = document.getElementById('Username').value;
            data = {
                "Email":email
            };
            if (validateObj(data)){
                renda.loader('start')
                // old password restt
                /* renda.post('/authentication/email/passwordReset',JSON.stringify(data),'login'); */
                data = JSON.stringify(data)
                renda.post('Account/FetchUserByEmail',JSON.stringify(data),'forgot_password')            
            }else{
                return false;
            }
        }      
        
        return false;  
    }
    function forgot_password(data,option){
        if (data) {

            try{
                JSON.parse(data);
            }catch(err){
                stopLoad()
              
                if(data.lenght < 70){
                    alert(data);                        
                }else{
                    toastr.error('An error occured while verfying user information.')
                }
                
                console.dir(err);
                return false;
            } 
            var result = JSON.parse(data);
            result = modResult(result)
            console.dir(result);
            if (result.data.UserId){
               if(option){
                    toastr.success('Password reset was successful. please log in to continue')
                    renda.page('login')
                }else{
                    sessionStorage.resetPasswordDetail = JSON.stringify(result)
                    result.message = 'Please provide your security detail to continue';
                    toastr.success(result.message); 
                    $('#verify_user_account').show();
                    $('#verify_email').hide();
                }      
            }else{
                toastr.error(result.data['message']);    
            }
            stopLoad()                                    
            return false;
        }
        if(option){
            var userdetails = JSON.parse(sessionStorage.resetPasswordDetail)
            console.dir(userdetails);
            var SecurityQuestion = $('#resetSecurityQuestion').val();
            var SecurityAnswer = $('#resetSecurityAnswer').val();
            var password = $('#resetpassword').val();
            var confirmPassword = $('#resetConfirmPassword').val();
            if(SecurityQuestion == '' || SecurityQuestion == null){toastr.error('Please Provide Security Question'); return false;}
            if(SecurityAnswer == '' || SecurityAnswer == null){toastr.error('Please Provide Security Answer'); return false;}
            if(password.length<8|| sessionStorage.passwordStrenght !='strong'){alert('Please Confirm that you entered a new password and it matches the confirm password field. Note that your password cannot be lesser than 8 characters and should contain text, numbers and symbols'); return false;}
            if(password == '' || password != confirmPassword ){alert('The Password Entered Does Not Match Confirm Password Field.'); return false;}
            var data = {
                "UserId": userdetails.data.Email,
                "SecurityQuestion": SecurityQuestion,
                "SecurityQuestion2": "",
                "SecurityAnswer": SecurityAnswer,
                "SecurityAnswer2": "",
                "Channel": "ARM_PAYDAY_MOBILE"
            }
            if (validateObj(data)){
                renda.loader('start')
                loginClass.forgotPassword(JSON.stringify(data))                
                //renda.post('v1/ARMONE/AnswerSecurityChallenge',JSON.stringify(data),'reset_password',null,null,'forgot_password')            
            }else{
                return false;
            }     
        }else{
            var email = document.getElementById('Username').value;
            data = {
                "Email":email
            };
            if (validateObj(data)){
                renda.loader('start')
                // old password restt
                /* renda.post('/authentication/email/passwordReset',JSON.stringify(data),'login'); */
                data = JSON.stringify(data)
                renda.post('Account/FetchUserByEmail',JSON.stringify(data),'forgot_password')            
            }else{
                return false;
            }
        }      
        
        return false;  
    }
    function checklogin(){

      if (typeof(Storage) !== "undefined") {
            if(sessionStorage.loggedin){ 
                var result = JSON.parse(sessionStorage.UserInfo)
                updateUserData()
                
                if(String(result['data']['ProgressStatus']) == 'KYC Submitted' || String(result['data']['ProgressStatus']) == "Existing Customer"){
                    if (renda.Config.currentPage == 'dashboard') {
                        return false;
                    }else{
                        renda.page('dashboard');
                    }
                    return false;
                }
                if (result['data']['Status'] != 'active') {
                    renda.page('register_otp')
                    return false;
                } 
                if (
                    result['data']['ProgressStatus'] == null || result['data']['ProgressStatus'] == 'null' ||
                    result['data']['ProgressStatus'] == 'Stage 1 Completed' || result['data']['ProgressStatus'] == 'Stage 2 Completed' || 
                     result['data']['BVN'] == null || result['data']['Gender'] == null
                ){
                    
                    renda.page('setup_profile')
                    return false;                                
                }                   
                if(result['data']['ProgressStatus'] == 'KYC Rejected'){
                    renda.page('setup_profile')
                    return false;  
                }

                if (renda.Config.currentPage == 'dashboard') {
                    return false;
                }else{
                    renda.page('dashboard');
                }
                return false;
            }else{
                if (renda.Config.currentPage == 'dashboard') {
                    renda.page('login');
                    return false;
                }else{
                    renda.page('splashscreen');
                }
            }
        }else{
           // alert('PayDay Investor was unable to start successfully. Plaese contact admin')
            console.log('Error with javascript');
        }
    }
    function authenticateUser(){    
        /*$.ajax({
            url: vmsBaseUrl+"vendor/all",
            type: 'GET',
            beforeSend:function(xhr){ startLoad();
                xhr.setRequestHeader('Authorization','Bearer ' + sessionStorage.usertoken);
                
            },
            data: {
                  
                },
            success: function (response) {
                var authenticate =response.status;
                if (authenticate != true){logout();}else{////console.log('User Authenticated Successfully');}
                $('#msgDiv').html("<b>...</b>");
            },
            error: function (error) {
                //console.log(error);
            }
        });*/
    }
    function populateDataTable(data,columns,table){
        
        if ( $.fn.dataTable.isDataTable( '#'+table ) ) {
            $('#vendortable').DataTable( {
                destroy:true,
                data: data,
                columns: columns
            });
            
        }else{
            $('#'+table).DataTable( {
                destroy:true,
                data: data,
                columns:columns
            });
        }
        styleDataTable();
    }
    function populateGridView(data,element,action){
        
        if ( $.fn.dataTable.isDataTable( '#'+table ) ) {
            $('#vendortable').DataTable( {
                destroy:true,
                data: data,
                columns: columns
            });
            
        }else{
            $('#'+table).DataTable( {
                destroy:true,
                data: data,
                columns:columns
            });
        }
        styleGridView();
    }
    function styleDataTable(){
        $( "select" ).addClass( " w3-text-black w3-input w3-quarter");
        $( "input" ).addClass( " w3-text-black w3-input w3-quarter");
        $( "small-6" ).addClass( " indigo ");
        $( "th" ).addClass( " w3-text-white " );
        $(".small-6").find('label').addClass( "w3-text-black w3-medium");
        $(".small-6").find('div').addClass( "w3-padding w3-text-black w3-medium" );
        $(".small-6").find('a').addClass( "w3-text-black" );
        $(".current").find('a').addClass( "w3-indigo" );

    }
    function styleGridView(){
        $( "input[type='search']" ).addClass( " w3-text-black w3-input w3-half");
        $( "th" ).addClass( " w3-text-white " );
        $(".small-6").find('label').addClass( "w3-text-black w3-medium");
        $(".small-6").find('div').addClass( "w3-padding w3-text-black w3-medium" );
        $(".small-6").find('a').addClass( "w3-text-black" );
        $(".current").find('a').addClass( "w3-indigo" );

    }
    function validateObj(obj,silentMode){
        var errorFound = 0;
        $.each( obj, function( key, value ) {
            if (value) {
                if (value == null || value == '' || value.lenght == 0) {
                    if(silentMode){}else{
                        toastr.error('Please fill in detail for: '+key);
                    }
                    errorFound ++;
                }   
            }else if (value == undefined) {
                
            }else if (value == 0) {
                
            }else{
                if(silentMode){}else{
                    toastr.error('Please fill in detail for: '+key);
                }
                errorFound ++; 
            }

        });
    
        if (errorFound>0) {
            return false;
        }else{
            return true;
        }

    }
    function logout(){ 
        sessionStorage.clear();
        renda.page('login');
        window.clearTimeout(timer_);
    }
    function stopLoad(){
        $(".loadingbar").hide();
        $("#loadingbar").hide();
        $("#loadingbarr").hide();
        $("#loader").hide();
        $(".showAjaxLoad").removeClass('w3-animate-fading');
    }
    function startLoad(){
        $(".loadingbar").show();
        $("#loadingbarr").show();
        $("#loader").show();
        $(".showAjaxLoad").addClass('w3-animate-fading');
    }
    function updateDataFromApi(data){
        loadDashboardData(null,'dashData')
        loadDashboardData(null,'cards')
        return false;  
    }
    function stats(data,option){
        //console.log(data)
        if (data) {
            stopLoad()
            try{
                JSON.parse(data);
            }catch(err){
                if(option == 'cards'){
                }else{
                    toastr.error('An error occured while performing request.')
                    
                }
                console.dir(err);
                return false;
            }
            if (option == 1 || option == 'new') {
                data = JSON.parse(data);
                sessionStorage.dashboardData = JSON.stringify(data);
                commonData.Dashboard = data['data']
                commonData.User = payday.user
                navApp.data = commonData;
                dashboardApp.commonData = commonData;   
            }else if (option == 'cards') {
                data = JSON.parse(data);
                sessionStorage.userCards = JSON.stringify(data); 
                data = modResult(data)       
                cardsApp.cards = data['data'];   
                
            }else{ // chences
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
    //toastr options
    toastr.options.closeButton = true;
    toastr.options.timeOut = 4000;
    toastr.options.closeEasing = 'swing';
    toastr.options.preventDuplicates = true;
    toastr.options.positionClass='toast-top-center';
    toastr.options.fontSize = '200em';

    window.onload = canceltimer;
    document.onmousemove = canceltimer;
    document.onkeypress = canceltimer;
    var timer_ = 0;

function inactivity_lunch () {
  timer_ = setTimeout(function(){
  logout();
  },900000);   // 10 minutes
}

function canceltimer() {
  window.clearTimeout(timer_);  // cancel the timer on each mousemove/click/load
  inactivity_lunch();  
}

function openLinkInBrowser(link){
    globalLinkVar = window.open(link, '_blank', 'location=yes');
}

function generateToken(length) {
    var chars = '0123456789',result=0;
    for (var i = length; i > 0; --i)
        result += chars[Math.round(Math.random() * (chars.length - 1))]
    return parseInt(result)
}

function modResult(data){
    var result = data;
    var modResult = result;
    result = {
        data:'',
        message:'',
        status:200
    };
    result.data = modResult;
    return result;
}

function promiseXmlHTTP(options){
    startLoad()
    return new Promise(function(resolve, reject) {
        $.ajax(options).done(resolve).fail(reject);
    });
}

window.onbeforeunload = function (e) {
    /* //var e = e || window.event;
    var e = e ;
    // For IE and Firefox
    if (e) {
      e.returnValue = 'Are You Sure?';
    }
  
    // For Safari
    return 'Are You Sure?'; */
  };

  'use strict';

function sendEmail(option, data) {
    console.log('option', option);
    console.log(data);

    switch (option) {
        case 'register':
            var subject = 'Account Activation';
            var message = '\n            Hi ' + data.data.Firstname + ', <br/>\n            Welcome to PayDay Investor!<br/>\n            You have taken the first step towards achieving that financial goal. <br/>\n            Let’s get started! You can choose to invest weekly or monthly, directly from your Naira debit card.<br/>\n            Your username/email address is: ' + data.data.Email + '.<br/>\n            Please provide the code below as requested on Payday Mobile App to activate your account.<br/>\n            <br/><big><b>' + data.data.Token + '</b></big><br/><br/>\n            All the right answers are in our FAQ section. However, feel free to complete the Contact Us form if\n            you think your question requires special attention. We hope to give you a prompt and thorough response. <br/>\n            <br/>\n            Thank you for choosing to invest with PayDay Investor. \n            <br/><br/>\n            Best Regards,<br/>\n            PayDay Investor Team\n            <style>\n                img{\n                    height:200px!important;\n                    width:200px!important;\n                }\n            </style>\n            ';
            var email = data.data.Email;
            break;

        case 'resendRegisterToken':
            var subject = 'Account Activation';
            var message = '\n            Hi ' + data.data.Firstname + ', <br/>\n            Welcome to PayDay Investor!<br/>\n            You have taken the first step towards achieving that financial goal. <br/>\n            Let’s get started! You can choose to invest weekly or monthly, directly from your Naira debit card.<br/>\n            Your username/email address is: ' + data.data.Email + '.<br/>\n            Please provide the code below as requested on Payday Mobile App to activate your account.<br/>\n            <br/><big><b>' + data.data.Token + '</b></big><br/><br/>\n            All the right answers are in our FAQ section. However, feel free to complete the Contact Us form if\n            you think your question requires special attention. We hope to give you a prompt and thorough response. <br/>\n            <br/>\n            Thank you for choosing to invest with PayDay Investor. \n            <br/><br/>\n            Best Regards,<br/>\n            PayDay Investor Team\n            <style>\n                img{\n                    height:200px!important;\n                    width:200px!important;\n                }\n            </style>\n            ';
            var email = data.data.Email;
            break;
        case 'createGoal':
            var duration_type = data.data.Frequency.replace("ly", "(s)");;
            var subject = 'Create Goal';
            var message = '\n            Hi ' + data.data.Firstname + ', <br/>\n            Thank you for investing via PayDay Investor!<br/>\n            Congratulations, you have successfully set up a goal. Please see the details of your goal below:<br/>\n            <br/>\n            Goal Name: ' + data.data.ItemName + '<br/>\n            Target Amount: NGN ' + data.data.GoalAmount + '<br/>\n            Periodic Contribution Amount: NGN ' + data.data.MonthlyDeduction + ' <br/><br/>\n            You will reach your goal in ' + data.data.Duration + ' ' + duration_type + '<br/><br/>\n            Let the countdown begin!<br/>\n\n            <br/>\n            If you did NOT initiate this action, kindly complete the Contact Us form on the PayDay Investor App or Website for immediate assistance\n            <br/><br/>\n            Best Regards,<br/>\n            PayDay Investor Team\n            <style>\n                img{\n                    height:200px!important;\n                    width:200px!important;\n                }\n            </style>\n            ';
            var email = data.data.Email;
            break;
        case 'deleteGoal':
            var subject = 'Goal Deleted';
            var message = '\n            Hi ' + data.data.Firstname + ', <br/>\n            :( Your Goal ' + data.data.ItemName + ' has been deleted from the Payday App.<br/>            <br/>\n            If you did NOT initiate this action, kindly complete the Contact Us form on the PayDay Investor App or Website for immediate assistance\n            <br/>\n            Interested in setting up another goal? Log on to your Payday Mobile App to get started.\n            <br/>\n            Best Regards,<br/>\n            PayDay Investor Team\n            <style>\n                img{\n                    height:200px!important;\n                    width:200px!important;\n                }\n            </style>\n            ';
            var email = data.data.Email;
            break;
        case 'editGoal':
            var subject = 'Goal Modified';
            var message = '\n            Hi ' + data.data.Firstname + ', <br/>\n            You recently modified your Goal. Please see the new details of your goal below:<br/>\n            <br/>\n            Goal Name: ' + data.data.ItemName + '<br/>\n            Target Amount: NGN ' + data.data.GoalAmount + '<br/>\n            Periodic Contribution Amount: NGN ' + data.data.MonthlyDeduction + ' <br/><br/>\n            You will reach your goal in ' + data.data.Duration + '<br/><br/>\n            Let the countdown begin!<br/>\n\n            <br/>\n            If you did NOT initiate this action, kindly complete the Contact Us form on the PayDay Investor App or Website for immediate assistance\n            <br/><br/>\n            Best Regards,<br/>\n            PayDay Investor Team\n            <style>\n                img{\n                    height:200px!important;\n                    width:200px!important;\n                }\n            </style>\n            ';
            var email = data.data.Email;
            break;
        case 'suspendGoal':
            var subject = 'Goal Suspended';
            var dateSuspended = new Data();
            dateSuspended = dateSuspended.toDateString();
            var message = '\n            Hi ' + data.data.Firstname + ', <br/>\n            You have successfully suspended your goal. Your automated debits to this goal have also been suspended.  <br/>\n            Please see the new details of your goal below:<br/>\n            <br/>\n            Goal Name: ' + data.data.ItemName + '<br/>\n            Amount Attained: NGN ' + data.data.AmountAttained + '<br/>\n            Date Suspended: NGN ' + dateSuspended + ' <br/><br/>\n           <br/>\n            If you wish to continue with this goal, kindly log into your account and click the Resume Goal button to continue investing towards your goal. \n            <br/>\n            For more information, please read the Frequently Asked Questions (FAQs) or complete the Contact Us form on the PayDay Investor App or Website.\n            <br/><br/>\n            Best Regards,<br/>\n            PayDay Investor Team\n            <style>\n                img{\n                    height:200px!important;\n                    width:200px!important;\n                }\n            </style>\n            ';
            var email = data.data.Email;
            break;
        case 'contactUs':
            var subject = data.Subject;
            var message = '\n            Enquiry from ' + data.name + ' (' + data.email + ')<br/><br/>\n            ' + data.message + '\n            <br/><br/>\n            \n            <style>\n                img{\n                    height:200px!important;\n                    width:200px!important;\n                }\n            </style>\n            ';
            var email = "hello@paydayinvestor.ng,IT@arm.com.ng,ittransformation@arm.com.ng";
            break;
        case 'passwordChanged':
            var subject = 'Your password has been changed';
            var message = '\n            Hi ' + data.data.Firstname + ', <br/>\n            Your password has been changed!<br/>\n            <br/>\n            This email confirms that your pasword has been changed.<br/>\n            To log on to your account, use your newly created credentials<br/>\n            <br/><br/>\n            Email: ' + data.data.Email + '<br/><br/>\n            Password: *********<br/>\n\n            <br/>\n            If you have any questions or encounter any problems login in, please contact a site administrator\n            <br/><br/>\n            For more information, please read the Frequently Asked Questions (FAQs) or complete the Contact Us form on the PayDay Investor App or Website.\n            <br/><br/>\n            Thank you for saving with PayDay Investor.<br/><br/>\n            Best Regards, <br/><br/>\n            PayDay Investor Team\n           \n            <style>\n                img{\n                    height:200px!important;\n                    width:200px!important;\n                }\n            </style>\n            ';
            var email = data.data.Email;
            break;

        default:
            break;
    }
    if (email) {
        var ndata = {
            "RecipientEmail": email,
            "Subject": subject,
            "body": message,
            "isHtml": true,
            "Attachment": ''
        };
        ndata = JSON.stringify(ndata);
        renda.post('Utility/SendEmail', JSON.stringify(ndata), 'mailResponse');
    } else {
        //console.log('error performing request. Data missing')
    }
}
  function mailResponse(data){
    console.log('========mail send response')
    if(data['message']){
        sendAppLog('custom','Send Email'+'::'+data+'::'+renda.Config.currentPage);
        if(renda.Config.currentPage == 'register_otp'){
            alert('If you did not recieve the token that was sent to your email address, kindly tap resend token.')
            $('#resendUserTokenDiv').show()
        }
    }else{}
    console.log(data)
  }
  function updateOnlineStatus() {
    //toastr.info('Connection established')
  }
  function updateOfflineStatus(){
    toastr.warning('Your device is offline. Please ensure you have adequate internet coverage')      
}
window.addEventListener('online',  updateOnlineStatus);
window.addEventListener('offline', updateOfflineStatus);
function checkInternet() {  
    $.get("http://paydayinvestor.ng/").done(win).fail(fail);
    function win(){
        updateOnlineStatus();
    }
    function fail(){
        updateOfflineStatus();
    }
}
document.addEventListener("deviceready", function(e){
    //console.log(navigator.connection.type);
    document.addEventListener("offline", function(e){
        updateOfflineStatus()
    }, false);  
}, false);  
function checkPasswordStrenght(){
    $('.checkPass').keyup(function(e) {
      /*   var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}"); */
        var letters = new RegExp(/[a-zA-Z]/);
        var uppercase = new RegExp(/[A-Z]/);
        var digits = new RegExp(/\d/);
        var specials = new RegExp(/[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/);
        var pass = $(this).val();
        if(letters.test(pass) && digits.test(pass) && pass.length >=8 && uppercase.test(pass)){
            sessionStorage.passwordStrenght ='strong';
        }else{
            sessionStorage.passwordStrenght ='weak';
        }
        //console.log('Letter:'+letters.test(pass)+';Specials:'+specials.test(pass)+';Digits:'+digits.test(pass)+';Uppercase:'+uppercase.test(pass)+'Lenght:'+pass.length)
        
        return true;
   });
}
function checKycStatus(){
    if(payday.user.ProgressStatus == 'KYC Approved' || payday.user.ProgressStatus == 'Existing Customer'){
        return true;
    }else{
        return false;
    }
}


function goToTest(){
    renda.Config.serverUrl = 'http://192.168.250.29:8000/pdiv/';
    paydayWebBaseUrl = "https://paydayinvestor.ng/api/v1";
    armOneBaseUrl = "http://192.168.250.29:8000/armauth";
    paydayWebKongUrl = "http://192.168.250.29:8000/paydaypayment";
    renda.Config.httpRequestAuth.authToken = "YXJtOkBybTFrMHkxbEBnMHM=";
    
}

function goToHttp(){
    renda.Config.serverUrl = 'http://41.216.170.131:8000/pdiv/';
    paydayWebBaseUrl = "https://paydayinvestor.ng/api/v1";
    armOneBaseUrl = "http://41.216.170.131:8000/armauth";
    paydayWebKongUrl = "http://41.216.170.131:8000/paydaypayment";
    renda.Config.httpRequestAuth.authToken = "YXJtOkBybTFrMHkxbEBnMHM=";
    
}

function addCommas(str) {
    //return (str+"").replace(/.(?=(?:[0-9]{3})+\b)/g, '$&,');
   // console.log('before parseint:',str)
    var newFigures = parseInt(str);
   // console.log('after parseint:',newFigures)    
    newFigures =  newFigures.toLocaleString('en')
    //console.log('after add int:',newFigures)
    return newFigures
    
}

function showDropDown(){
    var x = document.getElementById("walletOptions");
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
    } else { 
        x.className = x.className.replace(" w3-show", "");
    }
}

function compressImg(source_img_obj, quality, maxWidth, output_format){
    var mime_type = "image/jpeg";
    if(typeof output_format !== "undefined" && output_format=="png"){
        mime_type = "image/png";
    }

    maxWidth = maxWidth || 1000;
    var natW = source_img_obj.naturalWidth;
    var natH = source_img_obj.naturalHeight;
    var ratio = natH / natW;
    if (natW > maxWidth) {
        natW = maxWidth;
        natH = ratio * maxWidth;
    }

    var cvs = document.createElement('canvas');
    cvs.width = natW;
    cvs.height = natH;

    var ctx = cvs.getContext("2d").drawImage(source_img_obj, 0, 0, natW, natH);
    var newImageData = cvs.toDataURL(mime_type, quality/100);
    var result_image_obj = new Image();
    result_image_obj.src = newImageData;
    return result_image_obj;
}

function sendAppLog(message,msg){
    var sendMsg = false;
    var data = {}
    data.appUserId = localStorage.appUniqieId    
    switch (message) {
        case 'sessionStarted':
            data.ErrorMessage = "new session started";
            sendMsg = true
            break;
        case 'custom':
            data.ErrorMessage = msg;
            sendMsg = true
            break;
        default:
            break;
    }
    if (sendMsg){
        data = JSON.stringify(data);
        console.dir(data)
        renda.post("Utility/LogError",JSON.stringify(data),'sendAppLog');     
    }else{
        console.log('Log Result: '+message)  
    }
    return false;    
}    

/* Used to establish connection with server */
function preloadServer(data,id){
    if(data){
        console.log('preload success')
    }else{
        var email = $('#'+id).val();
        data = {
            "Email":email
        };
        data = JSON.stringify(data); 
        renda.post('Account/FetchUserByEmail',JSON.stringify(data),'preloadServer')
    }
    
}
var backBtnCounter = 0;
function performBackBtn(){
    var currentPage = renda.Config.currentPage
    switch (currentPage) {
        case 'home':
            backBtnCounter++;
            if(backBtnCounter >=2){
                var confirm = window.confirm('You are about to close PayDay Investor');
                if(confirm){
                    if (typeof cordova !== 'undefined') {
                        if (navigator.app) {
                            navigator.app.exitApp();
                        }
                        else if (navigator.device) {
                            navigator.device.exitApp();
                        }
                    } else {
                        window.close();
                        $timeout(function () {
                            self.showCloseMessage = true;  //since the browser can't be closed (otherwise this line would never run), ask the user to close the window
                        });
                    }
                }else{
                    backBtnCounter = 0;
                }
            }
            break;
        case 'login':
            renda.page('home');
            break;
        case 'forgot_password':
            renda.page('login');
            break;
        case 'register':
            renda.page('home');
            break;
        default:
            break;
    }
}
