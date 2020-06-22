package br.labcin.sade.servico;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import org.springframework.stereotype.Service;

@Service
public class SincronizarServico {

	/**
	 * Essa função gera uma cópia de todo o banco de dados do sistema
	 * e a salva no caminho ./banco/SADE.sql
	 * @return Boolean informando se deu tudo certo
	 */
	public boolean gerarCopiaBanco (String senha) {	
		// criando o comando de gerar a copia do banco autal
		ProcessBuilder processBuilder = new ProcessBuilder();		
		String cmd = "mysqldump --add-drop-table -u root -p"+ senha +" SADE > ./banco/SADE.sql";		
		// System.out.println("\n\n" + cmd + "\n\n");		
		processBuilder.command("bash", "-c", cmd); 	
	
		try {

			// executando o comando
			Process process = processBuilder.start();
			StringBuilder output = new StringBuilder();
			BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
	
			// salvando a resposta do comando
			String line;
			while ((line = reader.readLine()) != null) {
				output.append(line + "\n");
			}
	
			int exitVal = process.waitFor();
			if (exitVal == 0) {
				System.out.println("\n### Cópia do banco realizada com sucesso! ####\n");
				System.out.println(output);
				return true;
			}

		} catch (IOException e) {
			e.printStackTrace();
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		
		return false;	
	}
	
	/**
	 * Este método pega o banco que está no caminho ./banco/SADE.sql
	 * e faz um replace com o banco atual. Logo, CUIDADO! Isso vai trocar todos os dados atuais
	 * pelo o dado que está no diretório!
	 * @return 
	 */
	public boolean trocarBanco (String senha) {
		
		// carregando o banco do diretorio./banco para o MySQL e na sequência removendo a copia do banco
		ProcessBuilder processBuilder = new ProcessBuilder();
		String cmd = "mysql -u root -p"+ senha +" SADE < ./banco/SADE.sql ; rm -rf ./banco/SADE.sql";
		// System.out.println("\n\n" + cmd + "\n\n");
		processBuilder.command("bash", "-c", cmd); 	
	
		try {

			// executando o comando
			Process process = processBuilder.start();
			StringBuilder output = new StringBuilder();
			BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
	
			// salvando a resposta do comando
			String line;
			while ((line = reader.readLine()) != null) {
				output.append(line + "\n");
			}
	
			int exitVal = process.waitFor();
			if (exitVal == 0) {
				System.out.println("\n### Troca do banco realizada com sucesso ####\n");
				System.out.println(output);
				return true;
			}

		} catch (IOException e) {
			e.printStackTrace();
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		
		return false;
		
	}
		
	
}
