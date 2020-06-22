package br.labcin.sade.controlador;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import javax.annotation.PostConstruct;

import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.ObjectMapper;
import com.mashape.unirest.http.Unirest;

import br.labcin.sade.modelo.ImagemNaoSincronizada;
import br.labcin.sade.repositorio.ImagemNaoSincronizadaRepositorio;
import br.labcin.sade.repositorio.PacienteCirurgiaRepositorio;
import br.labcin.sade.repositorio.PacienteDermatoRepositorio;
import br.labcin.sade.servico.ArquivoServico;
import br.labcin.sade.servico.ImagemServico;
import br.labcin.sade.servico.SincronizarServico;

@Controller
public class SincronizadorControlador {
	
	@Value("${servidor.remoto.url}")
	private String urlServidorRemoto;
	
	@Value("${spring.datasource.password}")
	private String senhaBanco;
	
	// Pegando o token para validar a operacao
	@Value("${token.api}")
	private String tokenSys;	
	
	@Autowired
	private ArquivoServico arqServico;
	
	@Autowired
	private SincronizarServico sincServ;
	
	@Autowired
	private PacienteCirurgiaRepositorio pacCirRepo;
	
	@Autowired
	private PacienteDermatoRepositorio pacDerRepo;
	
	@Autowired
	private ImagemNaoSincronizadaRepositorio imgNaoRepo;
	
	@Autowired
	private ImagemServico imgServico;

	/**
	 * Método para criar a pasta do ./banco no servidor. É criado caso ela nao exista.
	 */
	@PostConstruct
	private void criarPastaBanco () {
		File pastaBanco = new File("./banco");
		
		// Criando (ou não) a pasta do banco
		if (pastaBanco.mkdirs()) {
			System.out.println("\nCriando a pasta do banco...\n");
		} else {
			System.out.println("\nPasta do banco ja foi criada em algum momento no passado...\n");
		}
	}	
	
	/**
	 * Método para configurar o Unirest
	 */
	private void configuraUnirest () { 
		Unirest.setObjectMapper(new ObjectMapper() {
		    private com.fasterxml.jackson.databind.ObjectMapper jacksonObjectMapper
		                = new com.fasterxml.jackson.databind.ObjectMapper();
	
		    public <T> T readValue(String value, Class<T> valueType) {
		        try {
		            return jacksonObjectMapper.readValue(value, valueType);
		        } catch (IOException e) {
		            throw new RuntimeException(e);
		        }
		    }
	
		    public String writeValue(Object value) {
		        try {
		            return jacksonObjectMapper.writeValueAsString(value);
		        } catch (JsonProcessingException e) {
		            throw new RuntimeException(e);
		        }
		    }
		});	
	}
	
	// ##################################################################################
	// ################### CODIGO QUE É EXECUTADO NO SERVIDOR LOCAL ####################
	// ##################################################################################
	
	/**
	 * Método que envia a copia do banco do servidor local para o servidor remoto
	 * 
	 * É esse o endpoint que é chamado pelo front para sincronizar banco remoto
	 * 
	 * @param urlServer String  condicional, se enviada, considera esse o endereco do servidor. Caso contrario, pega o servidor que está
	 * descrito no applications.properties
	 * @return String com o resultado da operação
	 */	
	
