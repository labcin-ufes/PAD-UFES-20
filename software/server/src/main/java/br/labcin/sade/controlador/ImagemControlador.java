package br.labcin.sade.controlador;

import java.io.File;
import java.io.InputStream;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import br.labcin.sade.modelo.ImagemNaoSincronizada;
import br.labcin.sade.repositorio.ImagemNaoSincronizadaRepositorio;
import br.labcin.sade.servico.ImagemServico;


@Controller
public class ImagemControlador {
	
	@Autowired
	ImagemServico imgServico;
	
	@Autowired
	ImagemNaoSincronizadaRepositorio imgNaoSicRepo;
	
	/**
	 * Método para pegar uma imagem do servidor. Para isso é necessário informar com um json no corpo
	 * da requisição o tipo do paciente e o nome da imagem que deseja recuperar
	 * @param dadosJson Um objeto json com nomeImg, tipoPaciente, largura e altura
	 * @return Uma imagem que está salva no servidor
	 * 
	 */
	@GetMapping(value = "api/imagem/baixar", produces = MediaType.IMAGE_PNG_VALUE)
	public ResponseEntity<InputStreamResource> obtemImagem(
			@RequestParam("nomeImg") String nomeImg, @RequestParam("tipo") String tipo,
			@RequestParam(value="largura", required=false) Integer largura,
			@RequestParam(value="altura", required=false) Integer altura) {
		
		
		if (largura==null) {
			largura = 0;
		}
		
		if (altura ==null) {
			altura = 0;
		}
		
		
		// Guarda a pasta que a imagem vai ser salva no servidor
		String pasta;

		// Checando o tipo do paciente para decidir para onde vai a imagem
		if (tipo.equals("cirurgia")) {
			pasta = "imagens/imagens_cirurgia/";
			System.out.println("\nEnviando imagem para o paciente cirurgia...");

		} else if (tipo.equals("dermato")) {
			pasta = "imagens/imagens_dermato/";
			System.out.println("\nEnviando imagem para o paciente dermato...");

		} else if (tipo.equals("cirurgia-mask")) {
			pasta = "imagens/imagens_cirurgia_mask/";
			System.out.println("\nEnviando mascara da cirurgia...");

		} else if (tipo.equals("dermato-mask")) {
			pasta = "imagens/imagens_dermato_mask/";
			System.out.println("\nEnviando masrcara da dermato...");

		} else {
			return null;
		}
		
		InputStream imgStream = imgServico.pegarImagem(pasta+nomeImg, largura, altura);
		if (imgStream == null) {
			return null;
		} 
        return ResponseEntity
                .ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(new InputStreamResource(imgStream));	
	}
	
	/**
	 * Método que retorna uma imagem em Base64
	 * @param nomeImg String com o nome da imagem que deseja pegar
	 * @param String com o tipo do paciente: cirurgia, dermato, cirurgia-mask ou dermato-mask
	 * @return String com a imagem em base64
	 */
	@GetMapping(value = "api/imagem/baixarBase64")
	@ResponseBody
	public String obtemImagemBase64(@RequestParam("nomeImg") String nomeImg, @RequestParam("tipo") String tipo) {
		
		// Guarda a pasta que a imagem vai ser salva no servidor
		String pasta;
		
		// Checando o tipo do paciente para decidir para onde vai a imagem
		if (tipo.equals("cirurgia")) {
			pasta = "imagens/imagens_cirurgia/";
			System.out.println("\nEnviando imagem para o paciente cirurgia...");

		} else if (tipo.equals("dermato")) {
			pasta = "imagens/imagens_dermato/";
			System.out.println("\nEnviando imagem para o paciente dermato...");

		} else if (tipo.equals("cirurgia-mask")) {
			pasta = "imagens/imagens_cirurgia_mask/";
			System.out.println("\nEnviando masrcara da cirurgia...");
		
		} else if (tipo.equals("dermato-mask")) {
			pasta = "imagens/imagens_dermato_mask/";
			System.out.println("\nEnviando masrcara da dermato...");
			
		} else {
			return null;
		}
		
		String imgBase64 = imgServico.pegarImagemEmBase64(pasta+nomeImg);
		if (imgBase64 == null) {
			return null;
		}
        return "{\"imagem\":\"" + imgBase64 + "\"}";
	}
	

