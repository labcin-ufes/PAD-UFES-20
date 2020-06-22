package br.labcin.sade.modelo;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class ImagemNaoSincronizada {

	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)	
	private Long id;
	
	@Column(nullable = false, unique=true)
	private String pathCompleto;	
	
	@Column(nullable = false)
	private String operacao;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getPathCompleto() {
		return pathCompleto;
	}

	public void setPathCompleto(String pathCompleto) {
		this.pathCompleto = pathCompleto;
	}

	public String getOperacao() {
		return operacao;
	}

	public void setOperacao(String operacao) {
		this.operacao = operacao;
	}
	
}
