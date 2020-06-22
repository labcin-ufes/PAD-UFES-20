package br.labcin.sade;

import java.util.TimeZone;

import javax.annotation.PostConstruct;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SadeApplication {
	
	public static void main(String[] args) {
		SpringApplication.run(SadeApplication.class, args);
	}
	
	
	@PostConstruct
	void setandoTimeZone() {
	    TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
	}
	
}

