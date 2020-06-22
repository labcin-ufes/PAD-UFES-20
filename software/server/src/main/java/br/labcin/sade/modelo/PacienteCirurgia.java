package br.labcin.sade.modelo;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.Period;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;


@Entity
public class PacienteCirurgia { 

	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	// Variavel para dizer se o paciente deve ser sincronizado ou não
	@Column(nullable=false)
	private boolean sincronizar; // NOVO
	
	// Variavel para dizer se o paciente foi ou não auditado
	@Column(nullable=false)
	private boolean auditado; // NOVO
	
	@Column(length=20, nullable = false, unique=true)
	private String cartaoSus;
	
	@Column(length=100, nullable = false)
	private String localUltimoAtendimento; // MUDOU	
	
	@Column(nullable=true)
	@Temporal(TemporalType.DATE)
	private Date dataUltimoAtendimento; // MUDOU
	
	@Column(nullable=true)
	@Temporal(TemporalType.DATE)
	private Date dataNascimento;
	
	@Column(length=15, nullable = false)
	private String prontuario;
	
	@Column(nullable = false)
	private String nomeCompleto;
	
	@Column(length=100, nullable = false)
	private String localNascimento;
	
	@Column(length=100, nullable = false)
	private String estadoNascimento;

	@Column(length=150, nullable = false)
	private String nomeMae;
	
	@Column(nullable = false)	
	private String endereco;
	
	@Column(length=100, nullable = false)
	private String atvPrincipal;
	
	@Column(length=5, nullable = false) 
	private String escolaridade;
	
	@Column(length=10, nullable = false)
	private String usoCigarro; // MUDOU
	
	@Column(length=10, nullable = false)
	private String usoBebida; // MUDOU
	
	@Column(length=10, nullable = false)
	private String renda;
	
	@Column(length=50, nullable = false)
	private String origemFamiliarMae;	
	
	@Column(length=50, nullable = false)
	private String origemFamiliarPai;
	
	@Column(length=100, nullable = false)
	private String usoAgrotoxico; // MUDOU
	
	private char diabetes;
	
	private char usoAnticoagulante; // MUDOU
	
	@Column(length=100, nullable = false)
	private String alergia;	
	
	private String obs;
	
	@Column(nullable=false)
	private float presArtSistolica;
	
	@Column(nullable=false)
	private float presArtDiastolica;
	
	@Column(nullable=false)
	private int numPessoasCasa;
	
	@Column(nullable=false)
	private char sexo;
	
	@Column(nullable=false)
	private char aguaEncanada;
	
	@Column(nullable=false)
	private char redeEsgoto;
	
	@Column(nullable=false)
	private int idadeInicioAtv;
	
	@Column(nullable=false)
	private char estadoCivil;
	
	@Column(nullable=false)
	private char destrofiaSolar;
	
	@Column(nullable=false)
	private int expSol;
	
	@Column(nullable=false)
	private char horaExpSol;
	
	@Column(nullable=false)
	private char usoChapeu; // MUDOU
	
	@Column(nullable=false)
	private char usoMangaCumprida; // MUDOU
	
	@Column(nullable=false)
	private char usoCalcaCumprida; // MUDOU
	
	@Column(nullable=false)
	private char usoFiltroSolar; // MUDOU
	
	@Column(nullable=false)
	private char histCancerPele;
	
	@Column(nullable=false)
	private char histCancer;
	
	@Column(nullable=false)
	private int numVezesAtendido;
	
	@Column(nullable=false)
	private char tipoPele;
	
	@Column(nullable=false)
	private char hipertensao;
		
	// A lesão não possui nullable=false por que o paciente pode ser inserido sem lesão 
	// e mais tarde ela é preenchida via app ou no sistema
	@OneToMany	(fetch = FetchType.LAZY, cascade=CascadeType.ALL, mappedBy="paciente")
	private List<LesaoCirurgia> lesoes;	
	
	//##############################################################################################
	// IMPLEMENTAÇÃO DE MÉTODOS DA CLASSE
	//##############################################################################################
	
