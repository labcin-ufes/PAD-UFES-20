package br.labcin.sade.modelo;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.fasterxml.jackson.annotation.JsonIgnore;


@Entity
public class LesaoCirurgia {

	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private boolean auditado; // NOVO	
		
	@Column(nullable=false)
	private String diagnosticoClinico;
		
	private String diagnosticoClinicoSecundario; // NOVO
	
	@Column(nullable = false)
	private String regiao;
	
	private String grandeRegiao;
	
	@Column(nullable = false)
	private String procedimento;
	
	private String cirurgiao;
	
	@Column(length=500)
	private String obs;
	
	@Column(nullable = false)
	private float diametroMaior;
	
	@Column(nullable = false)
	private float diametroMenor;	
	
	@ManyToOne
	@JoinColumn(name="paciente_id")
	@JsonIgnore 
	private PacienteCirurgia paciente;	
	
	@OneToMany	(fetch = FetchType.LAZY, cascade=CascadeType.ALL, mappedBy="lesao")	
	private List<ImagemCirurgia> imagens;
	
	@Temporal(TemporalType.DATE)
	// @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", locale = "pt-BR", timezone = "Brazil/East")
	@Column(nullable = false)
	private Date dataProcedimento; // MUDOU
	
	@Column(nullable = false)
	private String localProcedimento; // MUDOU
	
	// Dados a serem preenchido quando o histopatologico for realizado
	private String diagnosticoHisto;
		
	private String subtipoHisto;
		
	private String clark;
	
	private float breslow;
	
	private float indiceMiotico;

	private String tipoTumor;
	
    private float tamanhoTumorDimMaior;

	private float tamanhoTumorDimMenor;
    
    private String crescimentoRadial;
    
    private String crescimentoVertical;
    
    private String ulceracao;

	private String lesaoSatelite;
    
    private String evidenciaRegressao;
    
    private String associacaoNevoMelanocito;
    
    private String margemCirurgiaProfunda;
    
    private String margemCirurgiaLateral;
    
    private String margemProfundaLivre;    

	private String margemLateralLivre;
    
    private String invasaoVascular;
    
    private String menorDistMargemRessecaoLateral;
    
    private String limiteRessecao;
    
    private String infiltracaoPerineural;
    
    private String infiltracaoAngiolinfatica;
    
    private String infiltradoLinfocito;
    

    

	
	//##############################################################################################
	// IMPLEMENTAÇÃO DE MÉTODOS DA CLASSE
	//##############################################################################################	
	
	public void print() {
		System.out.println("---- LESAO ----");
		System.out.println("ID: " + id);
		System.out.println("Regiao: " + regiao);
		System.out.println("Diagnostico Clinico: " + diagnosticoClinico);
		System.out.println("Diagnostico Histopatologico: " + diagnosticoHisto);
		System.out.println("Diametro maior: " + diametroMaior);
		System.out.println("Diametro menor: " + diametroMenor);
		System.out.println("Procedimento: " + procedimento);
		System.out.println("Cirurgião: " + cirurgiao);
		
		
		System.out.println("--- IMAGENS ---");
		if (!imagens.isEmpty()) {
			for (ImagemCirurgia img : imagens) {
				img.print();
			}
		}
		System.out.println("-------------------------------------------\n");
		 
	}

