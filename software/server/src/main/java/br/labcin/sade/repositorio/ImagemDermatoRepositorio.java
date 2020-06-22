package br.labcin.sade.repositorio;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import br.labcin.sade.modelo.ImagemDermato;

@RepositoryRestResource(collectionResourceRel = "imagemDermato", path = "imagemDermato")
public interface ImagemDermatoRepositorio extends PagingAndSortingRepository<ImagemDermato, Long>{
	
	ImagemDermato findByPath (@Param("path") String path);

}
