package br.labcin.sade.repositorio;

import java.util.List;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

import br.labcin.sade.modelo.Diagnostico;

@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600) // anotacao para liberar o acesso ao angular em dev. Tirar isso da prod.
@RepositoryRestResource(collectionResourceRel = "diagnostico", path = "diagnostico")
public interface DiagnosticoRepositorio extends PagingAndSortingRepository<Diagnostico, Long>{

	List<Diagnostico> findByNomeContainingAndSubtipoFalse (@Param("nome") String nome);
	
	List<Diagnostico> findByNomeContainingAndSubtipoTrue (@Param("nome") String nome);
	
} 
