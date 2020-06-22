package br.labcin.sade.repositorio;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import br.labcin.sade.modelo.Agenda;

@RepositoryRestResource(collectionResourceRel = "agenda", path = "agenda")
public interface AgendaRepositorio extends PagingAndSortingRepository<Agenda, Long>{

}
