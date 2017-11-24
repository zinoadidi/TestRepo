renda.loader('stop')
function register(data){
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
        startLoad()
        renda.post('/authenticate/login',JSON.stringify(data),'login');
    }else{
        return false;
    }
    return false;  
}
