package br.labcin.sade.controlador;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import br.labcin.sade.modelo.Cirurgiao;
import br.labcin.sade.modelo.ImagemCirurgia;
import br.labcin.sade.modelo.ImagemDermato;
import br.labcin.sade.modelo.LesaoCirurgia;
import br.labcin.sade.modelo.LesaoDermato;
import br.labcin.sade.modelo.PacienteCirurgia;
import br.labcin.sade.modelo.PacienteDermato;
import br.labcin.sade.repositorio.CirurgiaoRepositorio;
import br.labcin.sade.repositorio.PacienteCirurgiaRepositorio;
import br.labcin.sade.repositorio.PacienteDermatoRepositorio;
import br.labcin.sade.servico.ImagemServico;

@Controller
public class SmartphoneAppControlador {

	@Autowired
	private PacienteCirurgiaRepositorio pacCirRepo;
	
	@Autowired
	private PacienteDermatoRepositorio pacDerRepo;
	
	@Autowired
	private CirurgiaoRepositorio cirRepo;
	
	@Autowired
	ImagemServico imgServico;
	
	// Pegando o token para validar a operacao
	@Value("${token.api}")
	private String tokenSys;
	
	// A rota tem que ser /api-smartphone pois as /api é bloqueada!
	@GetMapping ("/api-smartphone/ack")
	@ResponseBody
	public String ack (){		
		return "ACK";
	}	
	
	@GetMapping ("/api-smartphone/pacienteCirurgia/{cartaoSus}")
	@ResponseBody
	public MiniPaciente obtemMiniPaciente (@PathVariable String cartaoSus,
			@RequestParam("token") String token){
		
		System.out.println("\n####################################");
		System.out.println("- Requisitando paciente [" + cartaoSus + "]");
		if (!token.equals(this.tokenSys)) {
			System.out.println("! ! Token invalido ! !");
			System.out.println("####################################\n");
			return null;
		}
		System.out.println("1) Token valido!");
		
		try {			
			PacienteCirurgia pac = pacCirRepo.findByCartaoSus(cartaoSus);
			if (pac != null) {
				System.out.println("2) Paciente encontrado com sucesso");
				MiniPaciente miniPac = new MiniPaciente(pac);
				miniPac.print();
				System.out.println("####################################\n");
				return miniPac;
			} else {
				System.out.println("2) Paciente não cadastrado");				
				return new MiniPaciente(new PacienteCirurgia());
			}
			
		} catch (Exception e) {
			System.out.println("Falha na requisição para o banco de dados");
			e.printStackTrace();			
		}		
		return null;
	}
	
	@GetMapping ("/api-smartphone/cirurgioes")
	@ResponseBody
	public List<String> cirurgioes (@RequestParam("token") String token){	
		
		if (!token.equals(this.tokenSys)) {
			System.out.println("\n####################################");
			System.out.println("ATENCAO: token da requisicao da lista de cirurgioes e invalido!");
			System.out.println("####################################\n");
			return null;
		}
		List<String> nomes = new ArrayList<>();
		List<Cirurgiao> listCir =  (List<Cirurgiao>) cirRepo.findAll();
		
		for (Cirurgiao cir : listCir) {
			nomes.add(cir.getNome());
		}
		return nomes;
	}
	
