package br.labcin.sade.repositorio;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import br.labcin.sade.modelo.PacienteCirurgia;

@RepositoryRestResource(collectionResourceRel = "pacienteCirurgia", path = "pacienteCirurgia")
public interface PacienteCirurgiaRepositorio extends PagingAndSortingRepository<PacienteCirurgia, Long>{

	Long countByAuditadoFalse ();
	
	Page<PacienteCirurgia> findByAuditadoFalse (Pageable page);

	PacienteCirurgia findByCartaoSus (@Param("cartaoSus") String cartaoSus);
	
	List<PacienteCirurgia> lesoesIsEmpty(Pageable page);
	
	Long countBySincronizarTrue ();
	
	List<PacienteCirurgia> findBySincronizarTrue ();
		
	@Modifying
	@Transactional
	@Query("update PacienteCirurgia p set p.sincronizar = false")
	int setAllSincronizarFalse ();
	
}