	public String datasetLinha (HashMap<String, String> pacienteStr, String[] dadosReq) {
		String linha = "";
		HashMap<String, String> lesaoStr = new HashMap<String, String>();
		DateFormat dateFormat = new SimpleDateFormat("dd/mm/yyyy");

		for (String dado: dadosReq) {
			switch (dado) {
				case "diagnosticoClinico":
					lesaoStr.put( dado, diagnosticoClinico );
					break;
				case "diagnosticoClinicoSecundario":
					lesaoStr.put( dado, diagnosticoClinicoSecundario );
					break;
				case "regiao":
					lesaoStr.put( dado, regiao );
					break;
				case "grandeRegiao":
					lesaoStr.put( dado, grandeRegiao );
					break;
				case "procedimento":
					lesaoStr.put( dado, procedimento );
					break;
				case "cirurgiao":
					lesaoStr.put( dado, cirurgiao );
					break;
				case "obs":
					lesaoStr.put( dado, obs );
					break;
				case "diametroMaior":
					lesaoStr.put( dado, String.valueOf(diametroMaior) );
					break;
				case "diametroMenor":
					lesaoStr.put( dado, String.valueOf(diametroMenor) );
					break;
				case "dataProcedimento":
					lesaoStr.put( dado, dateFormat.format(dataProcedimento) );
					break;
				case "localProcedimento":
					lesaoStr.put( dado, localProcedimento );
					break;
				case "diagnosticoHisto":
					lesaoStr.put( dado, diagnosticoHisto );
					break;
				case "subtipoHisto":
					lesaoStr.put( dado, subtipoHisto );
					break;
				case "clark":
					lesaoStr.put( dado, clark );
					break;
				case "breslow":
					lesaoStr.put( dado, String.valueOf(breslow) );
					break;
				case "indiceMiotico":
					lesaoStr.put( dado, String.valueOf(indiceMiotico) );
					break;
				case "tipoTumor":
					lesaoStr.put( dado, tipoTumor );
					break;
				case "tamanhoTumorDimMaior":
					lesaoStr.put( dado, String.valueOf(tamanhoTumorDimMaior) );
					break;
				case "tamanhoTumorDimMenor":
					lesaoStr.put( dado, String.valueOf(tamanhoTumorDimMenor) );
					break;
				case "crescimentoRadial":
					lesaoStr.put( dado, crescimentoRadial );
					break;
				case "crescimentoVertical":
					lesaoStr.put( dado, crescimentoVertical );
					break;
				case "ulceracao":
					lesaoStr.put( dado, ulceracao );
					break;
				case "lesaoSatelite":
					lesaoStr.put( dado, lesaoSatelite );
					break;
				case "evidenciaRegressao":
					lesaoStr.put( dado, evidenciaRegressao );
					break;
				case "associacaoNevoMelanocito":
					lesaoStr.put( dado, associacaoNevoMelanocito );
					break;
				case "margemCirurgiaProfunda":
					lesaoStr.put( dado, margemCirurgiaProfunda );
					break;
				case "margemCirurgiaLateral":
					lesaoStr.put( dado, margemCirurgiaLateral );
					break;
				case "margemProfundaLivre":
					lesaoStr.put( dado, margemProfundaLivre );
					break;
				case "margemLateralLivre":
					lesaoStr.put( dado, margemLateralLivre );
					break;
				case "invasaoVascular":
					lesaoStr.put( dado, invasaoVascular );
					break;
				case "menorDistMargemRessecaoLateral":
					lesaoStr.put( dado, menorDistMargemRessecaoLateral );
					break;
				case "limiteRessecao":
					lesaoStr.put( dado, limiteRessecao );
					break;
				case "infiltracaoPerineural":
					lesaoStr.put( dado, infiltracaoPerineural );
					break;
				case "infiltracaoAngiolinfatica":
					lesaoStr.put( dado, infiltracaoAngiolinfatica );
					break;
				case "infiltradoLinfocito":
					lesaoStr.put( dado, infiltradoLinfocito );
					break;
				default:
					break;
			}
		}

		HashMap<String, String> all = new HashMap<String, String>(pacienteStr);
		all.putAll(lesaoStr);
		String allStr = "";
		for (String dado: dadosReq) {
			allStr += all.get(dado) + ';';
		}

		if(Arrays.stream(dadosReq).anyMatch("path"::equals)) {
			for (ImagemCirurgia img : imagens) {
				linha += allStr + img.getPath() + '\n';
			}
		} else {
			linha = allStr.replaceFirst("(?s);(?!.*?;)", "\n");
		}
		return linha;
	}
	//##############################################################################################
	// MÉTODOS DA CLASSE
	//##############################################################################################	
	
	public long contaImagens () {
		return this.imagens.size();
	}
	
	//##############################################################################################
	// INICIO DOS GETS E SETS
	//##############################################################################################

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getDiagnosticoClinico() {
		return diagnosticoClinico;
	}

	public void setDiagnosticoClinico(String diagnosticoClinico) {
		this.diagnosticoClinico = diagnosticoClinico.toUpperCase();
	}

	public String getDiagnosticoHisto() {
		return diagnosticoHisto;
	}

	public void setDiagnosticoHisto(String diagnosticoHisto) {
		if(diagnosticoHisto == null) {
			this.diagnosticoHisto = diagnosticoHisto;
		}else {
			this.diagnosticoHisto = diagnosticoHisto.toUpperCase();
		}
		
	}

	public String getSubtipoHisto() {
		return subtipoHisto;
	}

	public void setSubtipoHisto(String subtipoHisto) {
		
		if(subtipoHisto == null) {
			this.subtipoHisto = subtipoHisto;
		}else {
			this.subtipoHisto = subtipoHisto.toUpperCase();
		}
	}

	public String getClark() {
		return clark;
	}

	public void setClark(String clark) {
		if (clark == null) {
			this.clark = clark;
		} else {
			this.clark = clark.toUpperCase();
		}
	}

	public float getBreslow() {
		return breslow;
	}

	public void setBreslow(float breslow) {
		this.breslow = breslow;
	}

	public float getIndiceMiotico() {
		return indiceMiotico;
	}

	public void setIndiceMiotico(float indiceMiotico) {
		this.indiceMiotico = indiceMiotico;
	}

