package br.labcin.sade.filtro;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import br.labcin.sade.modelo.LesaoCirurgia;
import br.labcin.sade.modelo.PacienteCirurgia;

@Controller
public class LesaoCirurgiaFiltro {

	@PersistenceContext 
	private EntityManager em;
	
	/**
	 * @author André Pacheco / Guilherme Esgario
	 * Método para filtrar as lesões de acordo com os parâmetros, que podem ser uma ou várias
	 * @param diagClinico
	 * @param diagHisto
	 * @param regiao
	 * @param page
	 * @return retorna um pagenable para paginar os resultados
	 */
	@PostMapping("/api/filtro/lesaoCirurgia") 
	@ResponseBody
	Page<ResultadoFiltroLesao> filtraLesaoCirurgia (
			@RequestParam(value="diagClinico", required=false) String diagClinico,
			@RequestParam(value="diagHisto", required=false) String diagHisto,
			@RequestParam(value="regiao", required=false) String regiao,
			@RequestParam(value="dataInicial", required=false) @DateTimeFormat(pattern="yyyy-MM-dd") Date dataInicio,
			@RequestParam(value="dataFinal", required=false) @DateTimeFormat(pattern="yyyy-MM-dd") Date dataFinal,
			@RequestParam(value="localAtendimento", required=false) String localAtendimento,
			@RequestParam(value="nomePaciente", required=false) String nomePaciente,
			@RequestParam(value="semLesao", required=false) boolean semLesao,
			@RequestParam(value="semImagem", required=false) boolean semImagem,
			@RequestParam(value="padLocal", required=false) boolean padLocal,
			@RequestParam(value="semHisto", required=false) boolean semHisto,
			Pageable page){
		
		// Configurando para retornar a query em si
		CriteriaBuilder cb = em.getCriteriaBuilder();			
		CriteriaQuery<LesaoCirurgia> cq = cb.createQuery(LesaoCirurgia.class);
		Root<LesaoCirurgia> root = cq.from(LesaoCirurgia.class);
		cq.select(root);
	
		// Essa lista guarda os possíveis filtros
		List<Predicate> predicates = new ArrayList<>();
		
		// ####################################################
		// Daqui para baixo são inserido as queries requisitadas
		// ####################################################
		
		System.out.println("\n### INICIANDO FILTRO ###\n");
		
		// Interseção com paciente
		if (nomePaciente != null) {
			System.out.println("Nome Paciente: " + nomePaciente);
			predicates.add(cb.like(root.get("paciente").get("nomeCompleto"), "%"+nomePaciente+"%"));			
		}
		
		// Interseção com paciente
		if (padLocal) {			
			System.out.println("PadLocal: " + padLocal);
			predicates.add(cb.isTrue(root.get("paciente").get("sincronizar")));		
		}
		
		// Interseção com paciente
		if (semLesao) {
			System.out.println("semLesao: " + semLesao);
			
			// NAO FUNCIONA
			predicates.add(cb.isEmpty(root.get("paciente").get("lesoes")));			
		}		
		
		
		if(dataInicio != null) {
			System.out.println("Data inicial: " + dataInicio);
			predicates.add(cb.greaterThanOrEqualTo(root.get("dataProcedimento"), dataInicio));		
		}
		
		if(dataFinal != null) {		
			System.out.println("Data Final: " + dataFinal);
			predicates.add(cb.lessThanOrEqualTo(root.get("dataProcedimento"), dataFinal));
		}		
		
		if (localAtendimento != null) {
			System.out.println("Local: " + localAtendimento);
			predicates.add(cb.equal(root.get("localProcedimento"), localAtendimento));		
		}
		
		if (regiao != null) {
			System.out.println("Regiao: " + regiao);
			predicates.add(cb.equal(root.get("regiao"), regiao));
		}		
		
		if (semHisto) {			
			System.out.println("semHisto: " + semHisto);			
			predicates.add( cb.isNull(root.get("diagnosticoHisto")) );
		}		
		
		if (semImagem) {	
			System.out.println("semImagem: " + semImagem);
			predicates.add(cb.isEmpty(root.get("imagens")));
		}	
		
		
		if (diagClinico != null) {
			System.out.println("Diag. Clinico: " + diagClinico);
			predicates.add(cb.equal(root.get("diagnosticoClinico"), diagClinico));			
		}	

		if (diagHisto != null) {
			System.out.println("Diag. Histo: " + diagHisto);
			predicates.add(cb.equal(root.get("diagnosticoHisto"), diagHisto));			
		}
		
		if (regiao != null) {
			System.out.println("Região: " + regiao);
			predicates.add(cb.equal(root.get("regiao"), regiao));
		}
		
		// ####################################################
		
		// Aqui são inseridos os filtros que estão na lista de predicativo
		// nesse caso, tem que inserir para as duas buscas
		cq.where(cb.and(predicates.toArray(new Predicate[0])));		
		
		// Pegando o result list para contar o numero de lesoes e imagens	
		List<LesaoCirurgia> allLesCir = em.createQuery(cq).getResultList();
		
		// Contando o numero de lesoes e imagens e retornando um map
		Map<String, Long> mapNums = this.obtemNumerosLesaoImagensPacs(allLesCir);
		
		
		// Passando a query para o filter utils que retornará apenas a pagina buscada
		List<LesaoCirurgia> lesoes = FilterUtils.configurePagination(em.createQuery(cq), page).getResultList();
				
		
		// Esse array vai guardar a resposta do filtro
		List<ResultadoFiltroLesao> resFiltroList = new ArrayList<>();	
				
		// criando um tipo de resultado filtro e inserindo na lista criada acima
		ResultadoFiltroLesao resFiltro = new ResultadoFiltroLesao(preenchePacientes(lesoes), lesoes, 
				mapNums.get("numLesoes"), mapNums.get("numImagens"), mapNums.get("numPacientes") ); 
		
		resFiltroList.add(resFiltro);
				
		// Retornando a paginação
		return new PageImpl<ResultadoFiltroLesao>(resFiltroList, page, mapNums.get("numLesoes"));	

	}