	@PostMapping("/api-aberta/sincronizador/atualizar-banco-remoto")
	@ResponseBody
	public String enviaBancoParaServidorRemoto (@RequestParam(value="token") String token,
			@RequestParam(value="urlServer", required=false) String urlServer) {
		
		System.out.println("\n### Iniciando atualizacao do banco remoto ###");
		
		// Checando o token
		if (!token.equals(this.tokenSys)) {
			System.out.println("! ! TOKEN INVALIDO ! !");
			System.out.println("Abortando...");
			return "{\"estado\": \"token-invalido\"}";
		}		
		System.out.println("## O token e valido! ##");
		
		// Configurando Unirest
		this.configuraUnirest ();
		
		// Caso a URL seja informada, considerar ela
		if (urlServer == null) {
			urlServer = this.urlServidorRemoto;
		}
		
		// urlServer = "http://192.168.0.116:8080";		
		
		System.out.println("1) Gerando uma copia do banco no servidor local.");
		// Gerando a cópia do banco local
		if (!this.sincServ.gerarCopiaBanco(this.senhaBanco)) {
			System.out.println("!! Problema ao gerar copia do banco !!.");
			return "{\"estado\": \"problema-copiar-banco\"}";
		}
		System.out.println("2) Enviando uma copia do banco para servidor remoto.");
		
		try {
			// Enviando cópia do banco para o servidor remoto
			HttpResponse<String> httpReq = Unirest.post(urlServer + "/api-aberta/sincronizador/recebe-banco-local")
				.header("accept", "application/json")				
				.field("arquivo", new File("./banco/SADE.sql"))
				.field("token", token)
				.asString();
		
			if (httpReq.getStatus() != 200) {
				System.out.println("! ! Erro enviar copia do banco: " + httpReq.getStatus() + " ! !");
				return "{\"estado\": \"req-dif-200\"}";					
			}
			
			// Setando todos os pacientes como sincronizados
			System.out.println("3) Setando todos os pacientes (cirurgia e dermato) como sincronizados");
			this.pacCirRepo.setAllSincronizarFalse();
			this.pacDerRepo.setAllSincronizarFalse();
			
		} catch (Exception e) {
			e.printStackTrace();
			return "{\"estado\": \"problema-enviar-banco\"}";
		}		
	
		System.out.println("4) Copia enviada com sucesso.");
		System.out.println("###############################################\n");
		return "{\"estado\": \"banco-sincronizado\"}";
	}
	
	
	/**
	 * Este método pega o banco do servidor remoto e salva no banco local para que este 
	 * esteja sincronizado com o remoto. 
	 * 
	 * É esse o endpoint que é chamado pelo front para sincronizar banco local
	 * 
	 * @param urlServer String  condicional, se enviada, considera esse oendereco do servidor. Caso contratio, pega o servidor que está
	 * descrito no applications.properties
	 */
	@PostMapping("/api-aberta/sincronizador/atualizar-banco-local")
	@ResponseBody
	public String obtemBancoDoServidorRemoto (@RequestParam(value="token") String token,
			@RequestParam(value="urlServer", required=false) String urlServer) {
		
		// Configurando Unirest
		this.configuraUnirest ();
		
		System.out.println("\n### Iniciando atualizacao do banco remoto ###");
		
		// Checando o token
		if (!token.equals(this.tokenSys)) {
			System.out.println("! ! TOKEN INVALIDO ! !");
			System.out.println("Abortando...");
			return "{\"estado\": \"token-invalido\"}";
		}
		System.out.println("## O token e valido! ##");
		
		
		System.out.println("1) Enviando requisicao para o banco remoto");
		
		// Caso a URL seja informada, considerar ela
		if (urlServer == null) {
			urlServer = this.urlServidorRemoto;
		}
		// urlServer = "http://localhost:8080";
		
		try {
			// Pegando uma cópia do banco para o servidor remoto
			HttpResponse<InputStream> httpReq = Unirest.get(urlServer + "/api-aberta/sincronizador/retorna-banco-remoto?token="+token)
					.header("Content-Type", "text/plain")					
					.asBinary();
		
			if (httpReq.getStatus() != 200) {
				System.out.println(httpReq.getStatus());
				System.out.println(" !! problema na requisicao !!");
				return "{\"estado\": \"req-dif-200\"}";					
			}
			
			System.out.println("2) Requisicao processada. Salvando o banco recebido na pasta ./banco");
			
			InputStream bancoStream = httpReq.getBody();
			File banco = new File ("./banco/SADE.sql");			
			FileUtils.copyInputStreamToFile(bancoStream, banco);
			
			System.out.println("3) Trocando o banco de dados pelo recebido");
			// trocando o banco para o novo banco salvo no diretorio ./banco
			if (!this.sincServ.trocarBanco(this.senhaBanco)) {
				throw new Exception();
			}
			
			// Setando todos os pacientes como sincronizados
			System.out.println("4) Setando todos os pacientes (cirurgia e dermato) como sincronizados");
			this.pacCirRepo.setAllSincronizarFalse();
			this.pacDerRepo.setAllSincronizarFalse();
			
			
			
		} catch (Exception e) {
			e.printStackTrace();
			return "{\"estado\": \"problema-enviar-banco\"}";
		}
		
		// Setando todos os pacientes como sincronizados
		// System.out.println("4) Setando todos os pacientes como sincronizados");
		// this.pacCirRepo.setSincronizarFalse();
		// INCLUIR DERMATO
		
		System.out.println(" Atualização realizada com sucesso.");
		System.out.println("###############################################\n");
		
		return "{\"estado\": \"banco-sincronizado\"}";		
		
	}
	
