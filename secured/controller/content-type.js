/*declare temporary vue object*/

function validateContentTypeForm(){
    var errorFound = 0;
    var obj = {
        'name':temporaryApp.vm.name,
        'description':temporaryApp.vm.details,
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
        createContentType();
    }

}

function createContentType(data){
    if (data) {
        var result = data;
        if (result.success == true){
            toastr.success(result.message); 
            loadComponent('content-type','create','dashboardDisplayDiv');
        }else{
            toastr.error(result.message); 
        }            
        return false;
    }else{
        temporaryApp.vm.userId = sessionStorage.userid;
        var data = {
            "userId": temporaryApp.vm.userId,
            "name": temporaryApp.vm.name,
            "details": temporaryApp.vm.details
        }
        sendAPIData('content_type/create',data,'createContentType');
    }
}

function listContentType(data){
    if (data) {
        var result = data;
        if (result.success == true){
            console.log(data);
            var item = '';
            var count=0;
            var contentType = [];
            var ContentType = result.data.contentTypes;
            $.each(ContentType, function (key, data) {
                count +=1;
                if (data) {
                    contentType.push({
                        'sn':count,
                        'name':data.name,
                        'details':data.details,
                        'creationDate':String(data.createdAt)
                    }); 

                }else{
                }     
            });
            var columns =  [
                { data: 'sn'},
                { data: 'name' },
                { data: 'details' }
            ];
            console.log(contentType);
            populateDataTable(contentType,columns,'contentTypeListTable');
        
        }else{
            toastr.error(result.message); 
        }            
        return false;
    }else{
        requestAPIData('content_type/all','listContentType');
    }
}