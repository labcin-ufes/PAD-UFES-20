package br.labcin.sade.modelo;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Diagnostico {

	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)	
	private Long id;	
	
	@Column(nullable=false, unique=true)
	private String nome;	
	
	@Column(nullable=false)
	private boolean subtipo;
	
	//##############################################################################################
	// INICIO DOS GETS E SETS
	//##############################################################################################

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public boolean isSubtipo() {
		return subtipo;
	}

	public void setSubtipo(boolean subtipo) {
		this.subtipo = subtipo;
	}


}
