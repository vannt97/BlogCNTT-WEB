package com.example.BlogCNTTWEB.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.IOException;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Optional;

@Controller
public class WebController {
    @RequestMapping("/")
    public String home(Model model, @RequestParam(required = false) Optional<String> search) throws IOException {
//        this.setDataHeader(model);
//        if (search.isPresent()){
//            model.addAttribute("search", search.get());
//            String encodedurl = URLEncoder.encode(search.get(),"UTF-8");
//            Optional<String> json = Optional.ofNullable(apiUtil.GetApi("/blogs/pagination?status=PUBLISH&search=" + encodedurl));
//            HashMap<String, Object> respone = (HashMap<String, Object>) (new ObjectMapper().readValue(json.get(), HashMap.class)).get("data");
//            model.addAttribute("isResult", respone.get("empty"));
//            model.addAttribute("posts",respone.get("content"));
//            model.addAttribute("last",respone.get("last"));
//            return  "pages/search";
//        }else {
//            model.addAttribute("labelhome",true);
//
//            return  "pages/home";
//        }
        return "pages/home";
    }


    @RequestMapping("/{post}")
    public String post(Model model, @RequestParam(required = false) Optional<String> search) throws IOException {
//        this.setDataHeader(model);
//        if (search.isPresent()){
//            model.addAttribute("search", search.get());
//            String encodedurl = URLEncoder.encode(search.get(),"UTF-8");
//            Optional<String> json = Optional.ofNullable(apiUtil.GetApi("/blogs/pagination?status=PUBLISH&search=" + encodedurl));
//            HashMap<String, Object> respone = (HashMap<String, Object>) (new ObjectMapper().readValue(json.get(), HashMap.class)).get("data");
//            model.addAttribute("isResult", respone.get("empty"));
//            model.addAttribute("posts",respone.get("content"));
//            model.addAttribute("last",respone.get("last"));
//            return  "pages/search";
//        }else {
//            model.addAttribute("labelhome",true);
//
//            return  "pages/home";
//        }
        return "pages/post";
    }

    @RequestMapping("/author/{name}")
    public String author(Model model, @PathVariable String name) throws IOException {
        return "pages/author";
    }

    @RequestMapping("/contact")
    public String contact(Model model) throws IOException {
        return "pages/contact";
    }
}
