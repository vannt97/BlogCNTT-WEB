package com.example.BlogCNTTWEB.util;

import org.springframework.stereotype.Component;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import java.util.Arrays;
import java.util.Base64;
import java.util.Optional;

@Component
public class CookieUtil {

    public String decodeString(HttpServletRequest request, String nameCookie){
        Optional<String> optionalEncoder = Arrays.stream(request.getCookies())
                .filter(cookie-> nameCookie.equals(cookie.getName()))
                .map(Cookie::getValue)
                .findAny();

        byte[] decodedBytes = Base64.getDecoder().decode(optionalEncoder.get());
        return new String(decodedBytes);
    }
}
