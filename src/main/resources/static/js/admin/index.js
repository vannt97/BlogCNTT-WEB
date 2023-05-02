

$(document).ready(()=>{
    let username = localStorage.getItem("username");
    if (username){
        $("#username-Tk").html(username);
    }
})

function uploadImage(selectedFile,callback){
    let dataForm = new FormData();
    dataForm.set("file", selectedFile);
    let dataToken = Base64.decode(getCookie('s_t'));
    if(getCookie('s_t')){
        $.ajaxSetup({
            headers:{
                Authorization: "Bearer " + dataToken,
            }
        })
    }
    $.ajax({
        url: LINK_API + "upload",
        type: "POST",
        data: dataForm,
        enctype: 'multipart/form-data',
        processData: false,
        contentType:false,
        dataType : 'json',
        success: function (response) {
            callback(response);
        },
    }).fail(function (error){
        console.log(error)
    })
}


