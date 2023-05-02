$(document).ready(()=>{
    getApi("count/post", (res)=>{
        $("#dashboard-blogs").html(res.data)
    })
    getApi("count/category", (res)=>{
        $("#dashboard-categories").html(res.data)
    })
    getApi("count/user", (res)=>{
        $("#dashboard-accounts").html(res.data)
    })
    getApi("count/tag", (res)=>{
        $("#dashboard-tags").html(res.data)
    })
})