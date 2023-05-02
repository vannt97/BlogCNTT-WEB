$(document).ready(()=>{
    if(window.location.pathname === "/admin/blogs"){
        getApi("posts",(res)=>{
            if(res.status !== 200) return;
            let htmlTitle = "<th>Id</th><th>Title</th><th>status</th><th>Created At</th><th>Updated At</th><th>Action</th>";
            let htmlFooterTable = `<thead><tr>${htmlTitle}</tr></thead>`;
            let htmlHeaderTable = `<tfoot><tr>${htmlTitle}</tr></tfoot>`;
            //render data
            let htmlData = ``;
            let role = localStorage.getItem('role');

            res.data.forEach(item =>{
                htmlData +=`<tr>
            <td>${item.id}</td>
            <td>${item.title}</td>
            <td>${item.status}</td>
            <td>${(new Date(item.createdAt)).toLocaleString()}</td>
            <td>${(new Date(item.modifiedAt)).toLocaleString()}</td>
            <td>
                <a ${role != "ROLE_ANONYMOUS" ? "" : "hidden"} class="btn btn-primary btn-edit" href="/admin/edit/blog/${item.id}"><i class="fas fa-edit"></i></a>
                <button ${role != "ROLE_ANONYMOUS" ? "" : "hidden"} class="btn btn-danger btn-remove" data-id="${item.id}" ><i class="fas fa-trash"></i></button>
            </td>
            </tr>`;
            });

            $(".table-database").html(htmlHeaderTable + htmlFooterTable + htmlData);
            $('#dataTable').DataTable({
                order: [[0, 'desc']],
            });

            $(".btn-remove").click(function (e){
                if (confirm("Bạn có muốn xoá không?") === true) {
                    deleteApi(`post/delete/${e.currentTarget.dataset.id}`,(res)=>{
                        alert("Xoá thành công");
                        window.location.href = '/admin/blogs';
                    }, `DELETE`, (res)=>{
                        alert("Xoá không thành công");
                        window.location.href = '/admin/blogs';
                    })
                }
            })
        },(res)=>{
            console.log(res)
        })
    }

    if(window.location.pathname === "/admin/accounts"){
        getApi("users",(res)=>{
            if(res.status !== 200) return;
            let htmlTitle = "<th>Id</th><th>Email</th><th>Name</th><th>Role</th><th>Created At</th><th>Updated At</th><th>Action</th>";
            let htmlFooterTable = `<thead><tr>${htmlTitle}</tr></thead>`;
            let htmlHeaderTable = `<tfoot><tr>${htmlTitle}</tr></tfoot>`;

            let role = localStorage.getItem('role');
            //render data
            let htmlData = ``;
            res.data.forEach(item =>{
                htmlData +=`<tr>
            <td>${item.id}</td>
            <td>${item.email}</td>
            <td>${item.name}</td>
            <td>${item.role.name}</td>
            <td>${(new Date(item.createdAt)).toLocaleString()}</td>
            <td>${(new Date(item.modifiedAt)).toLocaleString()}</td>
            <td>
                <button ${role == "ROLE_ADMIN" ? "" : "hidden"} class="btn btn-primary btn-edit" data-toggle="modal" data-target="#accountEditModal" data-role="${item.role.name}" data-id="${item.id}"><i class="fas fa-edit"></i></button>
                <button ${role == "ROLE_ADMIN" ? "" : "hidden"} class="btn btn-danger btn-remove" data-id="${item.id}" ><i class="fas fa-trash"></i></button>
            </td>
            </tr>`;
            })

            $(".table-database").html(htmlHeaderTable + htmlFooterTable + htmlData);
            $('#dataTable').DataTable(
                {
                    order: [[1, 'desc']],
                }
            );

            $(".btn-remove").click(function (e){
                if (confirm("Bạn có muốn xoá không?") === true) {
                    deleteApi(`delete/${e.currentTarget.dataset.id}/account`,(res)=>{
                        alert("Xoá thành công");
                        window.location.href = '/admin/accounts';
                    }, `DELETE`, (res)=>{
                        alert("Xoá không thành công");
                        window.location.href = '/admin/accounts';
                    })
                }
            })

            $(".btn-edit").click(function (e){
                $("#id-edit-input").val(e.currentTarget.dataset.id);
                let valueInputSelect = "";
                if(e.currentTarget.dataset.role === "ROLE_ANONYMOUS"){
                    valueInputSelect = "anonymous";
                }
                if(e.currentTarget.dataset.role === "ROLE_ADMIN"){
                    valueInputSelect = "admin";
                }
                if(e.currentTarget.dataset.role === "ROLE_USER"){
                    valueInputSelect = "user";
                }
                document.getElementById("select-edit-account").value = `${valueInputSelect}`;
            })
            document.getElementById("create-account-form").addEventListener('submit',function (e){
                e.preventDefault();
                const data = Object.fromEntries(new FormData(e.target).entries());
                putApi('create/account',JSON.stringify(data),(res)=>{
                    if(res.status !== 200){
                        alert('Account đã tồn tại, vui long nhập account khác');
                    }else {
                        alert("tạo account thành công");
                    }
                    window.location.href = '/admin/accounts';

                },null,(res)=>{
                    alert("tạo account thất bại. Tài khoản  Vui lòng thử lại");
                    window.location.href = '/admin/accounts';
                })
            })
        //

            document.getElementById("edit-account-form").addEventListener('submit', function (e){
                e.preventDefault();
                const data = Object.fromEntries(new FormData(e.target).entries());

                postApi("edit/account", JSON.stringify(data),(res)=>{
                    if(res.success){
                        alert(res.data)
                    }else {
                        alert(res.data)
                    }
                    window.location.href = '/admin/accounts';
                },"POST",null,(res)=>{
                    alert(res.message)
                    window.location.href = '/admin/accounts';

                })
            })

        })
    }

    if(window.location.pathname === "/admin/categories"){
        getApi("categories",(res)=>{
            if(res.status !== 200) return;
            let htmlTitle = "<th>Id</th><th>Name</th><th>Created At</th><th>Updated At</th><th>Action</th>";
            let htmlFooterTable = `<thead><tr>${htmlTitle}</tr></thead>`;
            let htmlHeaderTable = `<tfoot><tr>${htmlTitle}</tr></tfoot>`;

            let role = localStorage.getItem('role');
            //render data
            let htmlData = ``;
            res.data.forEach(item =>{

                htmlData +=`<tr>
            <td>${item.id}</td>
            <td>${item.name}</td>
<!--            <td>${item.status}</td>            -->
            <td>${(new Date(item.createdAt)).toLocaleString()}</td>
            <td>${(new Date(item.createdAt)).toLocaleString()}</td>
            <td>
                <button ${role == "ROLE_ADMIN" ? "" : "hidden"} class="btn btn-primary btn-edit" data-toggle="modal" data-target="#categoryEditModal" data-id="${item.id}" data-category="${item.name}" ><i class="fas fa-edit"></i></button>
                <button ${role == "ROLE_ADMIN" ? "" : "hidden"} class="btn btn-danger btn-remove" data-id="${item.id}" ><i class="fas fa-trash"></i></button>
            </td>
            </tr>`;
            })

            $(".table-database").html(htmlHeaderTable + htmlFooterTable + htmlData);
            $('#dataTable').DataTable(
                {
                    order: [[1, 'desc']],
                }
            );

            $(".btn-edit").click(function (e){
                $("#category-form-edit").val(e.currentTarget.dataset.category);
                $("#id-category-form-edit").val(e.currentTarget.dataset.id);
            })

            $(".btn-remove").click(function (e){
                if (confirm("Bạn có muốn xoá không?") === true) {
                    deleteApi(`category/delete/${e.currentTarget.dataset.id}`,(res)=>{
                        alert("Xoá thành công");
                        window.location.href = '/admin/categories';
                    }, `DELETE`, (res)=>{
                        alert("Xoá không thành công");
                        window.location.href = '/admin/categories';
                    })
                }
            })

            document.getElementById("edit-category-form").addEventListener('submit',function (e){
                e.preventDefault();
                const data = Object.fromEntries(new FormData(e.target).entries());
                postApiParam('category/edit',data,(res)=>{
                    $('#categoryModal').modal('hide');
                    alert("edit thanh cong thành công");
                    window.location.href = '/admin/categories';
                }, "PUT",null,(res)=>{
                    $('#categoryModal').modal('hide');
                    alert("edit thất bại vui lòng thử lại");
                });

                // postApi('category/edit',JSON.stringify(data),(res)=>{
                //     $('#categoryEditModal').modal('hide');
                //     alert("Cập nhật thành công");
                //     window.location.href = '/admin/categories';
                // }, "PUT",null,(res)=>{
                //     $('#categoryEditModal').modal('hide');
                //     alert("Cập nhật thất bại vui lòng thử lại");
                // })
            })

            document.getElementById('create-category-form').addEventListener('submit',function (e){
                e.preventDefault();
                const data = Object.fromEntries(new FormData(e.target).entries());

                postApiParam('category/create',data,(res)=>{
                    $('#categoryModal').modal('hide');
                    alert("Tao thanh cong thành công");
                    window.location.href = '/admin/categories';
                }, "POST",null,(res)=>{
                    $('#categoryModal').modal('hide');
                    alert("Tao thất bại vui lòng thử lại");
                });


            })
        })
    }

    if(window.location.pathname === "/admin/tags"){
        getApi("tags",(res)=>{
            if(res.status !== 200) return;
            let htmlTitle = "<th>Id</th><th>Name</th><th>Created At</th><th>Updated At</th><th>Action</th>";
            let htmlFooterTable = `<thead><tr>${htmlTitle}</tr></thead>`;
            let htmlHeaderTable = `<tfoot><tr>${htmlTitle}</tr></tfoot>`;

            let role = localStorage.getItem('role');
            //render data
            let htmlData = ``;
            res.data.forEach(item =>{

                htmlData +=`<tr>
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${(new Date(item.createdAt)).toLocaleString()}</td>
            <td>${(new Date(item.createdAt)).toLocaleString()}</td>
            <td>
                <button ${role == "ROLE_ADMIN" ? "" : "hidden"} class="btn btn-primary btn-edit" data-toggle="modal" data-target="#categoryEditModal" data-id="${item.id}" data-category="${item.name}" ><i class="fas fa-edit"></i></button>
                <button ${role == "ROLE_ADMIN" ? "" : "hidden"} class="btn btn-danger btn-remove" data-id="${item.id}" ><i class="fas fa-trash"></i></button>
            </td>
            </tr>`;
            })

            $(".table-database").html(htmlHeaderTable + htmlFooterTable + htmlData);
            $('#dataTable').DataTable(
                {
                    order: [[1, 'desc']],
                }
            );

            $(".btn-edit").click(function (e){
                $("#category-form-edit").val(e.currentTarget.dataset.category);
                $("#id-category-form-edit").val(e.currentTarget.dataset.id);
            })

            $(".btn-remove").click(function (e){
                if (confirm("Bạn có muốn xoá không?") === true) {
                    deleteApi(`tag/delete/${e.currentTarget.dataset.id}`,(res)=>{
                        alert("Xoá thành công");
                        window.location.href = '/admin/tags';
                    }, `DELETE`, (res)=>{
                        alert("Xoá không thành công");
                        window.location.href = '/admin/tags';
                    })
                }
            })

            document.getElementById("edit-category-form").addEventListener('submit',function (e){
                e.preventDefault();
                const data = Object.fromEntries(new FormData(e.target).entries());
                postApiParam('tag/edit',data,(res)=>{
                    $('#categoryModal').modal('hide');
                    alert("edit thanh cong thành công");
                    window.location.href = '/admin/tags';
                }, "PUT",null,(res)=>{
                    $('#categoryModal').modal('hide');
                    alert("edit thất bại vui lòng thử lại");
                });
            })

            document.getElementById('create-category-form').addEventListener('submit',function (e){
                e.preventDefault();
                const data = Object.fromEntries(new FormData(e.target).entries());
                postApiParam('tag/create',data,(res)=>{
                    $('#categoryModal').modal('hide');
                    alert("Tao thanh cong thành công");
                    window.location.href = '/admin/tags';
                }, "POST",null,(res)=>{
                    $('#categoryModal').modal('hide');
                    alert("Tao thất bại vui lòng thử lại");
                });
            })
        })
    }

})