	/**
	 * Método para que faz o upload de uma ou mais imagens. Para enviar, basta utilizar um FormData
	 * com os arquivos das imagens, o tipo do paciente e nome dado a imagem. O método irá salvar na pasta adequada
	 * e retornar um json com estado da resposta
	 * @param imagens As imagens enviadas do frontend
	 * @param tipoPaciente String com o tipo do paciente: cirurgia, dermato, cirurgia-mask, dermato-mask
	 * @param nomeImg  String com o nome dado para a imagem
	 * @return
	 */
	@PostMapping("/api/imagem/upload")
	@ResponseBody
	public String imagemUpload (@RequestParam("imagens") MultipartFile[] imagens, 
						 @RequestParam("tipoPaciente") String tipoPaciente,
						 @RequestParam("nomeImg") String[] nomeImg){
		
		// Guarda a pasta que a imagem vai ser salva no servidor
		String pasta;
		
		// Checando o tipo do paciente para decidir para onde vai a imagem
		if (tipoPaciente.equals("cirurgia")) {
			pasta = "imagens/imagens_cirurgia/";
			System.out.println("\nEnviando imagem para o paciente cirurgia...");

		} else if (tipoPaciente.equals("dermato")) {
			pasta = "imagens/imagens_dermato/";
			System.out.println("\nEnviando imagem para o paciente dermato...");

		} else if (tipoPaciente.equals("cirurgia-mask")) {
			pasta = "imagens/imagens_cirurgia_mask/";
			System.out.println("\nEnviando mascara da cirurgia...");

		} else if (tipoPaciente.equals("dermato-mask")) {
			pasta = "imagens/imagens_dermato_mask/";
			System.out.println("\nEnviando masrcara da dermato...");

		} else {
			return "{\"estado\": \"tipo-paciente-invalido\"}";
		}
		
		// Salvando a imagem no servidor. No caso, pode existir uma ou várias
		int i = 0;
		for (MultipartFile img: imagens) {
			
			try {
				String pathImg = pasta + nomeImg[i];
				byte imgBytes [] = img.getBytes();
				i++;
				
				// Chamando o servico de imagem e salvando a mesma
				if (!imgServico.salvarImagem(imgBytes, pathImg)) {
					return "{\"estado\": \"erro-salvar-imagem\"}";
				}
				
				// Inserindo a imagem dentro da tabela das nao sincronizadas
				if (!this.incluirImagemNaoSincronizada (pathImg, "adicionar")) {
					return "{\"estado\": \"erro-salvar-imagem-nao-sincronizada\"}";
				}

				
			} catch (Exception e) {
				e.printStackTrace();
				return "{\"estado\": \"erro-salvar-imagem\"}";
			}
		}		
		return "{\"estado\": \"imagem-salva\"}";
	}
	
	/**
	 * Método que recebe uma imagem em base64 e a salva no servidor
	 * @param imgBase64 String com a imagem em base64
	 * @param tipoPaciente String com o tipo do paciente: cirurgia, dermato, cirurgia-mask, dermato-mask
	 * @param nomeImg String com o nome da imagem
	 * @return a Json com o estado da operação
	 */
	@PostMapping("/api/imagem/uploadBase64")
	@ResponseBody
	public String imagemUploadBase64 (@RequestParam("imgBase64") String imgBase64, 
						 @RequestParam("tipoPaciente") String tipoPaciente,
						 @RequestParam("nomeImg") String nomeImg){
		
		// Guarda a pasta que a imagem vai ser salva no servidor
		String pasta;

		// Checando o tipo do paciente para decidir para onde vai a imagem
		if (tipoPaciente.equals("cirurgia")) {
			pasta = "imagens/imagens_cirurgia/";
			System.out.println("\nEnviando imagem para o paciente cirurgia...");

		} else if (tipoPaciente.equals("dermato")) {
			pasta = "imagens/imagens_dermato/";
			System.out.println("\nEnviando imagem para o paciente dermato...");

		} else if (tipoPaciente.equals("cirurgia-mask")) {
			pasta = "imagens/imagens_cirurgia_mask/";
			System.out.println("\nEnviando mascara da cirurgia...");

		} else if (tipoPaciente.equals("dermato-mask")) {
			pasta = "imagens/imagens_dermato_mask/";
			System.out.println("\nEnviando masrcara da dermato...");

		} else {
			return "{\"estado\": \"tipo-paciente-invalido\"}";
		}
		
		if (imgServico.salvarImagemBase64(imgBase64, pasta + nomeImg)) {
			
			// Inserindo a imagem dentro da tabela das nao sincronizadas
			if (!this.incluirImagemNaoSincronizada (pasta + nomeImg, "adicionar")) {
				return "{\"estado\": \"erro-salvar-imagem-nao-sincronizada\"}";
			}
			
			return "{\"estado\": \"imagem-salva\"}";
			
		} else {
			return "{\"estado\": \"erro-salvar-imagem\"}";
		}
		
	}	
	
