
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

function listContents(data,type){
    if (data) {
        var result = data;
        if (result.success == true){
            console.log(data);
            var item = '';
            var count=0;
            var contents = [];
             var Contents = null;
            if(result.data.contents){
                Contents = result.data.contents;
            }
            $.each(Contents, function (key, data) {
                count +=1;
                if (data) {
                    var viewDetailBtn = "<button class='w3-button deep-purple darken-2 white-text' onclick=\"viewSingleContent(null,'"+data._id+"')\"><i class='fa fa-book'></i></button>"
                    contents.push({
                        'sn':count,
                        'title':data.title,
                        'createdBy':data.createdBy.firstName+' '+data.createdBy.lastName,
                        'email':data.createdBy.email,
                        'phoneNo':data.createdBy.phoneNo,
                        'category':data.category.name,
                        'dateCreated':data.createdAt,
                        'viewDetail':viewDetailBtn
                    }); 

                }else{
                }     
            });
            console.log(contents);
            var columns =  [
                { data: 'sn'},
                { data: 'title' },
                { data: 'createdBy' },
                { data: 'email' },
                { data: 'phoneNo' },
                { data: 'category' },
                { data: 'dateCreated' },
                { data: 'viewDetail' }
            ];
            populateDataTable(contents,columns,'contentsListTable');
        
        }else{
            toastr.error(result.message); 
        }            
        return false;
    }else{
        if (type == 'all') {
            $('#pageTitle').html('All Contents');
            requestAPIData('content/all','listContents');
        }
        if (type == 'pending') {
            $('#pageTitle').html('Pending Contents');
            requestAPIData('content/all/pending','listContents');
        }
        if (type == 'rejected') {
            $('#pageTitle').html('Rejected Contents');
            requestAPIData('content/all/rejected','listContents');
        }
        if (type == 'approved') {
            $('#pageTitle').html('Approved Contents');
            requestAPIData('content/all/approved','listContents');
        }
        return false;
    }
}

function viewSingleContent(data,id){
    if (data) {
        temporaryApp.vm = data.data.content;
        if (data.success == true){
            var content = temporaryApp.vm;
            console.log(content);
            $('#viewSingleContentModal').fadeIn('slow');
            $('#SingleContentDetailDiv').html('');
            $.each(content, function (key, value) {
                console.log(value);
                var html = '<tr><td class="m3 l3 s3">'+key+'</td><td class="m8 l8 s8">'+value+'</td></tr>';
                if (key == 'media' || key == '__v'|| key == '_id'|| key == 'approvedBy' || key == 'image') {
                   html = ""; 
                }
                if (key == 'createdBy') {
                    html = "<tr><td><b>"+key+"</b></td><td></td></tr>";
                    $.each( value, function( nkey, nvalue ) {
                        if (nkey == 'firstName' || nkey == 'lastName'|| nkey == 'email'|| nkey == 'phoneNo') {
                           html += '<tr><td class="w3-margin-left m3 l3 s3">'+nkey+'</td><td class="m8 l8 s8">'+nvalue+'</td></tr>';     
                        }else{}
                    });
                    html +="<tr class='w3-grey'><td><td></tr>"
                }
                if (key == 'category') {
                    html = "<tr><td><b>"+key+"</b></td><td></td></tr>";
                    $.each( value, function( nkey, nvalue ) {
                        if (nkey == 'name' || nkey == 'description') {
                           html += '<tr><td class="w3-margin-left m3 l3 s3">'+nkey+'</td><td class="m8 l8 s8">'+nvalue+'</td></tr>';     
                        }else{}
                    });
                    html +="<tr class='w3-grey'><td><td></tr>"
                }
                if(key =='createdAt' || key == 'approvedAt'){
                    value = moment(value,"YYYY-MM-DD") 
                    html = '<tr><td class="m3 l3 s3">'+key+'</td><td class="m8 l8 s8">'+value._d+'</td></tr>';
                }
                $('#SingleContentDetailDiv').append(html);
            
            });
        }else{
            toastr.error(data.message); 
        }            
        return false;
    }else{
        requestAPIData('content/'+id,'viewSingleContent');
        return false;
    }

}

function verifyContent(data,type){
    if (data) {
        var result = data;
        if (result.success == true){
            console.log(data);
            toastr.success(result.message); 
        }else{
            toastr.error(result.message); 
        }            
        return false;
    }else{
        var contentId = temporaryApp.vm._id;
        
        if (type == 'approve') {
            var data = {
                "userId":sessionStorage._id,
                "contentId":temporaryApp.vm._id,
                "message":temporaryApp.vm.approveMsg
            };
            updateAPIData('content/'+contentId+'/approve',data,'verifyContent');
        }
        if (type == 'reject') {
            var data = {
                "userId":sessionStorage._id,
                "contentId":temporaryApp.vm._id,
                "message":temporaryApp.vm.rejectMsg
            };
            updateAPIData('content/'+contentId+'/reject',data,'verifyContent');
        }
        
        return false;
    }
}