	@PostMapping("/api-smartphone/pacienteCirurgia/novaLesao/{cartaoSus}")
	@ResponseBody
	public void novaLesaoCirurgia (@PathVariable String cartaoSus, @RequestParam("regiao") String regiao,
			@RequestParam("diaMaior") String diaMaior, @RequestParam("diaMenor") String diaMenor, 
			@RequestParam("diagnostico") String diagnostico, @RequestParam("diagnosticoSec") String diagnosticoSec,
			@RequestParam("procedimento") String procedimento,
			@RequestParam("obs") String obs, @RequestParam("cirurgiao") String cirurgiao,
			@RequestParam("imagem") MultipartFile[] imagem,
			@RequestParam("token") String token){
		
		
		try {			
			
			System.out.println("\n####################################");
			System.out.println("- Enviando nova lesao da cirurgia para [" + cartaoSus + "]");
			if (!token.equals(this.tokenSys)) {
				System.out.println("! ! Token invalido ! !");
				System.out.println("####################################\n");
				throw new Exception();
			}
			System.out.println("1) Token valido!");

			PacienteCirurgia pac = pacCirRepo.findByCartaoSus(cartaoSus); 
			
			if (pac != null) {	
			
				System.out.println("2) Paciente encontrado!");
				LesaoCirurgia les = new LesaoCirurgia ();
				List<ImagemCirurgia> auxListImg = new ArrayList<ImagemCirurgia>();
				
				// Setando os dados vindo do smartphone
				les.setAuditado(false);
				les.setRegiao(regiao);
				les.setDiametroMaior(Float.parseFloat(diaMaior));
				les.setDiametroMenor(Float.parseFloat(diaMenor));
				les.setDiagnosticoClinico(diagnostico);
				les.setDiagnosticoClinicoSecundario(diagnosticoSec);
				les.setProcedimento(procedimento);
				les.setCirurgiao(cirurgiao);
				les.setDataProcedimento(pac.getDataUltimoAtendimento());
				les.setLocalProcedimento(pac.getLocalUltimoAtendimento());
				les.setObs(obs);	
				les.setPaciente(pac);
				
				// Incluindo as imagens
				for (MultipartFile img : imagem) {
					
					String nomeImg = cartaoSus + "_" + UUID.randomUUID().toString() + ".png";
					String path = "imagens/imagens_cirurgia/" + nomeImg;					
					imgServico.salvarImagem(img.getBytes(), path);
										
					// Inserindo a imagem para salvar no banco
					ImagemCirurgia imgLesao = new ImagemCirurgia();
					imgLesao.setPath(nomeImg);
					imgLesao.setLesao(les);
					auxListImg.add(imgLesao);
				}
								
				les.setImagens(auxListImg);
				
				System.out.println("3) Salvando lesao");				
				les.print();				
				
				if (pac.getLesoes() == null) {
					List<LesaoCirurgia> lesPaclist = new ArrayList<LesaoCirurgia>();
					lesPaclist.add(les);
					pac.setLesoes(lesPaclist);
					pacCirRepo.save(pac);
				} else {
					pac.getLesoes().add(les);
					pacCirRepo.save(pac);
				}			
				
				System.out.println("4) Lesao salva com sucesso!");
				System.out.println("############################\n");
			}			
			
		}catch (Exception e) {
			e.printStackTrace();
			System.out.println("ATENCAO: PROBLEMA NO ENVIO DA LESAO CIRURGIA");
		}	
		
	}
	
	@PostMapping("/api-smartphone/pacienteDermato/novaLesao/{cartaoSus}")
	@ResponseBody
	public void novaLesaoDermato (@PathVariable String cartaoSus, @RequestParam("regiao") String regiao,			 
			@RequestParam("diagnostico") String diagnostico, @RequestParam("diagnosticoSec") String diagnosticoSec, 
			@RequestParam("cresceu") String cresceu, @RequestParam("cocou") String cocou, 
			@RequestParam("sangrou") String sangrou, @RequestParam("relevo") String relevo,
			@RequestParam("doeu") String doeu, @RequestParam("mudou") String mudou, @RequestParam("idade") int idade, 
			@RequestParam(value = "localAtendimento", required = false, defaultValue = "NÃO INFORMADO") String localAtendimento,
			@RequestParam(value = "municipioResidencia", required=false,defaultValue = "NÃO INFORMADO") String municipioResidencia,
			@RequestParam("imagem") MultipartFile[] imagem,
			@RequestParam("token") String token){
		
		try {
			
			System.out.println("\n####################################");
			System.out.println("- Enviando nova lesao da dermato para [" + cartaoSus + "]");
			if (!token.equals(this.tokenSys)) {
				System.out.println("! ! Token invalido ! !");
				System.out.println("####################################\n");
				throw new Exception();
			}
			System.out.println("1) Token valido!");
			
			PacienteDermato pac = pacDerRepo.findByCartaoSus(cartaoSus);			
			
			if (pac == null) {
				System.out.println("2) Paciente nao existe. Ele esta sendo criado.");
				pac = new PacienteDermato();	
				pac.setCartaoSus(cartaoSus);
				pac.setAuditado(false);
			} else {			
				System.out.println("2) Paciente ja existe e sera alterado.");
			}
					
			
			LesaoDermato les = new LesaoDermato();
			List<ImagemDermato> imgList = new ArrayList<ImagemDermato>();			
			
			
			les.setAuditado(false);
			les.setRegiao(regiao);
			les.setDiagnostico(diagnostico);
			les.setDiagnosticoSecundario(diagnosticoSec);
			les.setCocou(cocou);
			les.setCresceu(cresceu);
			les.setDoeu(doeu);
			les.setMudou(mudou);
			les.setSangrou(sangrou);
			les.setIdade(idade);
			les.setRelevo(relevo);
			les.setPaciente(pac);
			les.setLocalAtendimento(localAtendimento);
			les.setMunicipioResidencia(municipioResidencia);
			les.setDataAtendimento(new Date());
			
			for (MultipartFile img : imagem) {
				
				String nomeImg = cartaoSus + "_" + UUID.randomUUID().toString() + ".png";
				String path = "imagens/imagens_dermato/" + nomeImg;					
				imgServico.salvarImagem(img.getBytes(), path);
															
				// Inserindo a imagem
				ImagemDermato imgLesao = new ImagemDermato ();				
				imgLesao.setPath(nomeImg);
				imgLesao.setLesao(les);
				imgList.add(imgLesao);				
				
			}
			
			les.setImagens(imgList);
			
			if (pac.getLesoes() == null) {
				List<LesaoDermato> lesPaclist = new ArrayList<LesaoDermato>();
				lesPaclist.add(les);
				pac.setLesoes(lesPaclist);
				pacDerRepo.save(pac);
			} else {
				pac.getLesoes().add(les);
				pacDerRepo.save(pac);
			}	
			
			System.out.println("3) Adicionando dados da lesao.");			
			les.print();
			
			System.out.println("4) Lesao adicionada com sucesso!");			
			System.out.println("####################################\n");		
			
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println("ATENCAO: PROBLEMA NO ENVIO DA LESAO DERMATO");
		}
		
	}	
	
	
	
	
	
}

