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

import br.labcin.sade.modelo.PacienteDermato;

@RepositoryRestResource(collectionResourceRel = "pacienteDermato", path = "pacienteDermato")
public interface PacienteDermatoRepositorio extends PagingAndSortingRepository<PacienteDermato, Long>{
	
	PacienteDermato findByCartaoSus (@Param("cartaoSus") String cartaoSus);
	
	Page<PacienteDermato> findByAuditadoFalse (Pageable page);
	
	Long countBySincronizarTrue ();
	
	List<PacienteDermato> findBySincronizarTrue ();
	
	@Modifying
	@Transactional
	@Query("update PacienteDermato p set p.sincronizar = false")
	int setAllSincronizarFalse ();	
}
