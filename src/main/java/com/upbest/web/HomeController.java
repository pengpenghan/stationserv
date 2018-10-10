package com.upbest.web;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class HomeController {

	private static final Logger logger = LoggerFactory.getLogger(HomeController.class);
 
	@RequestMapping(value = {"/index","/"})
	public void toSystemFirstPage(HttpSession session, Model model,
			HttpServletRequest request,HttpServletResponse response) {
		try {
			String url = "http://" + request.getServerName() + ":" + request.getServerPort()
					+ "/manage/login.html";
			response.sendRedirect(url);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
