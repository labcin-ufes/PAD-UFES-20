package br.labcin.sade.filtro;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import br.labcin.sade.modelo.LesaoCirurgia;
import br.labcin.sade.modelo.LesaoDermato;
import br.labcin.sade.modelo.PacienteCirurgia;
import br.labcin.sade.modelo.PacienteDermato;

@Controller
public class SegmentarImagemFiltro {
	
	@PersistenceContext 
	private EntityManager em;
	
	/**
	 * @author André Pacheco / Pedro Biasutti
	 * Método para filtrar as lesões de acordo com os parâmetros, que podem ser uma ou várias
	 * @param cartaoSus
	 * @param segmentado
	 * @param id
	 * @param page
	 * @return retorna um pagenable para paginar os resultados
	 */
	@PostMapping("/api/filtro/segmentarImagem/cirurgia") 
	@ResponseBody
	Page<ResultadoFiltroLesao> filtraLesaoCirurgia (
			@RequestParam(value="cartaoSus", required=false) String cartaoSus,
			@RequestParam(value="segmentado", required=false) boolean segmentado,
			@RequestParam(value="id", required=false) int id,
			Pageable page){
		
		// Configurando para retornar a query em si
		CriteriaBuilder cb = em.getCriteriaBuilder();			
		CriteriaQuery<LesaoCirurgia> cq = cb.createQuery(LesaoCirurgia.class);
		Root<LesaoCirurgia> root = cq.from(LesaoCirurgia.class);
		cq.select(root);
		
		// Configurando para retornar somente o count da query
		// Isso é importante para paginação e nao retornar todos os dados de uma so vez
		CriteriaBuilder cbCount = em.getCriteriaBuilder(); 
		CriteriaQuery<Long> cqCount = cbCount.createQuery(Long.class);
		Root<LesaoCirurgia> rootCount = cqCount.from(LesaoCirurgia.class);
		cqCount.select(cbCount.count(rootCount));
		
		// Essa lista guarda os possíveis filtros
		List<Predicate> predicates = new ArrayList<>();
		List<Predicate> predicatesCount = new ArrayList<>();
		
		
		// ####################################################
		// Daqui para baixo são inserido as queries requisitadas
		// ####################################################
		
		if (cartaoSus != null) {
			predicates.add(cb.equal(root.get("paciente").get("cartaoSus"), cartaoSus));		
		}

		if (segmentado) {
			predicates.add(cb.isFalse(root.join("imagens").get("segmentado")));	
		}
		
		if (id != -1) {
			predicates.add(cb.equal(root.get("id"), id));
		}
					
		
		// ####################################################
		
		// Aqui são inseridos os filtros que estão na lista de predicativo
		// nesse caso, tem que inserir para as duas buscas
		cq.where(cb.and(predicates.toArray(new Predicate[0])));
		cqCount.where(cb.and(predicatesCount.toArray(new Predicate[0])));
		
		// Pegando o result list para contar o numero de lesoes e imagens	
		List<LesaoCirurgia> allLesCir = em.createQuery(cq).getResultList();
		
		// Passando a query para o filter utils que retornará apenas a pagina buscada
		List<LesaoCirurgia> lesCir = FilterUtils.configurePagination(em.createQuery(cq), page).getResultList();
		
		// Esse array vai guardar a resposta do filtro
		List<ResultadoFiltroLesao> resFiltroList = new ArrayList<>();	
		
		// criando um tipo de resultado filtro e inserindo na lista criada acima
		ResultadoFiltroLesao resFiltro = new ResultadoFiltroLesao(preenchePacientes(lesCir), lesCir, 
				0, 0, 0 ); 
		
		resFiltroList.add(resFiltro);
		
		// Retorna o total de todos os elementos da query
		long totalElementos = allLesCir.size();
		
		// Retornando a paginação
		return new PageImpl<ResultadoFiltroLesao>(resFiltroList, page, totalElementos);
		
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
	
	/**
	 * @author André Pacheco / Pedro Biasutti
	 * Método para filtrar as lesões de acordo com os parâmetros, que podem ser uma ou várias
	 * @param cartaoSus
	 * @param segmentado
	 * @param page
	 * @return retorna um pagenable para paginar os resultados
	 */
	@PostMapping("/api/filtro/segmentarImagem/dermato") 
	@ResponseBody
	Page<ResultadoFiltroLesaoDermato> filtraLesaoDermato (
			@RequestParam(value="cartaoSus", required=false) String cartaoSus,
			@RequestParam(value="segmentado", required=false) boolean segmentado,
			@RequestParam(value="id", required=false) int id,
			Pageable page){
		
		// Configurando para retornar a query em si
		CriteriaBuilder cb = em.getCriteriaBuilder();			
		CriteriaQuery<LesaoDermato> cq = cb.createQuery(LesaoDermato.class);
		Root<LesaoDermato> root = cq.from(LesaoDermato.class);
		cq.select(root);
		
		// Configurando para retornar somente o count da query
		// Isso é importante para paginação e nao retoranr todos os dados de uma so vez
		CriteriaBuilder cbCount = em.getCriteriaBuilder(); 
		CriteriaQuery<Long> cqCount = cbCount.createQuery(Long.class);
		Root<LesaoDermato> rootCount = cqCount.from(LesaoDermato.class);
		cqCount.select(cbCount.count(rootCount));
		
		// Essa lista guarda os possíveis filtros
		List<Predicate> predicates = new ArrayList<>();
		List<Predicate> predicatesCount = new ArrayList<>();
		
		
		// ####################################################
		// Daqui para baixo são inserido as queries requisitadas
		// ####################################################
		
		if (cartaoSus != null) {
			predicates.add(cb.equal(root.join("paciente").get("cartaoSus"), cartaoSus));
			predicatesCount.add(cbCount.equal(rootCount.join("paciente").get("cartaoSus"), cartaoSus));			
		}	
		
		if (segmentado) {
			//predicates.add(cb.equal(root.join("imagens").get("segmentado"), segmentado));
			predicates.add(cb.isFalse(root.join("imagens").get("segmentado")));
			predicatesCount.add(cbCount.equal(rootCount.join("imagens").get("segmentado"), segmentado));
		}
		
		if (id != -1) {
			predicates.add(cb.equal(root.get("id"), id));
		}
		
		// ####################################################
		
		// Aqui são inseridos os filtros que estão na lista de predicativo
		// nesse caso, tem que inserir para as duas buscas
		cq.where(cb.and(predicates.toArray(new Predicate[0])));
		cqCount.where(cb.and(predicatesCount.toArray(new Predicate[0])));
		
		// Pegando o result list para contar o numero de lesoes e imagens	
		List<LesaoDermato> allLesDerm = em.createQuery(cq).getResultList();
		
		// Passando a query para o filter utils que retornará apenas a pagina buscada
		List<LesaoDermato> lesDerm = FilterUtils.configurePagination(em.createQuery(cq), page).getResultList();
		
		// Esse array vai guardar a resposta do filtro
		List<ResultadoFiltroLesaoDermato> resFiltroList = new ArrayList<>();	
		
		// criando um tipo de resultado filtro e inserindo na lista criada acima
		ResultadoFiltroLesaoDermato resFiltro = new ResultadoFiltroLesaoDermato(preenchePacientesDermato(lesDerm), lesDerm, 
				0, 0, 0 ); 
		
		resFiltroList.add(resFiltro);
		
		// Retorna o total de todos os elementos da query
		long totalElementos = allLesDerm.size();
		
		// Retornando a paginação
		return new PageImpl<ResultadoFiltroLesaoDermato>(resFiltroList, page, totalElementos);	
	}
	
	private List<PacienteDermato> preenchePacientesDermato (List<LesaoDermato> lesoes) {
		
		int index;
		PacienteDermato pac;
		List<PacienteDermato> pacientes = new ArrayList<PacienteDermato>();		
		
		for (LesaoDermato les : lesoes) {
			index = pacientes.indexOf(les.getPaciente());			
			if (index != -1) {
				pacientes.get(index).getLesoes().add(les);
			} else {
				pac = les.getPaciente();
				List <LesaoDermato> novaListaLes = new ArrayList<LesaoDermato>();
				novaListaLes.add(les);				
				pac.setLesoes(novaListaLes);				
				pacientes.add(pac);				
			}	
		}		
		return pacientes;
	}
	
	

}


class ResultadoFiltroLesaoDermato {
	private List<PacienteDermato> pacientes;
	private List<LesaoDermato> lesoes;
	private Long numLesoes;
	private Long numImagens;
	private Long numPacientes;
	
	public ResultadoFiltroLesaoDermato(List<PacienteDermato> pacs, List<LesaoDermato> less, long numL, long numI, long numPac) {
		super();
		
		this.pacientes = pacs;
		this.setLesoes(less);
		this.numLesoes = numL;
		this.numImagens = numI;
		this.numPacientes = numPac;
	}
	
	public ResultadoFiltroLesaoDermato() {
		
	}
	
	// ##############################################################################################################3
	
	public List<PacienteDermato> getPacientes() {
		return pacientes;
	}
	public void setPacientes(List<PacienteDermato> pacientes) {
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

	public List<LesaoDermato> getLesoes() {
		return lesoes;
	}

	public void setLesoes(List<LesaoDermato> lesoes) {
		this.lesoes = lesoes;
	}	
	
}
