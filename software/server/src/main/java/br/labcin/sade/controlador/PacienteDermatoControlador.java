package br.labcin.sade.controlador;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import br.labcin.sade.modelo.PacienteDermato;
import br.labcin.sade.repositorio.PacienteDermatoRepositorio;

@Controller
public class PacienteDermatoControlador {

	@Autowired
	private PacienteDermatoRepositorio pacRepo;
	
	@GetMapping("/api/pacienteDermato/obtemPacCompletoPorCartaoSus")
	@ResponseBody
	public PacienteDermato buscaPacienteCartaoSus (@RequestParam("cartaoSus") String cartaoSus) {
		
		try {
			PacienteDermato pac = pacRepo.findByCartaoSus(cartaoSus); 
			if (pac == null) {
				return null;
			} else {
				return pac;
			}
		} catch (Exception e) {
			return null;
		}
	}
	
}
