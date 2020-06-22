package br.labcin.sade.repositorio;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import br.labcin.sade.modelo.Configuracoes;

@RepositoryRestResource(collectionResourceRel = "configuracoes", path = "configuracoes")
public interface ConfiguracoesRepositorio extends PagingAndSortingRepository <Configuracoes, Long>{
	
	Configuracoes findByParametro (@Param("parametro") String parametro);

}
