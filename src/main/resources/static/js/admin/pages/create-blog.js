$(document).ready(()=>{
    var $select;
    var $selectTag;
    $(document).ajaxStart(function (){
        Pace.restart();
    });

    getApi('categories', (res)=>{
        if(res.status !== 200) return;
        $select = $('#select-to').selectize({
            maxItems: null,
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            options: res.data,
            create: false
        });

    },(res) => {
        alert("lỗi hệ thống vui lòng đăng nhập lại");
        window.location.href = '/admin/create/blog';
    })

    getApi('tags', (res)=>{
        if(res.status !== 200) return;
        $selectTag = $('#select-to-tag').selectize({
            maxItems: null,
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            options: res.data,
            create: false
        });

    },(res) => {
        alert("lỗi hệ thống vui lòng đăng nhập lại");
        window.location.href = '/admin/create/blog';
    })

    $('#summernote').summernote({
        toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'underline', 'clear']],
            ['fontname', ['fontname']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['table', ['table']],
            ['insert', ['link', 'picture', 'video', ['embedLink']]],
            ['view', ['fullscreen', 'codeview', 'help']],
        ],
        buttons: {
            embedLink: insertLinkEmbedBtn
        },
        placeholder: '',
        tabsize: 2,
        height: 300,
        callbacks: {
            onImageUpload: function(files) {
                // upload image to server and create imgNode...

                let image = new Image();

                uploadImage(files[0],(response)=>{
                    if(response.succes){
                        image.src = response.data;
                        $('#summernote').summernote('insertNode', image);
                    }
                })

                // let reader = new FileReader();
                // //Read the contents of Image File.
                // reader.readAsDataURL(files[0]);
                // reader.onload = (e)=>{
                //     //Initiate the JavaScript Image object.
                //     //Set the Base64 string return from FileReader as source.
                //     image.src = e.target.result;
                //
                //     image.onload = function () {
                //         $('#summernote').summernote('insertNode', image);
                //     };
                // }
            }
        }
    });
    $('#summernote').summernote('foreColor', '#8b8b8b');


    let formData = {
        title: '',
        content: '',
        status: '',
        thumbnail: '',
        description: "",
        categories: [],
        tags:[],
        idAuthor: '',
    }

    document.getElementById("upload-blog").addEventListener('click',function (e){
        e.preventDefault();
        if($select && $selectTag){
            formData = {
                title: $('#title').val(),
                content: $('#summernote').summernote('code'),
                status: "PUBLISH",
                categories: $select[0].selectize.getValue(),
                tags: $selectTag[0].selectize.getValue(),
                thumbnail: $('#file-thumbnail-input').val(),
                idAuthor: parseInt(getCookie('username')),
                description: $("#description").val()
            }
            postApi("post/create",JSON.stringify(formData),(res)=>{
                alert("Publish thành công");
                window.location.href = "/admin/blogs";
            },"POST",null,(res)=>{
                alert(res.data)
                window.location.href = "/admin/create/blog";
            })
        }else {
            alert("loi select muti");
        }
    });

    document.getElementById("draft-blog").addEventListener('click',function (e){
        e.preventDefault();
        if($select && $selectTag) {
            formData = {
                title: $('#title').val(),
                content: $('#summernote').summernote('code'),
                status: "DRAFT",
                categories: $select[0].selectize.getValue(),
                tags: $selectTag[0].selectize.getValue(),
                thumbnail: $('#file-thumbnail-input').val(),
                idAuthor: parseInt(getCookie('username')),
                description: $("#description").val()
            }
            postApi("post/create",JSON.stringify(formData),(res)=>{
                alert("Draft thành công");
                window.location.href = "/admin/blogs";
            },"POST",null,(res)=>{
                console.log(res)
                alert(res.data)
                window.location.href = "/admin/create/blog";
            })
        }else {
            alert("loi select muti")
        }
    })

    document.getElementById("file-thumbnail").addEventListener("change", (event)=>{
            let RegExpImg = /(\.jpg|\.jpeg|\.png|\.webp)$/i;
            if (!RegExpImg.exec(event.target.value)) {
                alert("Sai định dạng ảnh")
            }else {
                $("#loadinggif").show();
            let selectedFile = event.target.files[0];
            let imgtag = document.getElementById("imgThumbnailSuccess");
            uploadImage(selectedFile,(response)=>{
                if(response.success){
                    $("#loadinggif").hide();
                    imgtag.src = response.data;
                    $('#file-thumbnail-input').val(response.data)
                }
            });
            $('#c_file_success').attr('hidden', false);
            $('#c_file').attr('hidden', true);
        }
    })

    document.getElementById("remove-image").addEventListener("click", ()=>{
        document.getElementById("file-thumbnail").value = "";
        document.getElementById("imgThumbnailSuccess").src = "#";
        $('#c_file_success').attr('hidden', true);
        $('#c_file').attr('hidden', false);
    })

    document.getElementById("add-link-embed-form").addEventListener("submit",(e)=>{
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target).entries());
        $("#summernote").summernote('editor.saveRange');

        $("#summernote").summernote('editor.restoreRange');
        $("#summernote").summernote('editor.focus');
        $('#summernote').summernote("editor.pasteHTML",`<div>${data?.codeEmbed}</div>`);
        $('#AddLinkEmbedModal').modal('hide');
    })
})


const slugify = str =>
    str.toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');

function getData(){
    console.log('title: ',$('#title').val());
    console.log('content: ', $('#summernote').summernote('code'))
    console.log('gener: ', $('#select-genre').val());
    console.log('thumbnail: ', $('#file-thumbnail-input').val());
    console.log("status: false", )
    console.log("accountUsername: ", )
}

var insertLinkEmbedBtn = function (context) {
    var ui = $.summernote.ui;
    // create button
    var button = ui.button({
        contents: '<i class="fas fa-gamepad "></i>',
        tooltip: 'insert link embed',
        click: function () {
            $('#AddLinkEmbedModal').modal('show');

            // invoke insertText method with 'hello' on editor module.
            // context.invoke('editor.insertText', 'hello');
        }
    });

    return button.render();   // return button as jquery object
}