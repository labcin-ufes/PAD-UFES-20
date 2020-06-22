package br.labcin.sade.controlador;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;

import br.labcin.sade.modelo.Termos;
import br.labcin.sade.repositorio.TermosRepositorio;


@Controller
public class TermosControlador {
	
	@Autowired
	private TermosRepositorio termosRepo;
	
	@GetMapping("/api-aberta/termos/{tipo}")
	@ResponseBody
	public Termos getTermo(@PathVariable String tipo){

	   return this.termosRepo.findByTipo(tipo);
	}
}
