package br.labcin.sade.controlador;

import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import br.labcin.sade.modelo.Usuario;
import br.labcin.sade.repositorio.UsuarioRepositorio;
import br.labcin.sade.servico.EmailServico;

@RestController
public class EmailControlador {

	@Autowired
	private EmailServico emailService;
	
	@Autowired
	private UsuarioRepositorio usuRepo;
	
	@PostMapping("/api-aberta/recuperar-senha")	
	public String recuperarSenha (@RequestBody Map <String, String> emailMap) {
		
		// Recuperando o email na requisição
		String email = emailMap.get("email");
		
		Usuario usuarioRecSenha;
		// Buscando email no banco para certificar se o usuário está cadastrado
		try {
			usuarioRecSenha = usuRepo.findByEmail(email);
			if (usuarioRecSenha == null) {
				return "{\"estado\": \"sem-cadastro\"}"; 
			}
		} catch (Exception e) {
			return "{\"estado\": \"problema-banco\"}";
		}
		
		
		// Gerando a mensagem para o usuario
		String nome = usuarioRecSenha.getNomeCompleto();		
		String nomeUsuario = usuarioRecSenha.getNomeUsuario();		
		String senha = gerarSenha();		
		String assunto = "Recuperação de email - SADE";		
		String msg = "Olá " + nome + ",\nvocê esqueceu sua senha, certo?\n"
        		+ "Tudo bem, geramos uma nova para você!\n\nUsuario: " + nomeUsuario + "\nSenha: " + senha
        		+ "\n\nAgora entre no sistema e troque por uma de sua preferência (e que você não esqueça xD)"
        		+ "\nAté a próxima";
		
		// Agora é nencessário alterar a senha deste usuário para a nova gerada que será enviado por email
		// Dentro do set dessa senha ela é criptografada
		usuarioRecSenha.setSenha(senha);
		
		// Agora vamos salvar o usuario no banco e só no final enviar o email
		try {
			usuRepo.save(usuarioRecSenha);
		} catch (Exception e) {
			return "{\"estado\": \"problema-banco\"}";
		}
		
		// Agora é chamado o servico de email e o mesmo é enviado
		return this.emailService.enviar(email, assunto, msg, nome, nomeUsuario, senha);
	}
	
	private String gerarSenha() {
		Random rand = new Random();
		char [] carcteres = "QWERTYUIOPASDFGHJKLZXCVBNM1234567890qwertyuiopasdfghjklzxcvbnm".toCharArray();
		
		StringBuffer sb = new StringBuffer();
	    for (int i = 0; i < 8; i++) {
	        int pos = rand.nextInt (carcteres.length);
	        sb.append (carcteres[pos]);
	    }    
	    return sb.toString();
	}
	
}
