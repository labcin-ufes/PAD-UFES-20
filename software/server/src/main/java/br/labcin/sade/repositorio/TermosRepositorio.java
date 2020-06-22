package br.labcin.sade.repositorio;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import br.labcin.sade.modelo.Termos;

@RepositoryRestResource(collectionResourceRel = "termos", path = "termos")
public interface TermosRepositorio extends PagingAndSortingRepository<Termos, Long>{
	
	Termos findByTipo(@Param("tipo") String tipo);
}