	// Métodos para atualização das imagens no servidor local
	
	/**
	 * Este método busca todas as imagens não sicronizadas do banco local e as envia para o banco remoto.
	 * Caso a imagem tenha sido removida, é enviado apenas um sinal indicando que a mesma deve ser removida do remoto também
	 * @return String com o estado da operação
	 */
	@PostMapping("/api-aberta/sincronizador/atualizar-imagens-remoto")
	@ResponseBody
	public String enviarImagensLocalParaRemoto (@RequestParam(value="token") String token,
			@RequestParam(value="urlServer", required=false) String urlServer) {
		
		// Checando o token
		if (!token.equals(this.tokenSys)) {
			System.out.println("! ! TOKEN INVALIDO ! !");
			System.out.println("Abortando...");
			return "{\"estado\": \"token-invalido\"}";
		}
		System.out.println("## O token e valido! ##");
		
		// Caso a URL seja informada, considerar ela
		if (urlServer == null) {
			urlServer = this.urlServidorRemoto;
		}
		
		// urlServer = "http://localhost:8080";
		String urlApi = urlServer + "/api-aberta/sincronizador/recebe-imagens-local";
		
		try {
			System.out.println("##################################");
			List<ImagemNaoSincronizada> imgsNaoSinc = (List<ImagemNaoSincronizada>) this.imgNaoRepo.findAll();
			
			System.out.println("Sincronizando LOCAL->REMOTO " + imgsNaoSinc.size() + " imagens...");
			
			if (!imgsNaoSinc.isEmpty()) {								
				// Enviando imagens, caso exista
				for (ImagemNaoSincronizada img : imgsNaoSinc) {
					
					// enviando a imagem
					int resp = this.enviarImagem(img.getPathCompleto(), img.getOperacao(), urlApi, token);
					if (resp != 200) {
						System.out.println(resp);
						System.out.println(" !! problema na requisicao !!");
						return "{\"estado\": \"req-dif-200\"}";	
					}
					
					// depois que enviar, retira essa imagem do banco
					this.imgNaoRepo.delete(img);
				}
			}
		
			System.out.println("Envio de imagens finalizado!");
			System.out.println("##################################");
		} catch (Exception e) {
			e.printStackTrace();
			return "{\"estado\": \"problema-enviar-imagem\"}"; 
		}
		
		return "{\"estado\": \"imagens-sincronizadas\"}";
		
	}
	
