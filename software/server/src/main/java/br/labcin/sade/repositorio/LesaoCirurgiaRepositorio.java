package br.labcin.sade.repositorio;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import br.labcin.sade.modelo.LesaoCirurgia;
import br.labcin.sade.modelo.PacienteCirurgia;

@RepositoryRestResource(collectionResourceRel = "lesaoCirurgia", path = "lesaoCirurgia")
public interface LesaoCirurgiaRepositorio extends PagingAndSortingRepository<LesaoCirurgia, Long>{

	List<LesaoCirurgia> findByPacienteAndDiagnosticoHistoIsNull(@Param("paciente") PacienteCirurgia pac);
	
	List<LesaoCirurgia> findByDiagnosticoHistoIsNull();
	
	Page<LesaoCirurgia> findByPaciente (@Param("paciente") PacienteCirurgia pac, Pageable page);
	
	
}
