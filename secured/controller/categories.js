
function prepareCatForm(){      
     /*initialize file upload component*/
    $(function () {
        $('#user_id').val(sessionStorage._id);
        'use strict';
        // Change this to the location of your server-side upload handler:
        var url = "http://174.138.81.101:3000/api/file/upload";
        $('#fileupload').fileupload({
            url: url,
            dataType: 'json',
            beforeSend: function(xhr) {
                startLoad();
                toastr.warning("File Upload Started. Please Wait!");
                xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.usertoken);
            },
            add: function (e, data) {
                data.submit();
            },
            done: function(e,data){
                console.log(data);
                temporaryApp.vm.fileId = data.result.data.files[0]._id;
                $.each(data.files, function (index, file) {
                    var clientImgUrl = '<img src ="http://174.138.81.101:3000/' + data.result.data.files[0].path+'" width="100%"/>';
                    $('#clientPicForm').html(clientImgUrl);  
                });
                toastr.success("File Upload Completed");
                stopLoad();
            },
            progressall: function (e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);
                $('#progress .progress-bar').css(
                    'width',
                    progress + '%'
                );
            }
        }).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');
            
    });
    
}


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
            loadComponent('categories','create','dashboardDisplayDiv');
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

function listCategory(data){
    if (data) {
        var result = data;
        if (result.success == true){
            console.log(data);
            var item = '';
            var count=0;
            var category = [];
            $.each(result.data, function (key, data) {
                count +=1;
                if (data) {
                    data.image = '<img src ="'+ monetizeImgUrl + data.image.path+'" width="50px" height="35px"/>';
                    category.push({
                        'sn':count,
                        'name':data.name,
                        'description':data.description,
                        'image':data.image,
                        'creationDate':String(data.createdAt)
                    }); 

                }else{
                }     
            });
            var columns =  [
                { data: 'sn'},
                { data: 'name' },
                { data: 'description' },
                { data: 'image' }
            ];
            populateDataTable(category,columns,'categoriesListTable');
        
        }else{
            toastr.error(result.message); 
        }            
        return false;
    }else{
        requestAPIData('category/all','listCategory');
    }
}