	/**
	 * Método que atualiza o servidor local com as imagens do remoto
	 * @param urlServer String opcional com a url do servidor remoto
	 * @return String com o estado da operacao
	 */
	@PostMapping("/api-aberta/sincronizador/atualizar-imagens-local")
	@ResponseBody
	public String recebeImagensRemoto (@RequestParam(value="token") String token,
			@RequestParam(value="urlServer", required=false) String urlServer) {

		// Configurando Unirest
		this.configuraUnirest ();
		
		// Caso a URL seja informada, considerar ela
		if (urlServer == null) {
			urlServer = this.urlServidorRemoto;
		}
				
		// urlServer = "http://localhost:8080";
		
		System.out.println("######################################");
		System.out.println("Sincronizando imagens no Local");
		
		
		// Checando o token
		if (!token.equals(this.tokenSys)) {
			System.out.println("! ! TOKEN INVALIDO ! !");
			System.out.println("Abortando...");
			return "{\"estado\": \"token-invalido\"}";
		}
		System.out.println("## O token e valido! ##");		
		
		
		System.out.println("1) Pegando a lista de imagens a serem sincronizadas");		
		
		try {
			HttpResponse<ImagemNaoSincronizada[]> httpReq = Unirest.get(urlServer + "/api-aberta/sincronizador/retorna-lista-imagens-remoto?token="+token)
					.asObject(ImagemNaoSincronizada[].class);
			
			if (httpReq.getStatus() != 200) {
				System.out.println("!! Resposta da requisicao diferente de 200. Cod: " + httpReq.getStatus() + " !!");
				return "{\"estado\": \"resp-req-dif-200\"}";
			}
			
			// Pegando um vetor de imagens nao sincronizadas. Apesar de retornar uma lista,
			// este é um artificio para evitar conversão de json com objectmapper
			ImagemNaoSincronizada[] imgsNao = httpReq.getBody();			
			
			System.out.println("- Total de imagens: " + imgsNao.length);
			
			
			System.out.println("2) Operando nas imagens");	
			// Agora vamos tratar imagem por imagem. Aquelas que possuem operacao de remover, a gente simplesmente apaga. 
			// Já as que precisam adicionar, a gente solicita para o servidor remoto
			String pathCompleto, op;
			File img;
			for (int k=0; k<imgsNao.length; k++) {
				pathCompleto = imgsNao[k].getPathCompleto();
				op = imgsNao[k].getOperacao();
				
				System.out.print("\n# Analisando...\n");
				System.out.print(pathCompleto + "\n");
				System.out.print(op + "\n");
				
				
				if (op.equals("remover")) {
					// Nesse caso temos que remover a imagem					
					img = new File (pathCompleto);
					if (!img.delete()) {
						System.out.println("!! Problema remover imagem !!");
						return "{\"estado\": \"problema-remover-imagem\"}";
					}					
					System.out.println("Removida com sucesso...");
				} else {
					// Nesse caso temos que requisitar a imagem
					
					HttpResponse<InputStream> httpReqImg = Unirest.post(urlServer + "/api-aberta/sincronizador/retorna-imagem-remoto")
							.field("pathCompleto", pathCompleto)
							.field("token", token)
							.asBinary();
					
					if (httpReqImg.getStatus() != 200) {
						System.out.println("!! Resposta da requisicao da imagem diferente de 200. Cod: " + httpReq.getStatus() + " !!");
						return "{\"estado\": \"resp-req-dif-200\"}";
					}
					
					InputStream imgStream = httpReqImg.getBody();
					File imgNao = new File (pathCompleto);			
					FileUtils.copyInputStreamToFile(imgStream, imgNao);
					
					System.out.println("Adicionada com sucesso...");
				}
				
				System.out.print("# # #\n");
			}
			
			// se deu tudo certo, as imagens devem ser removidas do banco do servidor
			HttpResponse<String> httpApagaTudo = Unirest.get(urlServer + "/api-aberta/sincronizador/remove-imagens-nao-sincronizadas-banco?token="+token)
					.asString();
			
			System.out.println("3) Removendo todas as imagens nao sincronizadas no banco do servidor");
			if (httpApagaTudo.getStatus() != 200) {
				System.out.println("!! Resposta da requisicao apaga tudo diferente de 200. Cod: " + httpReq.getStatus() + " !!");
				return "{\"estado\": \"resp-req-dif-200\"}";
			}
			
			System.out.println("4) Removendo todas as imagens nao sincronizadas no banco do local");
			this.imgNaoRepo.deleteAll();
			
			
			
		} catch (Exception e) {
			System.out.println("!! Problema sincronizacao !!");
			e.printStackTrace();
			return "{\"estado\": \"problema-requisicao-lista\"}";
		}
		
		System.out.println("# # # Sincronizacao das imagens realizada com sucesso # # #");
		
		return "{\"estado\": \"imagens-sincronizadas\"}";
		
	}
	
	// ##################################################################################
	// ##################################################################################	
	// ##################################################################################
	
	
	
	// ##################################################################################
	// ################### CODIGO QUE É EXECUTADO NO SERVIDOR REMOTO #####################
	// ##################################################################################
	
