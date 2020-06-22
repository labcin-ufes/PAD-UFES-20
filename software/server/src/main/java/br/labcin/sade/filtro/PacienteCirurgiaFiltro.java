package br.labcin.sade.filtro;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.JoinType;
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

import br.labcin.sade.modelo.PacienteCirurgia;


@Controller
public class PacienteCirurgiaFiltro {
	
	@PersistenceContext 
	private EntityManager em;
	
	/**
	 * @author André Pacheco
	 * Método para filtrar os pacientes de acordo com os parâmetros, que podem ser um ou vários
	 * @param dataInicio
	 * @param dataFinal
	 * @param diagClinico
	 * @param diagHisto
	 * @param localAtendimento
	 * @param regiao
	 * @param nomePaciente
	 * @param comLesao
	 * @param comImagem
	 * @param page
	 * @return retorna um pagenable para paginar os resultados
	 */
	@PostMapping("api/filtro/pacienteCirurgia")
	@ResponseBody
	Page<ResultadoFiltro> filtraPacienteCirurgia (			
			@RequestParam(value="dataInicial", required=false) @DateTimeFormat(pattern="yyyy-MM-dd") Date dataInicio,
			@RequestParam(value="dataFinal", required=false) @DateTimeFormat(pattern="yyyy-MM-dd") Date dataFinal,
			@RequestParam(value="diagClinico", required=false) String diagClinico,
			@RequestParam(value="diagHisto", required=false) String diagHisto, 
			@RequestParam(value="localAtendimento", required=false) String localAtendimento,
			@RequestParam(value="regiao", required=false) String regiao,
			@RequestParam(value="nomePaciente", required=false) String nomePaciente,
			@RequestParam(value="semLesao", required=false) boolean semLesao,
			@RequestParam(value="semImagem", required=false) boolean semImagem,
			@RequestParam(value="padLocal", required=false) boolean padLocal,
			@RequestParam(value="semHisto", required=false) boolean semHisto,
			Pageable page) {
		
		// Configurando para retornar a query em si
		CriteriaBuilder cb = em.getCriteriaBuilder();			
		CriteriaQuery<PacienteCirurgia> cq = cb.createQuery(PacienteCirurgia.class);
		Root<PacienteCirurgia> root = cq.from(PacienteCirurgia.class);
		cq.select(root);		
		
		// Essa lista guarda os possíveis filtros
		List<Predicate> predicates = new ArrayList<>();
		
		
		// ####################################################
		// Daqui para baixo são inserido as queries requisitadas
		// ####################################################
		
		System.out.println("\n### INICIANDO FILTRO ###\n");
		
		if (nomePaciente != null) {
			System.out.println("Nome Paciente: " + nomePaciente);
			predicates.add(cb.like(root.get("nomeCompleto"), "%"+nomePaciente+"%"));
		}

		if(dataInicio != null) {
			System.out.println("Data inicial: " + dataInicio);
			predicates.add(cb.greaterThanOrEqualTo(root.join("lesoes").get("dataProcedimento"), dataInicio));		
		}
		
		if(dataFinal != null) {		
			System.out.println("Data Final: " + dataFinal);
			predicates.add(cb.lessThanOrEqualTo(root.join("lesoes").get("dataProcedimento"), dataFinal));
		}
		
		if (diagClinico != null) {
			System.out.println("Diag. Clinico: " + diagClinico);
			predicates.add(cb.equal(root.join("lesoes").get("diagnosticoClinico"), diagClinico));		
		}	
		
		if (diagHisto != null) {
			System.out.println("Diag. Histo.: " + diagHisto);
			predicates.add(cb.equal(root.join("lesoes").get("diagnosticoHisto"), diagHisto));	
		}

		if (localAtendimento != null) {
			System.out.println("Local: " + localAtendimento);
			predicates.add(cb.equal(root.join("lesoes").get("localProcedimento"), localAtendimento));		
		}
		
		if (regiao != null) {
			System.out.println("Regiao: " + regiao);
			predicates.add(cb.equal(root.join("lesoes").get("regiao"), regiao));
		}
		

		if (semLesao) {
			System.out.println("semLesao: " + semLesao);
			predicates.add(cb.isEmpty(root.get("lesoes")));			
		}
		
		if (semHisto) {			
			System.out.println("semHisto: " + semHisto);			
			// predicates.add(cb.isEmpty(root.get("lesoes")));	
			predicates.add( cb.isNull(root.join("lesoes").get("diagnosticoHisto")) );
		}		
		
		if (semImagem) {	
			System.out.println("semImagem: " + semImagem);
			// predicates.add(cb.isEmpty(root.get("lesoes")));	
			predicates.add(cb.isEmpty(root.join("lesoes", JoinType.LEFT).get("imagens")));
		}
		
		if (padLocal) {			
			System.out.println("PadLocal: " + padLocal);
			predicates.add(cb.isTrue(root.get("sincronizar")));		
		}		
		
		System.out.println("\n#########################");
		
		// ####################################################
		
		
		cq.orderBy(cb.asc(root.get("nomeCompleto")));
		cq.distinct(true);
				
		// Aqui são inseridos os filtros que estão na lista de predicativo
		// nesse caso, tem que inserir para as duas buscas
		cq.where(cb.and(predicates.toArray(new Predicate[0])));
		
		// Pegando o result list para contar o numero de lesoes e imagens		
		List<PacienteCirurgia> allPacs = em.createQuery(cq).getResultList();
		
		// Contando o numero de lesoes e iamgens e retornando um map
		Map<String, Long> resultsMapContagem = PacienteCirurgia.contaLesoesEImagensLista(allPacs);
		
		
		// Passando a query para o filter utils que retornará apenas a pagina buscada
		List<PacienteCirurgia> pacs = FilterUtils.configurePagination(em.createQuery(cq), page).getResultList();
		
		// Retorna o total de todos os elementos da query
		//long totalElementos = em.createQuery(cqCount).getSingleResult();
		long totalElementos = allPacs.size();
		
		// Imprimindo para conferencia
		System.out.println("\nNumPacientes: " + totalElementos);
		System.out.println("NumLesoes: " + resultsMapContagem.get("numLesoes"));
		System.out.println("NumImagens: " + resultsMapContagem.get("numImagens"));
		System.out.println("\n#########################");
		
		// Esse array vai guardar a resposta do filtro
		List<ResultadoFiltro> resFiltroList = new ArrayList<>();
		
		// criando um tipo de resultado filtro e inserindo na lista criada acima
		ResultadoFiltro resFiltro = new ResultadoFiltro(pacs, resultsMapContagem.get("numLesoes"), resultsMapContagem.get("numImagens"), totalElementos ); 
		resFiltroList.add(resFiltro);
		
		// Retornando a paginação
		return new PageImpl<ResultadoFiltro>(resFiltroList, page, totalElementos);	
		
	}
	
}

class ResultadoFiltro {
	private List<PacienteCirurgia> pacientes;
	private Long numLesoes;
	private Long numImagens;
	private Long numPacientes;
	
	public ResultadoFiltro(List<PacienteCirurgia> pacientes, Long numLesoes, Long numImagens, Long numPacientes) {
		super();
		this.pacientes = pacientes;
		this.numLesoes = numLesoes;
		this.numImagens = numImagens;
		this.numPacientes = numPacientes;
	}
	
	public ResultadoFiltro() {
		
	}	
	
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
	
}
