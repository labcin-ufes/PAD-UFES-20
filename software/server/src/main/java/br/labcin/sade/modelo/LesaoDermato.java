package br.labcin.sade.modelo;

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
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.fasterxml.jackson.annotation.JsonIgnore;


@Entity
public class LesaoDermato {
	
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)	
	private Long id;
	
	private boolean auditado; // NOVO
		
	@Column(nullable=false)
	private String regiao;
	
	private String grandeRegiao;
	
	@Column(nullable=false)
	private String diagnostico;
	
	@Column(nullable=false)
	private String diagnosticoSecundario;
	
	@Column(nullable=false)
	private String cresceu;
	
	@Column(nullable=false)
	private String cocou;
	
	@Column(nullable=false)
	private String sangrou;
	
	@Column(nullable=false)
	private String doeu;
	
	@Column(nullable=false)
	private String mudou;	
	
	@Column(nullable=false)
	private String relevo;
	
	@Column(nullable=false)
	private int idade;
	

	@Column()
	private String localAtendimento;
	
	@Column()
	private String municipioResidencia;
	
	@Temporal(TemporalType.DATE)
	// @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", locale = "pt-BR", timezone = "Brazil/East")
	@Column()
	private Date dataAtendimento;
	
	private String obs;
	
	@OneToMany(fetch = FetchType.LAZY, cascade=CascadeType.ALL, mappedBy="lesao")	
	private List<ImagemDermato> imagens;
	
	@ManyToOne	
	@JsonIgnore
	private PacienteDermato paciente;
	
	//##############################################################################################
	// MÉTODOS DAS CLASSES
	//##############################################################################################	
	
	public void print() {
		System.out.println("---- LESAO GERAL----");
		System.out.println("ID: " + id);
		System.out.println("Idade: " + idade);
		System.out.println("Diag: " + diagnostico);
		System.out.println("DiagSec: " + diagnosticoSecundario);
		System.out.println("Regiao: " + regiao);
		System.out.println("Cresceu: " + cresceu);
		System.out.println("Coçou: " + cocou);
		System.out.println("Sangrou: " + sangrou);
		System.out.println("Doeu: " + doeu);
		System.out.println("Mudou: " + mudou);
		System.out.println("relevo: " + relevo);
		
		
		System.out.println("--- IMAGENS ---");
		if (!imagens.isEmpty()) {
			for (ImagemDermato img : imagens) {
				img.print();
			}
		}
		System.out.println("-------------------------------------------\n");
		 
	}

	public String datasetLinha (HashMap<String, String> pacienteStr, String[] dadosReq) {
		String linha = "";
		HashMap<String, String> lesaoStr = new HashMap<String, String>();

		for (String dado: dadosReq) {
			switch (dado) {
				case "regiao":
					lesaoStr.put( dado, regiao );
					break;
				case "grandeRegiao":
					lesaoStr.put( dado, grandeRegiao );
					break;
				case "diagnostico":
					lesaoStr.put( dado, diagnostico );
					break;
				case "diagnosticoSecundario":
					lesaoStr.put( dado, diagnosticoSecundario );
					break;
				case "cresceu":
					lesaoStr.put( dado, cresceu + "_CRESCEU" );
					break;
				case "cocou":
					lesaoStr.put( dado, cocou + "_COCOU" );
					break;
				case "sangrou":
					lesaoStr.put( dado, sangrou + "_SANGROU" );
					break;
				case "doeu":
					lesaoStr.put( dado, doeu + "_DOEU" );
					break;
				case "mudou":
					lesaoStr.put( dado, mudou + "_MUDOU" );
					break;
				case "relevo":
					lesaoStr.put( dado, relevo );
					break;
				case "idade":
					lesaoStr.put( dado,  String.valueOf(idade) );
					break;
				case "obs":
					lesaoStr.put( dado,  obs );
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
			for (ImagemDermato img : imagens) {
				linha += allStr + img.getPath() + '\n';
			}
		} else {
			linha = allStr.replaceFirst("(?s);(?!.*?;)", "\n");
		}
		return linha;
	}
	
	//##############################################################################################
	// IMPLEMENTAÇÃO DE MÉTODOS DA CLASSE
	//##############################################################################################		

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public boolean isAuditado() {
		return auditado;
	}

	public void setAuditado(boolean auditado) {
		this.auditado = auditado;
	}

	public String getRegiao() {
		return regiao;
	}

	public void setRegiao(String regiao) {
		this.regiao = regiao.toUpperCase();
	}

	public String getDiagnostico() {
		return diagnostico;
	}

	public void setDiagnostico(String diagnostico) {
		this.diagnostico = diagnostico.toUpperCase();
	}

	public String getDiagnosticoSecundario() {
		return diagnosticoSecundario;
	}

	public void setDiagnosticoSecundario(String diagnosticoSecundario) {
		this.diagnosticoSecundario = diagnosticoSecundario.toUpperCase();
	}

	public String getCresceu() {
		return cresceu;
	}

	public void setCresceu(String cresceu) {
		this.cresceu = cresceu.toUpperCase();
	}

	public String getCocou() {
		return cocou;
	}

	public void setCocou(String cocou) {
		this.cocou = cocou.toUpperCase();
	}

	public String getSangrou() {
		return sangrou;
	}

	public void setSangrou(String sangrou) {
		this.sangrou = sangrou.toUpperCase();
	}

	public String getDoeu() {
		return doeu;
	}

	public void setDoeu(String doeu) {
		this.doeu = doeu.toUpperCase();
	}

	public String getMudou() {
		return mudou;
	}

	public void setMudou(String mudou) {
		this.mudou = mudou.toUpperCase();
	}

	public String getRelevo() {
		return relevo;
	}

	public void setRelevo(String relevo) {
		this.relevo = relevo.toUpperCase();
	}

	public int getIdade() {
		return idade;
	}

	public void setIdade(int idade) {
		this.idade = idade;
	}

	public String getObs() {
		return obs;
	}

	public void setObs(String obs) {
		this.obs = obs.toUpperCase();
	}

	public List<ImagemDermato> getImagens() {
		return imagens;
	}

	public void setImagens(List<ImagemDermato> imagens) {
		this.imagens = imagens;
	}

	public PacienteDermato getPaciente() {
		return paciente;
	}

	public void setPaciente(PacienteDermato paciente) {
		this.paciente = paciente;
	}

	public String getGrandeRegiao() {
		return grandeRegiao;
	}

	public void setGrandeRegiao(String grandeRegiao) {
		this.grandeRegiao = grandeRegiao;
	}
	
	public String getLocalAtendimento() {
		return localAtendimento;
	}

	public void setLocalAtendimento(String localAtendimento) {
		this.localAtendimento = localAtendimento;
	}

	public String getMunicipioResidencia() {
		return municipioResidencia;
	}

	public void setMunicipioResidencia(String municipioResidencia) {
		this.municipioResidencia = municipioResidencia;
	}

	public Date getDataAtendimento() {
		return dataAtendimento;
	}

	public void setDataAtendimento(Date dataAtendimento) {
		this.dataAtendimento = dataAtendimento;
	}
	
}
