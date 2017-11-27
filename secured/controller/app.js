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
        
        // check app cache
       
    });

    /* Basic Functions */
    function login(data){
        if (data) { 
            let result = JSON.parse(data);
            //let result = USERDATA;
            console.dir(result);
            if (result.status == 200){
                if(result.message == ''){
                    result.message = 'Login successful.';
                }
                toastr.success(result.message); 
                //decode token
                sessionStorage.UserId = result.data['UserId'];
                sessionStorage._id = result.data['UserId'];
                sessionStorage.UserInfo = JSON.stringify(result)
                updateUserData()
                sessionStorage.loggedin = true;

                // confirm user state
                    if (String(result['data']['ProgressStatus']) == 'KYC Submitted'){
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
                }else{
                    toastr.error(result['message']);    
                    if(result['status'] == 204){
                        renda.page('register_otp')
                        return false;
                    }
                }
            stopLoad()            
            return false;
        }
        let email = document.getElementById('Username').value;
        let pass = document.getElementById('Password').value; 
        
        data = {
            "Username":email,
            "Password":pass
        };
        if (validateObj(data)){
            renda.loader('start')
            renda.post('/authenticate/login',JSON.stringify(data),'login');
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
    }

    function stopLoad(){
        $(".loadingbar").hide();
        $("#loadingbar").hide();
        $("#loader").hide();
        $(".showAjaxLoad").removeClass('w3-animate-fading');
    }

    function startLoad(){
        $(".loadingbar").show();
        $("#loader").show();
        $(".showAjaxLoad").addClass('w3-animate-fading');
    }

    // update app cache
    function onUpdateReady() {
      console.log('found new version!');
      window.applicationCache.swapCache()
    }


