package br.labcin.sade.modelo;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Entity
public class Usuario implements UserDetails{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;	

	public Usuario(String nomeCompleto, String email, String nomeUsuario, String senha, boolean apto,
			String papel) {
		super();
		this.setNome(nomeCompleto);
		this.email = email;
		this.nomeUsuario = nomeUsuario;
		this.setSenha(senha);;
		this.apto = apto;
		this.papel = papel;
	}
	
	public Usuario () {

	}
	
	

	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)	
	private Long id;
	
	@Column(length=150, nullable = false)
	private String nomeCompleto; // MUDOU
	
	@Column(length=50, nullable = false, unique=true)
	private String email;
	
	@Column(length=25, nullable = false, unique=true)
	private String nomeUsuario;	
	
	@Column(nullable = false) 
	private String senha;
	
	@Column(nullable = false)
	private boolean apto;
	
	@Column(nullable = false)
	private String papel; 

	//##############################################################################################
	// IMPLEMENTAÇÃO DE MÉTODOS DA CLASSE
	//##############################################################################################
	
	public void print (Usuario user){
		System.out.println("---- Usuario ----");
		System.out.println("ID: " + user.id);
		System.out.println("Nome: " + user.nomeCompleto);
		System.out.println("Nome Usuario: " + user.nomeUsuario);
		System.out.println("Email: " + user.email);
		System.out.println("Apto: " + user.apto);		
	}

	
	//##############################################################################################
	// IMPLEMENTACAO METODOS DO USERDETAILS
	//##############################################################################################
	
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {		
		List<Roles> papeis = new ArrayList<Roles>();
		papeis.add(new Roles(this.papel));
		/*
		for (Roles p: papeis) {
			System.out.println(p.getAuthority());
		} 		
		*/
		return papeis;
	}	

	@Override
	public String getPassword() {
		return this.senha;
	}

	@Override
	public String getUsername() {
		return this.nomeUsuario;
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}
	
	//##############################################################################################
	// INICIO GETS E SETS
	//##############################################################################################	

	public String getPapel() {
		return papel;
	}

	public void setPapel(String papel) {
		this.papel = papel;
	}	
	
	public boolean isApto() {
		return apto;
	}

	public void setApto(boolean apto) {
		this.apto = apto;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getNomeCompleto() {
		return nomeCompleto;
	}

	public void setNome(String nomeCompleto) {
		this.nomeCompleto = nomeCompleto.toUpperCase();
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getSenha() {
		return senha;
	}

	public void setSenha(String senha) {
		this.senha = new BCryptPasswordEncoder().encode(senha);
	}	

	public String getNomeUsuario() {
		return nomeUsuario;
	}

	public void setNomeUsuario(String nomeUsuario) {
		this.nomeUsuario = nomeUsuario.toLowerCase();
	}	
	
	
}

class Roles implements GrantedAuthority{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private String papel = "ROLE_USER";
	
	Roles (String p){
		this.setPapel(p);
	}
	
	@Override
	public String getAuthority() {
		return this.getPapel();
	}

	public String getPapel() {
		return papel;
	}

	public void setPapel(String papel) {
		this.papel = papel;
	}
	
}
