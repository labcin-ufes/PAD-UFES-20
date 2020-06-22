package br.labcin.sade.modelo;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class ImagemCirurgia {
	
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;	
	
	@Column(nullable=false)
	private String path;
	
	@Column(nullable=false)
	private boolean segmentado;
	
	@ManyToOne
	@JoinColumn (name="lesao_id")
	@JsonIgnore
	private LesaoCirurgia lesao;
	
	//##############################################################################################
	// IMPLEMENTAÇÃO DE MÉTODOS DA CLASSE
	//##############################################################################################	
	
	void print() {		
		System.out.println("Imagem path: " + path);
	}
	
	//##############################################################################################
	// INICIO DOS GETS E SETS
	//##############################################################################################	

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}
	
	public boolean getSegmentado() {
		return segmentado;
	}

	public void setSegmentado(boolean segmentado) {
		this.segmentado = segmentado;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public LesaoCirurgia getLesao() {
		return lesao;
	}

	public void setLesao(LesaoCirurgia lesao) {
		this.lesao = lesao;
	}

}