	private Map<String, Long> obtemNumerosLesaoImagensPacs (List<LesaoCirurgia> lesoes) {
		
		int index;
		PacienteCirurgia pac;
		List<PacienteCirurgia> pacientes = new ArrayList<PacienteCirurgia>();
		long numImagens=0L, numPacientes, numLesoes;
		
		for (LesaoCirurgia les : lesoes) {
			index = pacientes.indexOf(les.getPaciente());			
			if (index != -1) {
				pacientes.get(index).getLesoes().add(les);
			} else {
				pac = les.getPaciente();
				List <LesaoCirurgia> novaListaLes = new ArrayList<LesaoCirurgia>();
				novaListaLes.add(les);				
				pac.setLesoes(novaListaLes);				
				pacientes.add(pac);				
			}
			
			numImagens += les.contaImagens();			
		}
		
		// Fazendo a estatistica
		numPacientes = (long) pacientes.size();
		numLesoes = (long) lesoes.size();
		
		Map<String, Long> mapNums = new HashMap <String, Long>();
		mapNums.put("numLesoes", numLesoes);
		mapNums.put("numImagens", numImagens);
		mapNums.put("numPacientes", numPacientes);
		
		return mapNums;		
	}
	
	
	private List<PacienteCirurgia> preenchePacientes (List<LesaoCirurgia> lesoes) {
		
		int index;
		PacienteCirurgia pac;
		List<PacienteCirurgia> pacientes = new ArrayList<PacienteCirurgia>();		
		
		for (LesaoCirurgia les : lesoes) {
			index = pacientes.indexOf(les.getPaciente());			
			if (index != -1) {
				pacientes.get(index).getLesoes().add(les);
			} else {
				pac = les.getPaciente();
				List <LesaoCirurgia> novaListaLes = new ArrayList<LesaoCirurgia>();
				novaListaLes.add(les);				
				pac.setLesoes(novaListaLes);				
				pacientes.add(pac);				
			}	
		}		
		return pacientes;
	}

}



class ResultadoFiltroLesao {
	private List<PacienteCirurgia> pacientes;
	private List<LesaoCirurgia> lesoes;
	private Long numLesoes;
	private Long numImagens;
	private Long numPacientes;
	
	public ResultadoFiltroLesao(List<PacienteCirurgia> pacs, List<LesaoCirurgia> less, long numL, long numI, long numPac) {
		super();
		
		this.pacientes = pacs;
		this.setLesoes(less);
		this.numLesoes = numL;
		this.numImagens = numI;
		this.numPacientes = numPac;
	}
	
	public ResultadoFiltroLesao() {
		
	}
	
	public void print () {
		System.out.println("##############################");
		System.out.println("Num. Pacs: " + this.numPacientes);
		System.out.println("Num. Les: " + this.numLesoes);
		System.out.println("Num. Imgs: " + this.numImagens);
		
		for (PacienteCirurgia pac: this.pacientes) {
			pac.print();
		}		
		System.out.println("##############################");
	}
	
	// ##############################################################################################################3
	
	public List<PacienteCirurgia> getPacientes() {
		return pacientes;
	}
	public void setPacientes(List<PacienteCirurgia> pacientes) {
		this.pacientes = pacientes;
	}
	public Long getNumLesoes() {
		return numLesoes;
	}
	public void setNumLesoes(Long numLesoes) {
		this.numLesoes = numLesoes;
	}
	public Long getNumImagens() {
		return numImagens;
	}
	public void setNumImagens(Long numImagens) {
		this.numImagens = numImagens;
	}

	public Long getNumPacientes() {
		return numPacientes;
	}

	public void setNumPacientes(Long numPacientes) {
		this.numPacientes = numPacientes;
	}

	public List<LesaoCirurgia> getLesoes() {
		return lesoes;
	}

	public void setLesoes(List<LesaoCirurgia> lesoes) {
		this.lesoes = lesoes;
	}	
	
}