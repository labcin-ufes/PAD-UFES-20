package br.labcin.sade.repositorio;

import java.util.List;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import br.labcin.sade.modelo.Procedimento;

@RepositoryRestResource(collectionResourceRel = "procedimento", path = "procedimento")
public interface ProcedimentoRepositorio extends PagingAndSortingRepository<Procedimento, Long>{

	List<Procedimento> findByNomeContaining (@Param("nome") String nome);
}
