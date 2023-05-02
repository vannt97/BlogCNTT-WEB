package com.example.BlogCNTTWEB.controller;


import com.example.BlogCNTTWEB.constant.SystemConstant;
import com.example.BlogCNTTWEB.util.CookieUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.stream.Collectors;

@Controller
public class AdminController {

//    private ModelAndView checkCookie(){
//
//
//        return true;
//    }

    @Autowired
    CookieUtil cookieUtil;

    @RequestMapping(value = "admin/logout", method = RequestMethod.GET)
    public ModelAndView adminLogout(HttpServletResponse response){
        Cookie deleteCookieT = new Cookie("s_t", null);
        deleteCookieT.setMaxAge(0);
        deleteCookieT.setPath("/");
        Cookie deleteCookieRT = new Cookie("s_rt", null);
        deleteCookieRT.setMaxAge(0);
        deleteCookieRT.setPath("/");

        Cookie deleteCookieRole = new Cookie("role", null);
        deleteCookieRole.setMaxAge(0);
        deleteCookieRole.setPath("/");

        Cookie deleteCookieUsername = new Cookie("username", null);
        deleteCookieUsername.setMaxAge(0);
        deleteCookieUsername.setPath("/");

        response.addCookie(deleteCookieRT);
        response.addCookie(deleteCookieT);
        response.addCookie(deleteCookieRole);
        response.addCookie(deleteCookieUsername);
        return new ModelAndView("redirect:/admin/login");
    }

    @RequestMapping(value = "/admin/login", method = RequestMethod.GET)
    public ModelAndView adminLogin(Model model,
                                   @RequestParam(required = false, name = "error") boolean error,
    @CookieValue(name = "s_t", required = false) String cT ,@CookieValue(name = "s_rt", required = false) String cRT) throws IOException {
        if(cT != null && cRT != null){
            return new ModelAndView("redirect:/admin");
        }
        model.addAttribute("paramater",error);
        return new ModelAndView("admin/login");
    }

    @RequestMapping(value = "/admin",method = RequestMethod.GET)
    public ModelAndView adminDashboard(Model model, @CookieValue(name = "s_t", required = false) String cT ,@CookieValue(name = "s_rt", required = false) String cRT, HttpServletRequest request) {
        if(cT == null || cRT == null){
            return new ModelAndView("redirect:/admin/login");
        }
        model.addAttribute("title", "admin");
        return new ModelAndView("admin/dashboard");
    }

    @RequestMapping(value = "/admin/create/{category}")
    public ModelAndView adminCreate(Model model, @PathVariable String category) {
        if(category.equals("blog") ){
            model.addAttribute("title", category);
            return new ModelAndView("admin/create-blog");
        }
        return new ModelAndView("redirect:/admin/error");
    }

    @RequestMapping(value = "/admin/edit/blog/{id}")
    public ModelAndView adminEditBlog(Model model, @PathVariable long id) throws IOException {
        CloseableHttpClient client = HttpClients.createDefault();
        HttpGet httpGet = new HttpGet(SystemConstant.API + "posts/" + id);
        httpGet.setHeader("Accept", "application/json");
        httpGet.setHeader("Content-type", "application/json");
        CloseableHttpResponse response = client.execute(httpGet);
        if(response.getStatusLine().getStatusCode() != HttpStatus.OK.value()){
            return new ModelAndView("redirect:/admin/error");
        }
        InputStream content = response.getEntity().getContent();
        String jsonReponse = new BufferedReader(
                new InputStreamReader(content, StandardCharsets.UTF_8))
                .lines()
                .collect(Collectors.joining("\n"));
        client.close();
        HashMap result =
                (HashMap) (new ObjectMapper().readValue(jsonReponse, HashMap.class)).get("data");
       model.addAttribute("title", "Blog");
        model.addAttribute("titleBlog", result.get("title"));
        model.addAttribute("content", result.get("content"));
        model.addAttribute("thumbnail", result.get("thumbnail"));
        model.addAttribute("categories",result.get("categories"));
        model.addAttribute("tags",result.get("tags"));
        model.addAttribute("slugPost", result.get("slug"));
        model.addAttribute("description",result.get("description"));
        return new ModelAndView("admin/edit-blog");
    }

    @GetMapping("/admin/{category}")
    public ModelAndView adminTables(Model model, @PathVariable String category, @CookieValue(name = "role", required = false) String role) {
        if(category.equals("blogs") || category.equals("categories") || category.equals("accounts") || category.equals("tags")){
            model.addAttribute("title", category);
            model.addAttribute("role",role);
            return new ModelAndView("admin/tables");
        }
        return new ModelAndView("redirect:/admin/error");
    }

    @RequestMapping("/admin/error")
    public ModelAndView adminErrorPageNotFound(Model model) {
        return new ModelAndView("admin/error");
    }



}
