package br.labcin.sade.repositorio;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import br.labcin.sade.modelo.ImagemCirurgia;

@RepositoryRestResource(collectionResourceRel = "imagemCirurgia", path = "imagemCirurgia")
public interface ImagemCirurgiaRepositorio extends PagingAndSortingRepository<ImagemCirurgia, Long>{

}
