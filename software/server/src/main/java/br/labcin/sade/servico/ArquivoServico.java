package br.labcin.sade.servico;

import java.io.File;

import org.apache.commons.io.FileUtils;
import org.springframework.stereotype.Service;

@Service
public class ArquivoServico {

	/**
	 * Apenas um método para salvar um arquivo qualquer
	 * @author André Pacheco
	 * @param arqBytes Um array de bytes que representa o arquivo
	 * @param path Uma string com o path do arquivo
	 * @return String Retorna um json indicando se deu tudo certo
	 */
	public String salvarArquivo (byte[] arqBytes, String path) {
		try {
			
			File arq = new File(path);
			FileUtils.writeByteArrayToFile(arq, arqBytes);
					
			return "{\"estado\": \"arquivo-salvo\"}";
		} catch (Exception e) {
			e.printStackTrace();
			return "{\"estado\": \"problema-salvar-arquivo\"}";
		}				
	}
}
