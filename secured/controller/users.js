$('.register-divs').hide();
renda.loader('stop')    
$('#welcomeDiv').fadeIn();       

 function initRegApp(){
    temporaryApp = new Vue({
      el: '#new',
      data: {
        regVm: new User(null)
      }
    });
 }
var existingApp = '';
function initExistingClientApp(){
    existingApp = new Vue({
      el: '#confirm_existing',
      data: {
        existingVm: new existingUser(null),
        armOneDetail:{
            IsARMOne:"",
            SecurityQuestion :"",
            SecurityAnswer:"",
            Password :""
        }
      }
    });
 }

function register(data){
    if (data) { 
        stopLoad()
        console.dir(data);        
        try{
            JSON.parse(data);
        }catch(err){
            stopLoad()
            toastr.error('An error occured while performing request.')
            alert(data)
            console.dir(err);
            return false;
        } 
        let result = JSON.parse(data);
        
        //let result = USERDATA;
        if (result.UserId){
            result = modResult(result);
            toastr.success('Registration Successful')
            //decode token
            sessionStorage.UserId = result.data['UserId'];
            sessionStorage._id = result.data['UserId'];
            sessionStorage.UserInfo = JSON.stringify(result)
            updateUserData()
            // confirm user state
            renda.page('register_otp')             
        }else{
            alert(result);    
        }
        return false;
    }else{

        var files = '';
        files = document.getElementById('ProfileUpload').files[0]
        if(temporaryApp.regVm.Password != temporaryApp.regVm.confirmPassword){
            toastr.error('Password does not match confirm password field');
            return false;
        }
        if(temporaryApp.regVm.Phonenumber.length != 11){
            toastr.error('Phone number must be 11 digits');
            showRegStep('register-step-1')
            return false;
        }
        if(temporaryApp.regVm.Password.length = '' || temporaryApp.regVm.Password.length < 8){
            toastr.error('Please Use a stronger password not less than 8 digit. Password must contain numbers and characters.');
            return false;
        }
        if(files){
            var ProfileUpload = renda.fileToBase64(files);
            ProfileUpload.then(function(result) {
                ProfileUpload = result.replace(/^data:image\/[a-z]+;base64,/, "");
                sendRegReq()
            });
        }else{
            toastr.error('Please Upload Profile Picture');
            showRegStep('register-step-1')
            return false;

        }
        function sendRegReq(){
            var token = generateToken(5);
            data = {
                "Surname":temporaryApp.regVm.Surname,
                "Firstname":temporaryApp.regVm.Firstname,
                "Middlename":temporaryApp.regVm.Middlename,
                "Email":temporaryApp.regVm.Email,
                "Phonenumber":temporaryApp.regVm.Phonenumber,
                "Password":temporaryApp.regVm.Password,
                "SecurityQuestion":temporaryApp.regVm.SecurityQuestion,
                "SecurityAnswer":temporaryApp.regVm.SecurityAnswer,
                "ProfilePic":'null',
                "Token":token,
                "PRToken":token,
                "terms":true
            } 
            if (validateObj(data)){
                console.dir(data)
                data.ProfilePic = null;
                data = JSON.stringify(data)
                renda.loader('start')
                renda.post("Account/RegisterSTG1",JSON.stringify(data),'register');     
            }else{
                return false;
            }      
        }
    }                   
}

function activateOtp(data){
    if (data) {
        stopLoad()   
        try{
            JSON.parse(data);
        }catch(err){
            toastr.error('An error occured while performing request.')
            console.dir(err);
            return false;
        }        
        let result = JSON.parse(data);
        //let result = USERDATA;
        console.dir(result);
        if (result.UserId){
            result = modResult(result);
            result.message = 'Account Activated successfully, Please log in to continue';
            alert(result.message); 
            renda.page('login')
        } else{
            alert(result)
        }
        return false;
    }else{
        let Token = document.getElementById('Otp').value;
        let UserId = sessionStorage.UserId; 
        let UserInfo = JSON.parse(sessionStorage.UserInfo);
    
        if(Token){
            if(Token == UserInfo.data.Token){
                UserInfo.data.Status = 'active';
            }else{
                toastr.error('Account Verification Failed!. Please confirm the code entered matches the one in your mail')
                return false;
            }
        }else{
            toastr.warning('Please Enter The Token Sent to Your Email to Continue')
            return false;
        }
        data = JSON.stringify(UserInfo.data);
        renda.loader('start')
        renda.post('Account/Update',JSON.stringify(data),'activateOtp');
        return false;  
    }
}