	public String getRegiao() {
		return regiao;
	}

	public void setRegiao(String regiao) {
		this.regiao = regiao.toUpperCase();
	}

	public String getProcedimento() {
		return procedimento;
	}

	public void setProcedimento(String procedimento) {
		this.procedimento = procedimento.toUpperCase();
	}

	public String getCirurgiao() {
		return cirurgiao;
	}

	public void setCirurgiao(String cirurgiao) {
		this.cirurgiao = cirurgiao.toUpperCase();
	}

	public String getObs() {
		return obs;
	}

	public void setObs(String obs) {
		this.obs = obs.toUpperCase();
	}

	public float getDiametroMaior() {
		return diametroMaior;
	}

	public void setDiametroMaior(float diametroMaior) {
		this.diametroMaior = diametroMaior;
	}

	public float getDiametroMenor() {
		return diametroMenor;
	}

	public void setDiametroMenor(float diametroMenor) {
		this.diametroMenor = diametroMenor;
	}

	public List<ImagemCirurgia> getImagens() {
		return imagens;
	}

	public void setImagens(List<ImagemCirurgia> imagens) {
		this.imagens = imagens;
	}

	public Date getDataProcedimento() {
		return dataProcedimento;
	}

	public void setDataProcedimento(Date dataProcedimento) {
		this.dataProcedimento = dataProcedimento;
	}

	public String getLocalProcedimento() {
		return localProcedimento;
	}

	public void setLocalProcedimento(String localProcedimento) {
		this.localProcedimento = localProcedimento.toUpperCase();
	}

	public String getDiagnosticoClinicoSecundario() {
		return diagnosticoClinicoSecundario;
	}

	public void setDiagnosticoClinicoSecundario(String diagnosticoClinicoSecundario) {
		this.diagnosticoClinicoSecundario = diagnosticoClinicoSecundario.toUpperCase();
	}

	public PacienteCirurgia getPaciente() {
		return paciente;
	}

	public void setPaciente(PacienteCirurgia paciente) {
		this.paciente = paciente;
	}

	public boolean isAuditado() {
		return auditado;
	}

	public void setAuditado(boolean auditado) {
		this.auditado = auditado;
	}
	
	public String getTipoTumor() {
        return tipoTumor;
    }

    public void setTipoTumor(String tipoTumor){
    	if (tipoTumor == null) {
    		this.tipoTumor = tipoTumor;
    	}else {
    		this.tipoTumor = tipoTumor.toUpperCase();
    	}
        
    }

    public String getCrescimentoRadial() {
        return crescimentoRadial;
    }

    public void setCrescimentoRadial(String crescimentoRadial){
    	if (crescimentoRadial == null) {
    		this.crescimentoRadial = crescimentoRadial;
    	} else {
    		this.crescimentoRadial = crescimentoRadial.toUpperCase();
    	}
        
    }

    public String getCrescimentoVertical() {
        return crescimentoVertical;
    }

    public void setCrescimentoVertical(String crescimentoVertical) {
    	if(crescimentoVertical == null) {
    		this.crescimentoVertical = crescimentoVertical;
    	} else {
    		this.crescimentoVertical = crescimentoVertical.toUpperCase();
    	}
        
    }

    public String  getUlceracao() {
        return ulceracao;
    }

    public void setUlceracao(String ulceracao) {
    	if (ulceracao == null) {
    		this.ulceracao = ulceracao;
    	} else {
    		this.ulceracao = ulceracao.toUpperCase();
    	}
        
    }

    public String getLesaoSatelite() {
        return lesaoSatelite;
    }

    public void setLesaoSatelite(String lesaoSatelite) {
    	if (lesaoSatelite == null) {
    		this.lesaoSatelite = lesaoSatelite;
    	} else {
    		this.lesaoSatelite = lesaoSatelite.toUpperCase();
    	}
        
    }

    public String getEvidenciaRegressao() {
        return evidenciaRegressao;
    }

    public void setEvidenciaRegressao(String evidenciaRegressao) {
    	if (evidenciaRegressao == null) {
    		this.evidenciaRegressao = evidenciaRegressao;
    	} else {
    		this.evidenciaRegressao = evidenciaRegressao.toUpperCase();
    	}
        
    }

    public String getAssociacaoNevoMelanocito() {
        return this.associacaoNevoMelanocito;
    }

    public void setAssociacaoNevoMelanocito(String associacaoNevoMelanocito) {
    	if (associacaoNevoMelanocito == null) {
    		this.associacaoNevoMelanocito = associacaoNevoMelanocito;
    	} else {
    		this.associacaoNevoMelanocito = associacaoNevoMelanocito.toUpperCase();
    	}
        
    }

