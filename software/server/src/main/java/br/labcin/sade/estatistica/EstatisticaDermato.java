package br.labcin.sade.estatistica;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import br.labcin.sade.repositorio.LesaoDermatoRepositorio;

@Controller
public class EstatisticaDermato {

	@Autowired
	private LesaoDermatoRepositorio lesDerRepo;
	
	@GetMapping(value = "api/estatistica/dermato/agrupaDiagnostico")
	@ResponseBody
	public Object agrupaLesoes () {		
		List<Object> result = lesDerRepo.agrupaLesoes();		
		return result;		
	}
	
}