	@PostMapping("/api/imagem/remover")
	@ResponseBody
	public String removerImagem (@RequestParam("nomeImg") String nomeImg, @RequestParam("tipo") String tipo) {
		
		// Guarda a pasta que a imagem vai ser salva no servidor
		String pasta;
		
		// Checando o tipo do paciente para decidir para onde vai a imagem
		if (tipo.equals("cirurgia")) {			
			pasta = "imagens/imagens_cirurgia/";			
			System.out.println("\nInserindo imagem para o paciente cirurgia...");		
			
		} else if (tipo.equals("dermato")) {
			pasta = "imagens/imagens_dermato/";			
			System.out.println("\nInserindo imagem para o paciente dermato...");			
			
		} else if (tipo.equals("cirurgia-mask")) {
			pasta = "imagens/imagens_cirurgia_mask/";
			System.out.println("\nEnviando mascara da cirurgia...");

		} else if (tipo.equals("dermato-mask")) {
			pasta = "imagens/imagens_dermato_mask/";
			System.out.println("\nEnviando masrcara da dermato...");
			
		} else {
			return "{\"estado\": \"tipo-paciente-invalido\"}";
		}
		
		if (imgServico.removerImagem(pasta+nomeImg)) {
			
			// Inserindo a imagem dentro da tabela das nao sincronizadas
			if (!this.incluirImagemNaoSincronizada (pasta + nomeImg, "remover")) {
				return "{\"estado\": \"erro-salvar-imagem-nao-sincronizada\"}";
			}
			
			return "{\"estado\": \"imagem-removida\"}";
		} else {
			return "{\"estado\": \"falha-remocao\"}";
		}
		
	}
	
	/**
	 * Este é método é executado sempre que o servidor é iniciado.
	 * Ele verifica se a pasta de imagens existe. Se sim, ele não cria outra.
	 * Caso contrário ele cria uma pasta de imagens para cirurgia, uma para dermato e
	 * outra de imagens segmentadas.
	 * @author André Pacheco
	 */
	@PostConstruct
	public void criaPastasDeImagens () {
		
		File pastaImgCirurgia = new File("./imagens/imagens_cirurgia");
		File pastaImgDermato = new File("./imagens/imagens_dermato");
		File pastaImgCirurgiaMask = new File("./imagens/imagens_cirurgia_mask");
		File pastaImgDermatoMask = new File("./imagens/imagens_dermato_mask");
		
		// Criando (ou não) a pasta da cirurgia
		if (pastaImgCirurgia.mkdirs()) {
			System.out.println("\nCriando a pasta de imagens dos pacientes da cirurgia...\n");
		} else {
			System.out.println("\nPasta das imagens dos pacientes da cirurgia ja foi criada em algum momento no passado...\n");
		}
		
		// Criando (ou não) a pasta da dermato
		if (pastaImgDermato.mkdirs()) {
			System.out.println("\nCriando a pasta de imagens dos pacientes da dermato...\n");
		} else {
			System.out.println("\nPasta das imagens dos pacientes da dermato ja foi criada em algum momento no passado...\n");
		}
		
		// Criando (ou não) a pasta das mascaras da cirurgia
		if (pastaImgCirurgiaMask.mkdirs()) {
			System.out.println("\nCriando a pasta das mascaras de segmentação das imagens da cirurgia...\n");
		} else {
			System.out.println("\nPasta das mascaras de segmentação da cirurgia ja foi criada em algum momento no passado...\n");
		}
		
		// Criando (ou não) a pasta das mascaras da dermato
		if (pastaImgDermatoMask.mkdirs()) {
			System.out.println("\nCriando a pasta das mascaras de segmentação das imagens da dermato...\n");
		} else {
			System.out.println("\nPasta das mascaras de segmentação da dermato ja foi criada em algum momento no passado...\n");
		}
	}	
	
	/**
	 * Método interno para incluir uma noma imagem na tabela de nao sincronizadas.
	 * Este método será chamado sempre que uma nova imagem é adicionada ou removida do servidor.
	 * É utilizado no momento da sincronização dos servidores
	 * @param pathCompleto String com o path completo da imagem
	 * @param op Operação a ser realizada (adicionar ou remover)
	 * @return boolean indicando se tudo deu certo
	 */
	private boolean incluirImagemNaoSincronizada (String pathCompleto, String op) {
		try {
			// Inserindo a imagem dentro da tabela das nao sincronizadas
			ImagemNaoSincronizada imgNao = new ImagemNaoSincronizada();
			imgNao.setPathCompleto(pathCompleto);
			imgNao.setOperacao(op);
			this.imgNaoSicRepo.save(imgNao);
			// Fim
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
}