    public String getMargemCirurgiaProfunda() {
        return margemCirurgiaProfunda;
    }

    public void setMargemCirurgiaProfunda(String margemCirurgiaProfunda) {
    	if (margemCirurgiaProfunda == null) {
    		this.margemCirurgiaProfunda = margemCirurgiaProfunda;
    	} else {
    		 this.margemCirurgiaProfunda = margemCirurgiaProfunda.toUpperCase();
    	}
       
    }

    public String getMargemCirurgiaLateral() {
        return margemCirurgiaLateral;
    }

    public void setMargemCirurgiaLateral(String margemCirurgiaLateral) {
    	if (margemCirurgiaLateral == null) {
    		this.margemCirurgiaLateral = margemCirurgiaLateral;
    	}else {
    		this.margemCirurgiaLateral = margemCirurgiaLateral.toUpperCase();
    	}
        
    }

    public String getInvasaoVascular() {
        return invasaoVascular;
    }

    public void setInvasaoVascular(String invasaoVascular) {
    	if (invasaoVascular == null) {
    		this.invasaoVascular = invasaoVascular;
    	}else {
    		 this.invasaoVascular = invasaoVascular.toUpperCase();
    	}
       
    }

    public String getMenorDistMargemRessecaoLateral() {
        return menorDistMargemRessecaoLateral;
    }

    public void setMenorDistMargemRessecaoLateral(String menorDistMargemRessecaoLateral) {
    	if( menorDistMargemRessecaoLateral == null) {
    		this.menorDistMargemRessecaoLateral = menorDistMargemRessecaoLateral;
    	}else {
    		 this.menorDistMargemRessecaoLateral = menorDistMargemRessecaoLateral.toUpperCase();
    	}
    	
    }
    
    public String getLimiteRessecao() {
		return limiteRessecao;
	}

	public void setLimiteRessecao(String limiteRessecao) {
		if (limiteRessecao == null) {
			this.limiteRessecao = limiteRessecao;
		} else {
			this.limiteRessecao = limiteRessecao.toUpperCase();
		}
		
	}

	public String getInfiltracaoPerineural() {
		return infiltracaoPerineural;
	}

	public void setInfiltracaoPerineural(String infiltracaoPerineural) {
		if (infiltracaoPerineural == null) {
			this.infiltracaoPerineural = infiltracaoPerineural;
		} else {
			this.infiltracaoPerineural = infiltracaoPerineural.toUpperCase();
		}
		
		
	}

	public String getInfiltracaoAngiolinfatica() {
		return infiltracaoAngiolinfatica;
	}

	public void setInfiltracaoAngiolinfatica(String infiltracaoAngiolinfatica) {
		if (infiltracaoAngiolinfatica == null) {
			this.infiltracaoAngiolinfatica = infiltracaoAngiolinfatica;
		} else {
			this.infiltracaoAngiolinfatica = infiltracaoAngiolinfatica.toUpperCase();
		}
		
	}

	public String getInfiltradoLinfocito() {
		return infiltradoLinfocito;
	}

	public void setInfiltradoLinfocito(String infiltradoLinfocito) {
		if(infiltradoLinfocito == null) {
			this.infiltradoLinfocito = infiltradoLinfocito;
		} else {
			this.infiltradoLinfocito = infiltradoLinfocito.toUpperCase();
		}
		
	}
	
	public float getTamanhoTumorDimMaior() {
		return tamanhoTumorDimMaior;
	}

	public void setTamanhoTumorDimMaior(float tamanhoTumorDimMaior) {
		this.tamanhoTumorDimMaior = tamanhoTumorDimMaior;
	}

	public float getTamanhoTumorDimMenor() {
		return tamanhoTumorDimMenor;
	}

	public void setTamanhoTumorDimMenor(float tamanhoTumorDimMenor) {
		this.tamanhoTumorDimMenor = tamanhoTumorDimMenor;
	}
	
	public String getMargemProfundaLivre() {
		return margemProfundaLivre;
	}

	public void setMargemProfundaLivre(String margemProfundaLivre) {
		if(margemProfundaLivre == null) {
			this.margemProfundaLivre = margemProfundaLivre;
		}else {
			this.margemProfundaLivre = margemProfundaLivre.toUpperCase();
		}
		
	}

	public String getMargemLateralLivre() {
		return margemLateralLivre;
	}

	public void setMargemLateralLivre(String margemLateralLivre) {
		if (margemLateralLivre == null) {
			this.margemLateralLivre = margemLateralLivre;
		}else {
			this.margemLateralLivre = margemLateralLivre.toUpperCase();
		}
		
	}

	public String getGrandeRegiao() {
		return grandeRegiao;
	}

	public void setGrandeRegiao(String grandeRegiao) {
		this.grandeRegiao = grandeRegiao;
	}	
	
}