	/**
	 * @author André Pacheco
	 * Método que retorna o número de lesões e imagens do paciente
	 * @return Um Map com número de lesoes
	 */
	public Map<String, Long> contaLesoesEImagens () {
		long numLesoes = 0;
		long numImagens = 0;
		Map<String, Long> result = new HashMap<String, Long>();
		
		numLesoes = this.lesoes.size();
		for (LesaoCirurgia les: this.lesoes) {
			numImagens += les.contaImagens();
		}
		result.put("numLesoes", numLesoes);
		result.put("numImagens", numImagens);
		return result;
	}
	
	/**
	 * @author André Pacheco
	 * Método para contar numero de lesoes
	 */
	public long contaLesoes () {		
		return this.lesoes.size();
	}
	
	/**
	 * @author André Pacheco
	 * Método para contar numero de lesoes
	 */
	public long contaImagens () {
		long numImagens = 0;
		for (LesaoCirurgia les: this.lesoes) {
			numImagens += les.contaImagens();
		}
		return numImagens;
	}
	
	/**
	 * @author André Pacheco
	 * Método para contar numero de lesoes e imagens dado uma lista de pacientes cirurgia
	 * @param pacList Uma lista de pacientes cirurgia
	 */
	public static Map<String, Long> contaLesoesEImagensLista (List<PacienteCirurgia> pacList) {
		long numLesoes = 0;
		long numImagens = 0;
		Map<String, Long> result = new HashMap<String, Long>();
		
		for (PacienteCirurgia pac: pacList) {
			numLesoes += pac.contaLesoes();
			numImagens += pac.contaImagens();
		}		
		result.put("numLesoes", numLesoes);
		result.put("numImagens", numImagens);
		return result;
	}
	
	/**
	 * @author André Pacheco
	 * Método de impressão da classe
	 */
	public void print () {
		System.out.println("--- PACIENTE ---");
		System.out.println("ID: " + getId());
		System.out.println("Nome: " + nomeCompleto);
		System.out.println("Cartao SUS: " + cartaoSus + "\n");
		
		System.out.println("--- LESOES ---");
		for (LesaoCirurgia les : lesoes) {
			les.print();
		}
	}

