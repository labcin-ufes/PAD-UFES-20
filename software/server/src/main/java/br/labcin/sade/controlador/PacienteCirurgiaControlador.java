package br.labcin.sade.controlador;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import br.labcin.sade.modelo.PacienteCirurgia;
import br.labcin.sade.repositorio.PacienteCirurgiaRepositorio;


@Controller
public class PacienteCirurgiaControlador {

	@Autowired
	PacienteCirurgiaRepositorio pacRepo;
	
	@GetMapping("/api/pacienteCirurgia/obtemPacCompletoPorCartaoSus")
	@ResponseBody
	public PacienteCirurgia buscaPacienteCartaoSus (@RequestParam("cartaoSus") String cartaoSus) {
		
		try {
			PacienteCirurgia pac = pacRepo.findByCartaoSus(cartaoSus);
			if (pac == null) {
				return null;
			} else {
				return pac;
			}
		} catch (Exception e) {
			return null;
		}
	}
	
	@PostMapping("/api/pacienteCirurgia/adicionarLesao")
	@ResponseBody
	public String adicionarLesao (@RequestBody PacienteCirurgia paciente) {
		
		if (pacRepo.save(paciente)!=null) {
			return "{\"estado\": \"lesao-adicionada\"}";
		} else {
			return "{\"estado\": \"problema-lesao\"}";
		}
		
	}

}
