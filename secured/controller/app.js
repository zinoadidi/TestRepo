    
   $(document).ready(function(){ 
        //load extra files
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
        // check app cache
      
    });
    /* Basic Functions */
    function login(data,option){
        if (data) {
            try{
                JSON.parse(data);
            }catch(err){
                stopLoad()
                toastr.error('An error occured while performing request.')
                console.dir(err);
                return false;
            } 
            let result = JSON.parse(data);
            //let result = USERDATA;
            console.dir(result);

            if(option == 'armOne'){
                if(result.ResponseCode && result.ResponseCode== "00"){ 
                    loginClass.serverSettings.numOfTimesGenerated = 0;
                    if(result.StatusMessage == ''){
                        result.StatusMessage = 'Login successful.';
                    }else{
                        result.StatusMessage = 'Login successful. Please wait while we prepare your account';
                    }
                    toastr.success(result.StatusMessage);
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
                console.log(result)
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
                        renda.page('dashboard')
                        return false;                   
                }else{
                    toastr.error(result['message']);    
                }
                stopLoad()            
                return false;
            }
        }else{
            let email = document.getElementById('Username').value;
            let pass = document.getElementById('Password').value; 
            
            data = {
                "Membershipkey": email,
                "Password": pass,
                "RedirectURL": "#!/dashboard",
                "Channel": "ARM_PAYDAY_MOBILE"
            };
            if (validateObj(data)){
                renda.loader('start')
                loginClass.authenticateUser(JSON.stringify(data));
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
                toastr.error('An error occured while verfying user information.')
                console.dir(err);
                return false;
            } 
            let result = JSON.parse(data);
            result = modResult(result)
            console.dir(result);
            if (result.status == 200){
               if(option){
                 
               }else{
                result.message = 'Please provide your security detail to continue';
                toastr.success(result.message); 
                $('#verify_user_account').show();
                $('#verify_email').hide();
               }      
            }else{
                toastr.error(result['message']);    
            }
            stopLoad()                                    
            return false;
        }
        let email = document.getElementById('Username').value;
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
        return false;  
    }


    function checklogin(){

      if (typeof(Storage) !== "undefined") {
            if(sessionStorage.loggedin){ 
                let result = JSON.parse(sessionStorage.UserInfo)
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
            
                if (renda.Config.currentPage == 'dashboard') {
                    return false;
                }else{
                    renda.page('dashboard');
                }
                return false;
            }else{
                if (renda.Config.currentPage == 'dashboard' || renda.Config.currentPage == '') {
                    renda.page('login');
                    return false;
                }else{
                    
                }
            }
        }else{
            alert('error with JS')
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
                if (authenticate != true){logout();}else{console.log('User Authenticated Successfully');}
                $('#msgDiv').html("<b>...</b>");
            },
            error: function (error) {
                console.log(error);
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

    // update app cache


    function updateDataFromApi(data){
        loadDashboardData(null,'dashData')
        loadDashboardData(null,'cards')
        return false;  
    }

    function stats(data,option){
        console.log(data)
        if (data) {
            stopLoad()
            try{
                JSON.parse(data);
            }catch(err){
                toastr.error('An error occured while performing request.')
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
    toastr.options.positionClass='toast-top-right';
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
