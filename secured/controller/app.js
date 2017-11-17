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
        
    });

    /* Basic Functions */
    function login(data){
        if (data) {
            var result = data;
            if (result.success == true){
                toastr.success(result.message); 
                sessionStorage.usertoken= result.token;
                //decode token
                var decoded = jwt_decode(sessionStorage.usertoken);
                sessionStorage.userid = decoded._doc._id;
                sessionStorage._id = decoded._doc._id;
                sessionStorage.setItem('userinfo', JSON.stringify(decoded._doc));
                sessionStorage.loggedin = true;
                loadPage('dashboard');
            }else{
                toastr.error(result.message); 
            }            
            return false;
        }
        var email = document.getElementById('loginUser').value;
        var pass = document.getElementById('loginPass').value; 
        var data = {
            "email":email,
            "password":pass
        };
        sendAPIData('user/authenticate',data,'login');
        return false;  
    }

    function checklogin(){
      if (typeof(Storage) !== "undefined") {
            if(sessionStorage.loggedin){ 
                if (currentPage == 'dashboard') {
                    return false;
                }else{
                    loadPage('dashboard');
                }
                return false;
            }else{
                if (currentPage == 'dashboard' || currentPage == '') {
                    loadPage('login');
                    
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

    function validateObj(obj){
        var errorFound = 0;
        $.each( obj, function( key, value ) {
            if (value) {
                if (value == null || value == '' || value.lenght == 0) {
                    toastr.error('Please fill in detail for: '+key);
                    errorFound ++;
                }   
            }else{
                toastr.error('Please fill in detail for: '+key);
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
        loadPage('login');
    }

    function stopLoad(){
        $(".loadingbar").hide();
        $(".showAjaxLoad").removeClass('w3-animate-fading');
    }

    function startLoad(){
        $(".loadingbar").show();
        $(".showAjaxLoad").addClass('w3-animate-fading');
    }