	public String datasetLinha (String[] dadosReq) {
		String linha = "";
		HashMap<String, String> pacienteStr = new HashMap<String, String>();
		DateFormat dateFormat = new SimpleDateFormat("dd/mm/yyyy");

		for (String dado: dadosReq) {
			switch (dado) {
				case "id":
					pacienteStr.put( dado,getId().toString());
					break;
				case "cartaoSus":
					pacienteStr.put( dado,cartaoSus);
					break;
				case "idade":
					pacienteStr.put( dado,calculaIdade());
					break;
				case "localUltimoAtendimento":
					pacienteStr.put( dado,localUltimoAtendimento);
					break;
				case "dataUltimoAtendimento":
					pacienteStr.put( dado,dateFormat.format(dataUltimoAtendimento));
					break;
				case "dataNascimento":
					pacienteStr.put( dado,dateFormat.format(dataNascimento));
					break;
				case "prontuario":
					pacienteStr.put( dado,prontuario);
					break;
				case "nomeCompleto":
					pacienteStr.put( dado,nomeCompleto);
					break;
				case "localNascimento":
					pacienteStr.put( dado,localNascimento);
					break;
				case "estadoNascimento":
					pacienteStr.put( dado,estadoNascimento);
					break;
				case "nomeMae":
					pacienteStr.put( dado,nomeMae);
					break;
				case "endereco":
					pacienteStr.put( dado,endereco);
					break;
				case "atvPrincipal":
					pacienteStr.put( dado,atvPrincipal);
					break;
				case "escolaridade":
					pacienteStr.put( dado,escolaridade);
					break;
				case "usoCigarro":
					pacienteStr.put( dado,usoCigarro);
					break;
				case "usoBebida":
					pacienteStr.put( dado,usoBebida);
					break;
				case "renda":
					pacienteStr.put( dado,renda);
					break;
				case "origemFamiliarMae":
					pacienteStr.put( dado,origemFamiliarMae);
					break;
				case "origemFamiliarPai":
					pacienteStr.put( dado,origemFamiliarPai);
					break;
				case "usoAgrotoxico":
					pacienteStr.put( dado,usoAgrotoxico);
					break;
				case "diabetes":
					pacienteStr.put( dado,Character.toString(diabetes)+"_DIABETES");
					break;
				case "usoAnticoagulante":
					pacienteStr.put( dado,Character.toString(usoAnticoagulante)+"_USOU_ANTICOAGULANTE");
					break;
				case "alergia":
					pacienteStr.put( dado,alergia);
					break;
				case "obs":
					pacienteStr.put( dado,obs);
					break;
				case "presArtSistolica":
					pacienteStr.put( dado,String.valueOf(presArtSistolica));
					break;
				case "presArtDiastolica":
					pacienteStr.put( dado,String.valueOf(presArtDiastolica));
					break;
				case "numPessoasCasa":
					pacienteStr.put( dado,String.valueOf(numPessoasCasa));
					break;
				case "sexo":
					pacienteStr.put( dado,Character.toString(sexo));
					break;
				case "aguaEncanada":
					pacienteStr.put( dado,Character.toString(aguaEncanada)+"_AGUA_ENCANADA");
					break;
				case "redeEsgoto":
					pacienteStr.put( dado,Character.toString(redeEsgoto)+"_REDE_ESGOTO");
					break;
				case "idadeInicioAtv":
					pacienteStr.put( dado,String.valueOf(idadeInicioAtv));
					break;
				case "estadoCivil":
					pacienteStr.put( dado,Character.toString(estadoCivil));
					break;
				case "destrofiaSolar":
					pacienteStr.put( dado,Character.toString(destrofiaSolar));
					break;
				case "expSol":
					pacienteStr.put( dado,String.valueOf(expSol));
					break;
				case "horaExpSol":
					pacienteStr.put( dado,Character.toString(horaExpSol));
					break;
				case "usoChapeu":
					pacienteStr.put( dado,Character.toString(usoChapeu)+"_USA_CHAPEU");
					break;
				case "usoMangaCumprida":
					pacienteStr.put( dado,Character.toString(usoMangaCumprida)+"USA_MANGA_CUMPRIDA");
					break;
				case "usoCalcaCumprida":
					pacienteStr.put( dado,Character.toString(usoCalcaCumprida)+"_USA_CALCA_CUMPRIDA");
					break;
				case "usoFiltroSolar":
					pacienteStr.put( dado,Character.toString(usoFiltroSolar)+"_USA_FILTRO_SOLAR");
					break;
				case "histCancerPele":
					pacienteStr.put( dado,Character.toString(histCancerPele)+"_HISTORICO_CANCER_PELE");
					break;
				case "histCancer":
					pacienteStr.put( dado,Character.toString(histCancer)+"_HISTORICO_CANCER");
					break;
				case "numVezesAtendido":
					pacienteStr.put( dado,String.valueOf(numVezesAtendido));
					break;
				case "tipoPele":
					pacienteStr.put( dado,Character.toString(tipoPele));
					break;
				case "hipertensao":
					pacienteStr.put( dado,Character.toString(hipertensao)+"_HIPERTENSAO");
					break;
				default:
					break;
			}
		}
		for (LesaoCirurgia les : lesoes) {
			linha += les.datasetLinha(pacienteStr, dadosReq);
		}
		return linha;
	}
  
  private String calculaIdade() {
	  Calendar cal = Calendar.getInstance(TimeZone.getTimeZone("America/Sao_Paulo"));
	  cal.setTime(dataNascimento);
	  LocalDate nascimento = LocalDate.of(cal.get(Calendar.YEAR), cal.get(Calendar.MONTH) + 1, cal.get(Calendar.DAY_OF_MONTH));
	  LocalDate now = LocalDate.now();
	  Period age = Period.between(nascimento, now);
	  return String.valueOf(age.getYears());
  }
	
	//##############################################################################################
	// INICIO DOS GETS E SETS
	//##############################################################################################
	
