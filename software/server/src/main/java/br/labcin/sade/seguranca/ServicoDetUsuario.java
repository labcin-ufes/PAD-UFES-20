package br.labcin.sade.seguranca;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import br.labcin.sade.modelo.Usuario;
import br.labcin.sade.repositorio.UsuarioRepositorio;

/**
 * 
 * @author André Pacheco
 * 
 * Essa classe implementa a inteface que permite o spring boot buscar no banco de dados um usuario,
 * verificar se sua senha é valida e verificar também se ele está apto a usar o sistema. Caso alguma dessas
 * verificações falhe, o login também falhará e o usuário não será autenticado.
 * 
 * Apesar de ser um serviço, é interessante que essa classe esteja aqui pois é algo que é intrinsicamente
 * relacionada a segurança e quase nunca será alterada
 *
 */

@Service
public class ServicoDetUsuario implements UserDetailsService{

	@Autowired
	private UsuarioRepositorio ur;
	
	
	@Override
	public UserDetails loadUserByUsername (String nomeUsuario) throws UsernameNotFoundException {
		
		Usuario user = ur.findByNomeUsuario(nomeUsuario);	
		if (user == null) {			
			throw new UsernameNotFoundException("Usuário não encontrado!");
		}else if (user.isApto() == false) {			
			throw new UsernameNotFoundException("Este usuário não possui permissão para acessar o sistema!");
		}
		
		return user;
	}

}
