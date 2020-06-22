package br.labcin.sade.repositorio;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import br.labcin.sade.modelo.LesaoDermato;
import br.labcin.sade.modelo.PacienteDermato;

@RepositoryRestResource(collectionResourceRel = "lesaoDermato", path = "lesaoDermato")
public interface LesaoDermatoRepositorio extends PagingAndSortingRepository<LesaoDermato, Long>{
	
	Page<LesaoDermato> findByPaciente (@Param("paciente") PacienteDermato pac, Pageable page);
	
	@Query(value="SELECT diagnostico, COUNT(id) FROM lesao_dermato GROUP BY diagnostico ORDER BY COUNT(id) DESC", nativeQuery=true)
	List<Object> agrupaLesoes ();
	
}