	public String getLocalUltimoAtendimento() {
		return localUltimoAtendimento;
	}

	public void setLocalUltimoAtendimento(String localUltimoAtendimento) {
		this.localUltimoAtendimento = localUltimoAtendimento;
	}

	public Date getDataUltimoAtendimento() {
		return dataUltimoAtendimento;
	}

	public void setDataUltimoAtendimento(Date dataUltimoAtendimento) {
		this.dataUltimoAtendimento = dataUltimoAtendimento;
	}

	public String getProntuario() {
		return prontuario;
	}

	public void setProntuario(String prontuario) {
		this.prontuario = prontuario;
	}

	public String getNomeCompleto() {
		return nomeCompleto;
	}

	public void setNomeCompleto(String nomeCompleto) {
		this.nomeCompleto = nomeCompleto;
	}

	public String getLocalNascimento() {
		return localNascimento;
	}

	public void setLocalNascimento(String localNascimento) {
		this.localNascimento = localNascimento;
	}

	public String getEstadoNascimento() {
		return estadoNascimento;
	}

	public void setEstadoNascimento(String estadoNascimento) {
		this.estadoNascimento = estadoNascimento;
	}

	public Date getDataNascimento() {
		return dataNascimento;
	}

	public void setDataNascimento(Date dataNascimento) {
		this.dataNascimento = dataNascimento;
	}

	public String getNomeMae() {
		return nomeMae;
	}

	public void setNomeMae(String nomeMae) {
		this.nomeMae = nomeMae;
	}

	public String getEndereco() {
		return endereco;
	}

	public void setEndereco(String endereco) {
		this.endereco = endereco;
	}

	public String getAtvPrincipal() {
		return atvPrincipal;
	}

	public void setAtvPrincipal(String atvPrincipal) {
		this.atvPrincipal = atvPrincipal;
	}

	public String getEscolaridade() {
		return escolaridade;
	}

	public void setEscolaridade(String escolaridade) {
		this.escolaridade = escolaridade;
	}

	public String getUsoCigarro() {
		return usoCigarro;
	}

	public void setUsoCigarro(String usoCigarro) {
		this.usoCigarro = usoCigarro;
	}

	public String getUsoBebida() {
		return usoBebida;
	}

	public void setUsoBebida(String usoBebida) {
		this.usoBebida = usoBebida;
	}

	public String getRenda() {
		return renda;
	}

	public void setRenda(String renda) {
		this.renda = renda;
	}

	public String getOrigemFamiliarMae() {
		return origemFamiliarMae;
	}

	public void setOrigemFamiliarMae(String origemFamiliarMae) {
		this.origemFamiliarMae = origemFamiliarMae;
	}

	public String getOrigemFamiliarPai() {
		return origemFamiliarPai;
	}

	public void setOrigemFamiliarPai(String origemFamiliarPai) {
		this.origemFamiliarPai = origemFamiliarPai;
	}

	public String getUsoAgrotoxico() {
		return usoAgrotoxico;
	}

	public void setUsoAgrotoxico(String usoAgrotoxico) {
		this.usoAgrotoxico = usoAgrotoxico;
	}

	public String getCartaoSus() {
		return cartaoSus;
	}

	public void setCartaoSus(String cartaoSus) {
		this.cartaoSus = cartaoSus;
	}

	public List<LesaoCirurgia> getLesoes() {
		return lesoes;
	}

	public void setLesoes(List<LesaoCirurgia> lesoes) {
		this.lesoes = lesoes;
	}

	public char getDiabetes() {
		return diabetes;
	}

	public void setDiabetes(char diabetes) {
		this.diabetes = diabetes;
	}

	public char getUsoAnticoagulante() {
		return usoAnticoagulante;
	}

	public void setUsoAnticoagulante(char usoAnticoagulante) {
		this.usoAnticoagulante = usoAnticoagulante;
	}

	public String getAlergia() {
		return alergia;
	}

	public void setAlergia(String alergia) {
		this.alergia = alergia;
	}

	public String getObs() {
		return obs;
	}

