$(document).ready(()=>{

    $(document).ajaxStart(function (){
        Pace.restart();
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
        tabsize: 2,
        height: 700,
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
            }
        }
    });

    $('#summernote').summernote('code', content);

    $('#summernote').summernote('foreColor', '#8b8b8b');


    var $select;
    var $selectTag;

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

        let valueCategories = [];
        categoriesActive.forEach(item =>{
            valueCategories.push(item.id)
        });

        $select[0].selectize.setValue(valueCategories);
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

        let valueCategories = [];
        tagsActive.forEach(item =>{
            valueCategories.push(item.id)
        });

        $selectTag[0].selectize.setValue(valueCategories);
    },(res) => {
        alert("lỗi hệ thống vui lòng đăng nhập lại");
        window.location.href = '/admin/create/blog';
    })




    document.getElementById("upload-blog").addEventListener('click',function (e){
        e.preventDefault();
        if($select){
            let formData = {
                title: $('#title').val(),
                content: $('#summernote').summernote('code'),
                status: "PUBLISH",
                categories: $select[0].selectize.getValue(),
                tags: $selectTag[0].selectize.getValue(),
                thumbnail: $('#file-thumbnail-input').val(),
                idAuthor: parseInt(getCookie('username')),
                description: $("#description").val(),
            }


            postApi(`post/edit?slug=${slugPost}`,JSON.stringify(formData),(res)=>{
                alert("Update thành công");
                window.location.href = "/admin/blogs";
            },"PUT",null,(res)=>{
                console.log(res);
                alert(res.data)
                // window.location.href = "/admin/blogs";
            })
        }else {
            alert("loi select input ")
        }

    });

    document.getElementById("draft-blog").addEventListener('click',function (e){
        e.preventDefault();
        if($select){
            let formData = {
                title: $('#title').val(),
                content: $('#summernote').summernote('code'),
                status: "DRAFT",
                categories: $select[0].selectize.getValue(),
                tags: $selectTag[0].selectize.getValue(),
                thumbnail: $('#file-thumbnail-input').val(),
                idAuthor: parseInt(getCookie('username')),
                description: $("#description").val(),
            }

            postApi(`post/edit?slug=${slugPost}`,JSON.stringify(formData),(res)=>{
                alert("Draft thành công");
                window.location.href = "/admin/blogs";
            },"PUT",null,(res)=>{
                console.log(res);
                alert(res.data);
                // window.location.href = "/admin/blogs";
            })
        }else {
            alert("loi select input ")
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
                if(response.succes){
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

var insertLinkEmbedBtn = function (context) {
    var ui = $.summernote.ui;
    // create button
    var button = ui.button({
        contents: '<i class="fas fa-gamepad "></i>',
        tooltip: 'insert link embed',
        click: function () {
            $('#AddLinkEmbedModal').modal('show');
            // $("#summernote").summernote('editor.insertText',"asdsadsa");

            // invoke insertText method with 'hello' on editor module.
            // context.invoke('editor.pasteHTML', '<div><blockquote class="twitter-tweet"><p lang="en" dir="ltr">What is this string game called in your country? <a href="https://t.co/dBv7ZGFGdD">pic.twitter.com/dBv7ZGFGdD</a></p>&mdash; 9GAG ❤️ Memeland (@9GAG) <a href="https://twitter.com/9GAG/status/1649110933950562308?ref_src=twsrc%5Etfw">April 20, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script></div>');
        }
    });

    return button.render();   // return button as jquery object
}

