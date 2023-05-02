package com.example.BlogCNTTWEB.controller;

import com.example.BlogCNTTWEB.constant.SystemConstant;
import com.example.BlogCNTTWEB.payload.RequestSignin;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.stream.Collectors;

@RestController
@CrossOrigin
public class ApiController {



    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody RequestSignin signin, HttpServletResponse httpServletResponse) throws IOException {
        ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
        String json = ow.writeValueAsString(signin);
        CloseableHttpClient client = HttpClients.createDefault();
        HttpPost httpPost = new HttpPost(SystemConstant.API + "signin");
        StringEntity entity = new StringEntity(json);
        httpPost.setEntity(entity);
        httpPost.setHeader("Accept", "application/json");
        httpPost.setHeader("Content-type", "application/json");
        CloseableHttpResponse response = client.execute(httpPost);
        if(response.getStatusLine().getStatusCode() == HttpStatus.UNAUTHORIZED.value()){
            return new ResponseEntity<>("", HttpStatus.OK);
        }
        InputStream content = response.getEntity().getContent();
        String jsonReponse = new BufferedReader(
                new InputStreamReader(content, StandardCharsets.UTF_8))
                .lines()
                .collect(Collectors.joining("\n"));
        client.close();

        HashMap result =
                (HashMap) (new ObjectMapper().readValue(jsonReponse, HashMap.class)).get("data");
        String encodedToken = Base64.getEncoder().encodeToString(result.get("token").toString().getBytes());
        String encodedRefeshToken = Base64.getEncoder().encodeToString(result.get("refreshToken").toString().getBytes());

        Cookie cookieT = new Cookie("s_t", encodedToken);
        Cookie cookieRT = new Cookie("s_rt",encodedRefeshToken);
        Cookie cookieRole = new Cookie("role",result.get("role").toString());
        Cookie cookieUsername = new Cookie("username", result.get("id").toString());

//        gia han la 0.5 ngay 0.5 x 24 x 60 x 60;
        cookieT.setMaxAge((24 * 60 * 60)/2);
        cookieRT.setMaxAge((24 * 60 * 60)/2);
        cookieRole.setMaxAge((24 * 60 * 60)/2);
        cookieUsername.setMaxAge((24 * 60 * 60)/2);
//
//
        httpServletResponse.addCookie(cookieT);
        httpServletResponse.addCookie(cookieRT);
        httpServletResponse.addCookie(cookieRole);
        httpServletResponse.addCookie(cookieUsername);

        HashMap responseE = new HashMap<>();
        responseE.put("role", result.get("role"));
        responseE.put("username",result.get("name"));
        return new ResponseEntity<HashMap>(responseE, HttpStatus.OK);
    }

}
