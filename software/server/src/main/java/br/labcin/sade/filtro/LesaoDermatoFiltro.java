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

import br.labcin.sade.modelo.LesaoDermato;

@Controller
public class LesaoDermatoFiltro {

	@PersistenceContext 
	private EntityManager em;
	
	/**
	 * @author André Pacheco
	 * Método para filtrar as lesões de acordo com os parâmetros, que podem ser uma ou várias
	 * @param diagnostico
	 * @param regiao
	 * @param page
	 * @return retorna um pagenable para paginar os resultados
	 */
	@PostMapping("/api/filtro/lesaoDermato") 
	@ResponseBody
	Page<LesaoDermato> filtraLesaoDermato (
			@RequestParam(value="diagnostico", required=false) String diagnostico,
			@RequestParam(value="regiao", required=false) String regiao,
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
		
		if (diagnostico != null) {
			predicates.add(cb.equal(root.get("diagnostico"), diagnostico));
			predicatesCount.add(cbCount.equal(rootCount.get("diagnostico"), diagnostico));			
		}	
		
		if (regiao != null) {
			predicates.add(cb.equal(root.get("regiao"), regiao));
			predicatesCount.add(cbCount.equal(rootCount.get("regiao"), regiao));
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
		
		// Retorna o total de todos os elementos da query
		long totalElementos = allLesDerm.size();
		
		// Retornando a paginação
		return new PageImpl<LesaoDermato>(lesDerm, page, totalElementos);	
	}
}


