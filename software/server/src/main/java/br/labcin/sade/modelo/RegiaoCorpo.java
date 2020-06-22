package br.labcin.sade.modelo;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class RegiaoCorpo {
	
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)	
	private Long id;	
	
	@Column(nullable=false, unique=true)
	private String nome;
	
	@Column(nullable=false)
	private String parte;
	
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

	public String getParte() {
		return parte;
	}

	public void setParte(String parte) {
		this.parte = parte;
	} 
	
	
}