class MiniPaciente {
	private String nome, pront, alergia, diabetes, anticoagulante, has;
	private float pressao_dia, pressao_sis;
	private int nLesoes;
	
	public MiniPaciente(PacienteCirurgia pac) {
		nome = pac.getNomeCompleto();
		pront = pac.getProntuario();
		alergia = pac.getAlergia();		
		
		if (pac.getDiabetes()=='S') {
			diabetes = "SIM";
		} else {
			diabetes = "NÃO";
		}
		
		if (pac.getUsoAnticoagulante()=='S') {
			anticoagulante = "SIM";
		} else {
			anticoagulante = "NÃO";
		}
		
		if (pac.getHipertensao()=='S') {
			has = "SIM";
		} else {
			has = "NÃO";
		}		
		
		pressao_dia = pac.getPresArtDiastolica();
		pressao_sis = pac.getPresArtSistolica();
		
		if (pac.getLesoes() != null) {
			nLesoes = pac.getLesoes().size();
		} else {
			nLesoes = 0;
		}
		
	}	
	
	public void print () {		
		System.out.println("Nome: " + this.getNome());
	}
	
	public float getPressao_sis() {
		return pressao_sis;
	}
	public void setPressao_sis(float pressao_sis) {
		this.pressao_sis = pressao_sis;
	}
	public float getPressao_dis() {
		return pressao_dia;
	}
	public void setPressao_dis(float pressao_dis) {
		this.pressao_dia = pressao_dis;
	}
	public String getNome() {
		return nome;
	}
	public void setNome(String nome) {
		this.nome = nome;
	}
	public String getPront() {
		return pront;
	}
	public void setPront(String pront) {
		this.pront = pront;
	}
	public String getAlergia() {
		return alergia;
	}
	public void setAlergia(String alergia) {
		this.alergia = alergia;
	}
	public String getDiabetes() {
		return diabetes;
	}
	public void setDiabetes(String diabetes) {
		this.diabetes = diabetes;
	}
	public String getAnticoagulante() {
		return anticoagulante;
	}
	public void setAnticoagulante(String anticoagulante) {
		this.anticoagulante = anticoagulante;
	}
	public String getHas() {
		return has;
	}
	public void setHas(String has) {
		this.has = has;
	}

	public int getnLesoes() {
		return nLesoes;
	}

	public void setnLesoes(int nLesoes) {
		this.nLesoes = nLesoes;
	}
	
	
}