	public void setObs(String obs) {
		this.obs = obs;
	}

	public float getPresArtSistolica() {
		return presArtSistolica;
	}

	public void setPresArtSistolica(float presArtSistolica) {
		this.presArtSistolica = presArtSistolica;
	}

	public float getPresArtDiastolica() {
		return presArtDiastolica;
	}

	public void setPresArtDiastolica(float presArtDiastolica) {
		this.presArtDiastolica = presArtDiastolica;
	}

	public int getNumPessoasCasa() {
		return numPessoasCasa;
	}

	public void setNumPessoasCasa(int numPessoasCasa) {
		this.numPessoasCasa = numPessoasCasa;
	}

	public char getSexo() {
		return sexo;
	}

	public void setSexo(char sexo) {
		this.sexo = sexo;
	}

	public char getAguaEncanada() {
		return aguaEncanada;
	}

	public void setAguaEncanada(char aguaEncanada) {
		this.aguaEncanada = aguaEncanada;
	}

	public char getRedeEsgoto() {
		return redeEsgoto;
	}

	public void setRedeEsgoto(char redeEsgoto) {
		this.redeEsgoto = redeEsgoto;
	}

	public int getIdadeInicioAtv() {
		return idadeInicioAtv;
	}

	public void setIdadeInicioAtv(int idadeInicioAtv) {
		this.idadeInicioAtv = idadeInicioAtv;
	}

	public char getEstadoCivil() {
		return estadoCivil;
	}

	public void setEstadoCivil(char estadoCivil) {
		this.estadoCivil = estadoCivil;
	}

	public char getDestrofiaSolar() {
		return destrofiaSolar;
	}

	public void setDestrofiaSolar(char destrofiaSolar) {
		this.destrofiaSolar = destrofiaSolar;
	}

	public int getExpSol() {
		return expSol;
	}

	public void setExpSol(int expSol) {
		this.expSol = expSol;
	}

	public char getHoraExpSol() {
		return horaExpSol;
	}

	public void setHoraExpSol(char horaExpSol) {
		this.horaExpSol = horaExpSol;
	}

	public char getUsoChapeu() {
		return usoChapeu;
	}

	public void setUsoChapeu(char usoChapeu) {
		this.usoChapeu = usoChapeu;
	}

	public char getUsoMangaCumprida() {
		return usoMangaCumprida;
	}

	public void setUsoMangaCumprida(char usoMangaCumprida) {
		this.usoMangaCumprida = usoMangaCumprida;
	}

	public char getUsoCalcaCumprida() {
		return usoCalcaCumprida;
	}

	public void setUsoCalcaCumprida(char usoCalcaCumprida) {
		this.usoCalcaCumprida = usoCalcaCumprida;
	}

	public char getUsoFiltroSolar() {
		return usoFiltroSolar;
	}

	public void setUsoFiltroSolar(char usoFiltroSolar) {
		this.usoFiltroSolar = usoFiltroSolar;
	}

	public char getHistCancerPele() {
		return histCancerPele;
	}

	public void setHistCancerPele(char histCancerPele) {
		this.histCancerPele = histCancerPele;
	}

	public char getHistCancer() {
		return histCancer;
	}

	public void setHistCancer(char histCancer) {
		this.histCancer = histCancer;
	}

	public int getNumVezesAtendido() {
		return numVezesAtendido;
	}

	public void setNumVezesAtendido(int numVezesAtendido) {
		this.numVezesAtendido = numVezesAtendido;
	}

	public char getTipoPele() {
		return tipoPele;
	}

	public void setTipoPele(char tipoPele) {
		this.tipoPele = tipoPele;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}


	public boolean isSincronizar() {
		return sincronizar;
	}


	public void setSincronizar(boolean sincronizar) {
		this.sincronizar = sincronizar;
	}

	public char getHipertensao() {
		return hipertensao;
	}

	public void setHipertensao(char hipertensao) {
		this.hipertensao = hipertensao;
	}

	public boolean isAuditado() {
		return auditado;
	}

	public void setAuditado(boolean auditado) {
		this.auditado = auditado;
	}

}
