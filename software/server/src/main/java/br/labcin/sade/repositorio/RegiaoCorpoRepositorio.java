package br.labcin.sade.repositorio;

import java.util.List;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

import br.labcin.sade.modelo.RegiaoCorpo;

@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600) // anotacao para liberar o acesso ao angular em dev. Tirar isso da prod.
@RepositoryRestResource(collectionResourceRel = "regiaoCorpo", path = "regiaoCorpo")
public interface RegiaoCorpoRepositorio extends PagingAndSortingRepository<RegiaoCorpo, Long>{

	List<RegiaoCorpo> findByNomeContaining (@Param("nome") String nome);
	
	RegiaoCorpo findByNome (@Param("nome") String nome); 
}
