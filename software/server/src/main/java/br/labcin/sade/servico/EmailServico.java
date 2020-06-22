package br.labcin.sade.servico;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServico {
	
	@Autowired 
	private JavaMailSender mailSender;

	public String enviar (String email, String assunto, String msg, String nome, String nomeUsuario, String senha) {
		
        SimpleMailMessage message = new SimpleMailMessage();
        message.setText(msg);
        message.setTo(email);
        message.setFrom("YOUR_EMAIL@gmail.com");
        message.setSubject(assunto);

        try {
            mailSender.send(message);
            return "{\"estado\": \"enviado\"}";
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"estado\": \"nao-enviado\"}";
        }
    }
	
}
