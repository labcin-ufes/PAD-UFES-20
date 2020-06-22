package br.labcin.sade.controlador;

import java.security.Principal;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import br.labcin.sade.modelo.Usuario;
import br.labcin.sade.repositorio.TermosRepositorio;
import br.labcin.sade.repositorio.UsuarioRepositorio;
import br.labcin.sade.servico.EmailServico;

/**
 * 
 * @author André Pacheco
 * 
 * Classe controladora das funcionalidades de usuário. Todas as requisições que envolva um usuário
 * deverão ser implementadas aqui (exceto CRUD que é realizado no pacote reposositorio)
 *
 */

@Controller
public class UsuarioControlador {

	@Autowired
	UsuarioRepositorio usuRepo;
	
	@Autowired
	private EmailServico emailService;
	
	@Autowired
	private TermosRepositorio termosRepo;
	
	
	/**
	 * @author André Pacheco
	 * 
	 * Método que retorna um JSON com os dados do usuário logado no sistema.
	 * 
	 * @param principal É o usuário que está atualmente logado. Fornecido pelo spring
	 * 
	 * @return O usuário logado
	 */
	@GetMapping("/api/usuario/usuario-logado")
	@ResponseBody
    public Principal user(Principal principal) {
        return principal;
    }
	
	/**
	 * @author André Pacheco
	 * 
	 * Essa rota precisa ser aberta para sermos capazes de cadastrar o usuário fora e dentro da área de login
	 * 
	 * @param usuario JSON contendo todos os dados do usuário
	 * @return JSON com um atributo estado=cadastrado ou nao-cadastrado
	 * 
	 */
	@PostMapping("/api-aberta/cadastrar-usuario")	
	@ResponseBody
	public String cadastrarUsuario (@RequestBody Map <String, String> usuJson) {
		
		Usuario usuario = new Usuario(usuJson.get("nomeCompleto"),
				usuJson.get("email"), usuJson.get("nomeUsuario"), 
				usuJson.get("senha"), false, "USER");
		
		try {
			usuRepo.save(usuario);
			
			// Envia os termos de uso para o e-mail do usuário após realização do cadastro.
			String assunto = "Cadastro no SADE";		
			String msg = "Olá " + usuJson.get("nomeCompleto") + ",\n"
	        		+ "seu cadastro foi realizado com sucesso no Sistema de Apoio Dermatológico."
					+ "\n\nUsuario: " + usuJson.get("nomeUsuario")
	        		+ "\n\nFique atento aos termos de uso do sitema:\n\n" + this.termosRepo.findByTipo("termos-de-uso").getTexto();
			
			// Agora é chamado o servico de email e o mesmo é enviado
			this.emailService.enviar(usuJson.get("email"), assunto, msg, "", "", "");
			
		} catch (DataIntegrityViolationException e) {			
			return "{\"estado\": \"nao-permitido\"}";
		} catch (Exception e) {
			e.printStackTrace();
			return "{\"estado\": \"problema-banco\"}";
		}

		return "{\"estado\": \"cadastrado\"}";
	}
	
	/**
	 * @author André Pacheco
	 * Rota para validar a senha do usuário no banco a fim de autorizar a alteração da mesma
	 * @param usuJson Dados do usuario em JSON
	 * @return JSON com um atributo estado que assume varias possibilidades
	 */
	@PostMapping("/api/usuario/compara-senhas")	
	@ResponseBody
	public String comparaSenhas (@RequestBody Map <String, String> usuJson) {
		
		String nomeUsuario = usuJson.get("nomeUsuario");
		String senha = usuJson.get("senha");		
		
		try {
			Usuario usuario = usuRepo.findByNomeUsuario(nomeUsuario);
			if (usuario == null) {
				return "{\"estado\": \"usuario-inexistente\"}"; 
			} else {
				BCryptPasswordEncoder cripto = new BCryptPasswordEncoder();
				
				if (cripto.matches(senha, usuario.getSenha())) {
					return "{\"estado\": \"senha-correta\"}";
				} else {
					return "{\"estado\": \"senha-incorreta\"}";
				}
			}
		} catch (Exception e) {
			return "{\"estado\": \"problema-banco\"}";
		}		
	}
}
