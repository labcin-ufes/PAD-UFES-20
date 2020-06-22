package br.labcin.sade.repositorio;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import br.labcin.sade.modelo.ImagemNaoSincronizada;

@RepositoryRestResource(collectionResourceRel = "imagemNaoSincronizada", path = "imagemNaoSincronizada")
public interface ImagemNaoSincronizadaRepositorio extends PagingAndSortingRepository<ImagemNaoSincronizada, Long>{

	ImagemNaoSincronizada findByPathCompleto (@Param("pathCompleto") String pathCompleto);
}
