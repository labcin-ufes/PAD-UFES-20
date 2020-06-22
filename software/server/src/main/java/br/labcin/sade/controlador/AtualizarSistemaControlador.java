package br.labcin.sade.controlador;

import java.util.Timer;
import java.util.TimerTask;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import br.labcin.sade.servico.ArquivoServico;

@Controller
public class AtualizarSistemaControlador {

	@Autowired
	ArquivoServico arqServico;
	
	// Pegando o token para validar a operacao
	@Value("${token.api}")
	private String tokenSys;
	
	/**
	 * Método para salvar um arquivo através do endpoint dado
	 * @param arq Multpartfile com o arquivo a ser salvo
	 * @param path String com o path do arquivo
	 * @return String com a resposta do estado do arquivo
	 */
	@PostMapping("/api-aberta/atualizar-sistema")
	@ResponseBody
	public String arquivoUpload (@RequestParam("arquivo") MultipartFile arq,
			@RequestParam(value="token") String token,
			@RequestParam(value="path", required=false) String path){
		
		System.out.println("## Recebendo atualizacao do sistema ##");
		String arqPath = "./sade.jar";
		
		if (path != null) {
			arqPath = path + "/sade.jar";
		}	
	
		// Checando o token
		if (!token.equals(this.tokenSys)) {
			System.out.println("! ! TOKEN INVALIDO ! !");
			System.out.println("Abortando...");
			return "{\"estado\": \"token-invalido\"}";
		}
		
		System.out.println("## O token e valido! ##");
		
		try {
			
			String resp = arqServico.salvarArquivo(arq.getBytes(), arqPath);	
			
			System.out.println("## Atualizacao recebinda com sucesso. O sistema sera reiniciado em 5s ##");
		
			// Colocando um timer para desligar o sistema e o script ligar novamente
			new Timer().schedule(new TimerTask() {                
                @Override
                public void run() {
                    System.exit(1);
                }
            }, 5000);
			
			return resp;
		} catch (Exception e) {
			return "{\"estado\": \"problema-leitura-arquivo\"}";
		}
		
	}
}

