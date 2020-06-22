package br.labcin.sade.modelo;

import java.util.HashMap;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;


@Entity
public class PacienteDermato {

	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)	
	private Long id;
	
	@Column(nullable=false, unique=true)
	private String cartaoSus; // MUDOU
	
	@Column(nullable=false)
	private boolean auditado; // NOVO 
	
	@Column(nullable=false)
	private boolean sincronizar; // NOVO
	
	
	@OneToMany	(fetch = FetchType.LAZY, cascade=CascadeType.ALL, mappedBy="paciente")
	private List<LesaoDermato> lesoes;
	
	//##############################################################################################
	// IMPLEMENTAÇÃO DE MÉTODOS DA CLASSE
	//##############################################################################################	

	public String datasetLinha (String[] dadosReq) {
		String linha = "";
		HashMap<String, String> pacienteStr = new HashMap<String, String>();

		for (String dado: dadosReq) {
			switch (dado) {
				case "id":
					pacienteStr.put( dado, getId().toString() );
					break;
				case "cartaoSus":
					pacienteStr.put( dado, cartaoSus );
					break;
				default:
					break;
			}
		}
		for (LesaoDermato les : lesoes) {
			linha += les.datasetLinha(pacienteStr, dadosReq);
		}
		return linha;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getCartaoSus() {
		return cartaoSus;
	}

	public void setCartaoSus(String cartaoSus) {
		this.cartaoSus = cartaoSus;
	}

	public boolean isAuditado() {
		return auditado;
	}

	public void setAuditado(boolean auditado) {
		this.auditado = auditado;
	}

	public List<LesaoDermato> getLesoes() {
		return lesoes;
	}

	public void setLesoes(List<LesaoDermato> lesoes) {
		this.lesoes = lesoes;
	}

	public boolean isSincronizar() {
		return sincronizar;
	}

	public void setSincronizar(boolean sincronizar) {
		this.sincronizar = sincronizar;
	}
	
	
	
}
