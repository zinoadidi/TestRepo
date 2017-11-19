
/*declare temporary vue object*/

function validateCategoryForm(){
    var errorFound = 0;
    var obj = {
        'name':temporaryApp.vm.name,
        'description':temporaryApp.vm.description,
        'picture':temporaryApp.vm.fileId
    };
    console.log(obj);

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
    console.log(temporaryApp.vm);
    if (errorFound>0) {
        return false;
    }else{
        createCategory();
    }

}

function createCategory(data){
    if (data) {
        var result = data;
        if (result.success == true){
            toastr.success(result.message); 
            loadComponent('dashboard','categories/create','dashboardDisplayDiv');
        }else{
            toastr.error(result.message); 
        }            
        return false;
    }else{
        temporaryApp.vm.userId = sessionStorage.userid;
        var data = {
            "userId": temporaryApp.vm.userId,
            "name": temporaryApp.vm.name,
            "description": temporaryApp.vm.description,
            "fileId": temporaryApp.vm.fileId
        }
        console.log(data);
        sendAPIData('category/create',data,'createCategory');
    }
}

function listUsers(data,type){
    if (data) {
        var result = data;
        if (result.success == true){
            var item = '';
            var count=0;
            var users = [];
            var Users = null;
            if(result.data.users){
                Users = result.data.users;
            }
            if(result.data.clients){
                Users = result.data.clients;
            }
            $.each(Users, function (key, data) {
                count +=1;
                if (data) {
                    if(data.firstName==null || data.firstName ==''){data.firstName = 'Not Provided';}
                    if(data.lastName==null || data.lastName ==''){data.lastName = 'Not Provided';}
                    if(data.phoneNo==null || data.phoneNo ==''){data.phoneNo = 'Not Provided';}
                    if(data.username==null || data.username ==''){data.username = 'Not Provided';}
                    users.push({
                        'sn':count,
                        'firstName':data.firstName,
                        'lastName':data.lastName,
                        'phoneNo':data.phoneNo,
                        'username':data.username
                    }); 

                }else{
                }     
            });
            console.log(users);
            var columns =  [
                { data: 'sn'},
                { data: 'firstName' },
                { data: 'lastName' },
                { data: 'phoneNo' },
                { data: 'username' }
            ];
            populateDataTable(users,columns,'usersListTable');
        
        }else{
            toastr.error(result.message); 
        }            
        return false;
    }else{
        if (type == 'allUsers') {
            requestAPIData('user/all','listUsers');
        }
        if (type == 'allClients') {
            requestAPIData('client/all','listUsers');
        }
        if (type == 'allCreators') {
            requestAPIData('user/role/59cd177e85beea380e856a88/count/all','listUsers');
        }
        return false;
    }
}