	/**
	 * Método que recebe a cópia do banco do servidor local e realiza a troca do banco.
	 * @param arq MultipartFile com o arquivo .sql do banco
	 * @return Caso de algum problema, a requisicao retorna diferente de 200
	 */
	@PostMapping("/api-aberta/sincronizador/recebe-banco-local")
	@ResponseBody
	public void recebeBancoDoServidorLocal (@RequestParam(value="token") String token,
			@RequestParam("arquivo") MultipartFile arq) {
		
		try {
			
			System.out.println("\n### Iniciando atualizacao do banco remoto ###");
			
			// Checando o token
			if (!token.equals(this.tokenSys)) {
				System.out.println("! ! TOKEN INVALIDO ! !");
				System.out.println("Abortando...");
				throw new Exception();
			}
			System.out.println("## O token e valido! ##");
			
			System.out.println("1) Salvando copia do banco recebida do servidor local.");
			// salvando o arquivo recebido do servidor local
			String resp = this.arqServico.salvarArquivo(arq.getBytes(), "./banco/SADE.sql");
			if (!resp.equals("{\"estado\": \"arquivo-salvo\"}")) {
				throw new Exception();
			}
			
			System.out.println("2) Realizando a troca do banco no servidor remoto.");
			// trocando o banco para o novo banco salvo no diretorio ./banco
			if (!this.sincServ.trocarBanco(this.senhaBanco)) {
				throw new Exception();
			}
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		System.out.println(" Atualização realizada com sucesso.");
		System.out.println("###############################################\n");
	}
	
		
	@GetMapping(value = "/api-aberta/sincronizador/retorna-banco-remoto", produces = MediaType.TEXT_PLAIN_VALUE)
	@ResponseBody
	public ResponseEntity<InputStreamResource> retornaBancoRemoto (@RequestParam(value="token") String token) {
		
		System.out.println("\n### Iniciando atualizacao do banco local ###");
		System.out.println("1) Gerando uma copia do banco no servidor remoto.");
		
		// Checando o token
		if (!token.equals(this.tokenSys)) {
			System.out.println("! ! TOKEN INVALIDO ! !");
			System.out.println("Abortando...");
			return null;
		}
		System.out.println("## O token e valido! ##");
		
		// Gerando a cópia do banco local
		if (!this.sincServ.gerarCopiaBanco(this.senhaBanco)) {
			System.out.println("!! Problema ao gerar copia do banco !!.");
			try {
				throw new Exception();
			} catch (Exception e) {
				e.printStackTrace();
				return null;
			}
		}		
		
		System.out.println("2) Enviando uma copia do banco para servidor local.");		
		try {
			File banco = new File ("./banco/SADE.sql");
			InputStream bancoStream = new FileInputStream(banco);
			
			return ResponseEntity
	                .ok()
	                .contentType(MediaType.TEXT_PLAIN)
	                .body(new InputStreamResource(bancoStream));	
			
		} catch (Exception e) {
			System.out.println("!! Problema ao pegar o arguivo do banco !!");
			return null;
		}
	}
	

	/**
	 * Este método recebe do servidor local todas as imagens que foram adicionadas nele.
	 * @param img MultipartFile com a imagem a ser adicionada. Nesse caso, pode não ser enviada. Caso isso ocorra, significa que o pathCompleto
	 * indicado deve ser removido
	 * @param pathCompleto String com o caminho completo da imagem
	 */
	@PostMapping ("/api-aberta/sincronizador/recebe-imagens-local")
	@ResponseBody
	public void recebeImagensDoLocal (@RequestParam(value="token") String token,
			@RequestParam(value="imagem", required=false) MultipartFile img,
			@RequestParam("pathCompleto") String pathCompleto) {
		
		System.out.println("## Recebendo imagens do banco local ##");
		
		// Checando o token
		if (!token.equals(this.tokenSys)) {
			System.out.println("! ! TOKEN INVALIDO ! !");
			System.out.println("Abortando...");			
		} else {
			System.out.println("## O token e valido! ##");
				
			try {
			
				if (img == null){
					System.out.println("\n## Removendo " + pathCompleto + "...");
				
					// nesse caso, temos que remover a imagem
					this.imgServico.removerImagem(pathCompleto);
				} else {
					System.out.println("\n## Adicionando " + pathCompleto);
				
					// aqui, temos que adicionar
					this.imgServico.salvarImagem(img.getBytes(), pathCompleto + "...");
				}
			
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		
	}
	
	/**
	 * Método que envia a lista de imagens a serem sincronizadas do servidor remoto para o local
	 * @return List com as imagens a serem sincronizadas
	 */
	@GetMapping("/api-aberta/sincronizador/retorna-lista-imagens-remoto")
	@ResponseBody
	public List<ImagemNaoSincronizada> retornaListaImagensRemoto (@RequestParam(value="token") String token) {
		
		// Configurando Unirest
		this.configuraUnirest ();
		System.out.println("# # # Enviando a lista das imagens nao sincronizadas para o servidor local # # #");
		
		// Checando o token
		if (!token.equals(this.tokenSys)) {
			System.out.println("! ! TOKEN INVALIDO ! !");
			System.out.println("Abortando...");
			return null;
		}
		System.out.println("## O token e valido! ##");
		
		try {			
			return (List<ImagemNaoSincronizada>) this.imgNaoRepo.findAll();
		} catch (Exception e) {
			System.out.println("! ! Problema ao enviar a lista de imagens ! !");
			e.printStackTrace();
			return null;
		}
		
	}
	
	/**
	 * Método que retorna uma dada imagem do servidor remoto para o local
	 * @param pathCompleto String com o path completo da imagem
	 * @return void
	 */
	@PostMapping("/api-aberta/sincronizador/retorna-imagem-remoto")
	@ResponseBody
	public ResponseEntity<InputStreamResource> retornaImagensRemotoParaLocal(@RequestParam(value="token") String token,
			@RequestParam("pathCompleto") String pathCompleto) {		
		
		System.out.println("# # # Enviando " + pathCompleto + " para o servidor local  # # #");
		
		// Checando o token
		if (!token.equals(this.tokenSys)) {
			System.out.println("! ! TOKEN INVALIDO ! !");
			System.out.println("Abortando...");
			return null;
		}
		System.out.println("## O token e valido! ##");
		
		try {			
			InputStream img = this.imgServico.pegarImagem(pathCompleto, 0, 0);			
			return ResponseEntity
	                .ok()
	                .contentType(MediaType.TEXT_PLAIN)
	                .body(new InputStreamResource(img));	
			
		} catch (Exception e) {
			System.out.println("! ! problema no envio do " + pathCompleto + " ! !");
			return null;
		}
		
	}
	
	@GetMapping ("/api-aberta/sincronizador/remove-imagens-nao-sincronizadas-banco")
	@ResponseBody
	public void removeImgsNaoSincDoBanco (@RequestParam(value="token") String token) {
		
		System.out.println("# # # Removendo todas as imagens não sincronizadas banco # # #");
		
		// Checando o token
		if (!token.equals(this.tokenSys)) {
			System.out.println("! ! TOKEN INVALIDO ! !");
			System.out.println("Abortando...");		
		} else {
			System.out.println("## O token e valido! ##");
			
			
			try {			
				this.imgNaoRepo.deleteAll();
				
			} catch (Exception e) {
				System.out.println("! ! Problema na remoção ! !");
				e.printStackTrace();
			}
		}
	}
	
	// ##################################################################################
	// ##################################################################################
	// ##################################################################################
	
	/**
	 * Método auxiliar para enviar uma imagem ou um sinal para apagar ela
	 */
	private int enviarImagem (String pathCompleto, String op, String urlApi, String token) {
		// Configurando Unirest
		this.configuraUnirest ();
		
		try {
			
			HttpResponse<JsonNode> httpReq;

			if (op.equals("remover")) {
				
				System.out.println("Removendo: " + pathCompleto);

				httpReq = Unirest.post(urlApi)
						.header("accept", "application/json")
						.field("pathCompleto", pathCompleto)	
						.field("token", token)
						.asJson();
				
			} else {
				
				System.out.println("Adicionando: " + pathCompleto);
				
				httpReq = Unirest.post(urlApi)
						.header("accept", "application/json")
						.field("pathCompleto", pathCompleto)
						.field("imagem", new File(pathCompleto))
						.asJson();				
			}
						
			return httpReq.getStatus();
			
			
		} catch (Exception e) {
			e.printStackTrace();
			return -1;
		}
	}
	
}