function VerifyExistingClient(data){
    if (data) {
        stopLoad()
        try{
            JSON.parse(data);
        }catch(err){
            toastr.error('An error occured while verfying user information.')
            console.dir(err);
            alert(data)                                               
            return false;
        }            
        let result = JSON.parse(data);
        
        //let result = USERDATA;
        console.dir(result);
        if (result.MembershipNumber){
            result = modResult(result);
            result.message = 'Welcome to Payday '+result.data.FullName+'!. Please confirm your details to continue';
            toastr.success(result.message); 

            existingApp.existingVm.MembershipNumber = result.data.MembershipNumber;
            existingApp.existingVm.FullName = result.data.FullName;
            existingApp.existingVm.DateOfBirth = result.data.DateOfBirth;
            existingApp.existingVm.Gender = result.data.Gender;
            existingApp.existingVm.MobileNumber = result.data.MobileNumber;
            existingApp.existingVm.EmailAddress = result.data.EmailAddress;
            existingApp.existingVm.Address = result.data.Address;
            existingApp.existingVm.State = result.data.State;
            existingApp.existingVm.Country = result.data.Country;
            existingApp.armOneDetail.IsARMOne = result.data.IsARMOne;
            showRegDiv('confirm_existing')
            if(result.data.IsARMOne){
            }else{
                alert('Please Enter A Password and select a security question to continue')
            }
        } else{
            alert(result)
        }
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
        data = JSON.stringify(data);
        renda.post('Account/AuthenticateExisting',JSON.stringify(data),'VerifyExistingClient');
    }else{
        return false;
    }
    return false;  
}

function regExistingClient(data){
    if (data) {
        stopLoad()
        try{
            JSON.parse(data);
        }catch(err){
            alert(data)            
            toastr.error('An error occured while verfying user information.')
            console.dir(err);
            return false;
        }            
        let result = JSON.parse(data);
        //let result = USERDATA;
        console.dir(result);
        if (result.UserId){
            result = modResult(result);
            result.message = 'Your account has been created. Please log in to continue';
            alert(result.message); 
            renda.page('login')
        }else{
            alert(result)
        }
        return false;
    }
    let MembershipNumber = existingApp.existingVm.MembershipNumber;
    if(existingApp.armOneDetail.IsARMOne){
        data = {
            "MembershipNumber":MembershipNumber,
            "IsARMOne" : existingApp.armOneDetail.IsARMOne
        };
    }else{
        data = {
            "MembershipNumber":MembershipNumber,
            "Password": existingApp.armOneDetail.Password,
            "SecurityQuestion" :  existingApp.armOneDetail.SecurityQuestion,
            "SecurityAnswer" :  existingApp.armOneDetail.SecurityAnswer,
            "IsARMOne" : existingApp.armOneDetail.IsARMOne
        };
        
    }
    if(existingApp.armOneDetail.Password != existingApp.armOneDetail.confirmPassword){
        toastr.error('Please confirm that your password matches "confirm password" field')
        return false
    }
    if(existingApp.armOneDetail.Password.length = '' || existingApp.armOneDetail.Password.length < 8){
        toastr.error('Please Use a stronger password not less than 8 digit. Password must contain numbers and characters.');
        return false;
    }
    data.IsARMOne = 'true'    
    if (validateObj(data)){
        renda.loader('start')
       data = JSON.stringify(data)
        renda.post('Account/RegisterExisting',JSON.stringify(data),'regExistingClient');
    }else{
        return false;
    }
    return false;  
}

function showRegDiv(el){
    $('.register-divs').hide();
     $('#'+el).fadeIn();       
}

function checkValue(el){
    if(el.value == ''){
        toastr.warning('Please Provide Infromation For This Field')
    }
}

function showRegStep(id){
    console.log(id)
    $('.reg-step').hide();
    $('.'+id).show();

}
