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
        existingVm: new existingUser(null)
      }
    });
 }

function register(data){
    if (data) { 
        stopLoad()
        let result = JSON.parse(data);
        //let result = USERDATA;
        console.dir(result);
        if (result.status == 200){
            toastr.success('Registration Successful')
            //decode token
            sessionStorage.UserId = result.data['UserId'];
            sessionStorage._id = result.data['UserId'];
            sessionStorage.UserInfo = JSON.stringify(result)
            updateUserData()
            // confirm user state
            renda.page('register_otp')             
        }else{
            alert(result['message']);    
        }
        return false;
    }else{
      
        url = "/register/stepOne";
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
        if(temporaryApp.regVm.Password.length < 8){
            toastr.error('Please Use a stronger password not less than 8 digit. Password must contain numbers and characters.');
            return false;
        }
        if(files){
            var ProfileUpload = renda.fileToBase64(files);
            ProfileUpload.then(function(result) {
                ProfileUpload = result;
                sendRegReq()
            });
        }else{
            toastr.error('Please Upload Profile Picture');
            showRegStep('register-step-1')
            return false;

        }
        function sendRegReq(){
            data = {
                "Surname":temporaryApp.regVm.Surname,
                "Firstname":temporaryApp.regVm.Firstname,
                "Middlename":temporaryApp.regVm.Middlename,
                "Email":temporaryApp.regVm.Email,
                "Phonenumber":temporaryApp.regVm.Phonenumber,
                "Password":temporaryApp.regVm.Password,
                "SecurityQuestion":temporaryApp.regVm.SecurityQuestion,
                "SecurityAnswer":temporaryApp.regVm.SecurityAnswer,
                "ProfilePic":ProfileUpload,
                "Token":' ',
                "PRToken":' ',
                "terms":true
            } 
            if (validateObj(data)){
                console.dir(data)
                renda.loader('start')
                renda.post(url,JSON.stringify(data),'register');     
            }else{
                return false;
            }      
        }
    }                   
}

function activateOtp(data){
    if (data) {
        stopLoad()            
        let result = JSON.parse(data);
        //let result = USERDATA;
        console.dir(result);
        if (result.status == 200){
            alert(result.message); 
            renda.page('login')
        } else{
            alert(result.message)
        }
        return false;
    }
    let Token = document.getElementById('Otp').value;
    let UserId = sessionStorage.UserId; 
    
    data = {
        "Token":Token,
        "UserId":UserId
    };
    if (validateObj(data)){
        renda.loader('start')
        renda.post('/activate',JSON.stringify(data),'activateOtp');
    }else{
        return false;
    }
    return false;  
}

function VerifyExistingClient(data){
    if (data) {
        stopLoad()            
        let result = JSON.parse(data);
        //let result = USERDATA;
        console.dir(result);
        if (result.status == 200){
            toastr.success(result.message); 

            existingApp.existingVm.MembershipNumber = result.data.MembershipNumber;
            existingApp.existingVm.Title = result.data.Title;
            existingApp.existingVm.FirstName = result.data.FirstName;
            existingApp.existingVm.LastName = result.data.LastName;
            existingApp.existingVm.FullName = result.data.FullName;
            existingApp.existingVm.DateOfBirth = result.data.DateOfBirth;
            existingApp.existingVm.Gender = result.data.Gender;
            existingApp.existingVm.PhoneNumber = result.data.PhoneNumber;
            existingApp.existingVm.MobileNumber = result.data.MobileNumber;
            existingApp.existingVm.EmailAddress = result.data.EmailAddress;
            existingApp.existingVm.Address = result.data.Address;
            existingApp.existingVm.State = result.data.State;
            existingApp.existingVm.Country = result.data.Country;
            showRegDiv('confirm_existing')
        } else{
            alert(result.message)
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
        renda.post('/authenticate/existingClient',JSON.stringify(data),'VerifyExistingClient');
    }else{
        return false;
    }
    return false;  
}

function regExistingClient(data){
    if (data) {
        stopLoad()            
        let result = JSON.parse(data);
        //let result = USERDATA;
        console.dir(result);
        if (result.status == 200){
            alert(result.message); 
            renda.page('login')
        }else{
            alert(result.message)
        }
        return false;
    }
    let MembershipNumber = existingApp.existingVm.MembershipNumber;
        
    data = {
        "MembershipNumber":MembershipNumber
    };
    if (validateObj(data)){
        renda.loader('start')
        renda.post('/register/existingClient',JSON.stringify(data),'regExistingClient');
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
        toastr.warning('Please Provide Infromation For The Field Above')
    }
}

function showRegStep(id){
    console.log(id)
    $('.reg-step').hide();
    $('.'+id).show();

}