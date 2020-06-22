package br.labcin.sade.servico;

import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Base64;

import javax.imageio.ImageIO;

import org.apache.commons.io.FileUtils;
import org.springframework.stereotype.Service;

@Service
public class ImagemServico {

	/**
	 * Apenas um método para salvar uma imagem recebendo um conjunto de bytes
	 * e path da mesma
	 * @author André Pacheco
	 * @param imgBytes Um array de bytes que representa a imagem
	 * @param path Uma string com o path da imagem
	 * @return Boolean indicando se deu tudo certo
	 */
	public boolean salvarImagem (byte[] imgBytes, String path) {
		try {
			// criando arquivo de saída
			File arqSaida = new File(path);
			
			// carrendo o inputstream
			InputStream isImg = new ByteArrayInputStream(imgBytes);
			BufferedImage image = ImageIO.read(isImg);
			
			// convertendo e salvando no disco
			OutputStream osImg = new FileOutputStream(arqSaida);
			ImageIO.write(image, "png", osImg);			
			
			//FileUtils.writeByteArrayToFile(pathImg, imgBytes);		
			return true;
			
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}				
	}
	
	/**
	 * Método que recebe uma imagem em base64, a converte para bytes e chama 
	 * salvarImagem para salvá-la no banco de dados em png
	 * @param imgBase64 String com a imagem em Base64
	 * @param path Caminho da imagem
	 * @return Retorna true se tudo der certo e false caso contrário
	 */
	public boolean salvarImagemBase64 (String imgBase64, String path) {		
		try {
			byte[] imgBytes = Base64.getMimeDecoder().decode(imgBase64.split(",")[1]);
			return this.salvarImagem(imgBytes, path);
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
	/**
	 * Método que pega uma imagem no servidor de acordo com o caminho dela e, se 
	 * solicitado, redimensiona a imagem e retorna para o front
	 * @author André Pacheco
	 * @param path Caminho da imagem
	 * @param largura Largura da imagem
	 * @param altura Altura da imagem
	 * @return retorna a imagem do servidor, redimensionada ou nao
	 */
	public InputStream pegarImagem (String path, int largura, int altura) {
		
		try {
			File imgFile = new File (path);
			InputStream imgStream = FileUtils.openInputStream(imgFile);
			
			// nesse caso, nao devemos redimensionar
			if (largura <= 10 || altura <= 10) {
				return imgStream;
			} else {
				System.out.println("Redimensionando a imagem...");
				return redimensionaImagem(imgFile, largura, altura);
			}
		} catch (FileNotFoundException e) {
			System.out.println("A imagem " + path + " não foi encontrada no servidor. Verifique se a mesma existe!");
			return null;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
	
	/**
	 * Método para pegar a imagem do servidor e retronar a mesma em base64
	 * @param path String com o caminho da imagem
	 * @return Uma string em base64
	 */
	public String pegarImagemEmBase64 (String path) {
		
		try {
			System.out.println("Gerando imagem em base64");
			File imgFile = new File (path);
			byte[] imgBytes = FileUtils.readFileToByteArray(imgFile);
			
			return "data:image/png;base64," + Base64.getEncoder().encodeToString(imgBytes);
			
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
	
	/**
	 * Método para redimensionar a imagem
	 * @author André Pacheco
	 * @param imgFile a imagem a ser redimensionada
	 * @param largura a nova largura
	 * @param altura a nova altura
	 * @return um inputStream com a imagem redimensionada
	 */
	private InputStream redimensionaImagem (File imgFile, int largura, int altura) {
		
		try {
			
			BufferedImage imgOriginal = ImageIO.read(imgFile);
			int tipo = imgOriginal.getType() == 0? BufferedImage.TYPE_INT_ARGB : imgOriginal.getType();
			BufferedImage imgRedimen = new BufferedImage(largura, altura, tipo);
			Graphics2D g = imgRedimen.createGraphics();
			g.drawImage(imgOriginal, 0, 0, largura, altura, null);
			g.dispose();
			
			ByteArrayOutputStream outStream = new ByteArrayOutputStream();
			ImageIO.write(imgRedimen, "png", outStream); 
			InputStream novaImgStream = new ByteArrayInputStream(outStream.toByteArray());
			
			return novaImgStream;
			
			
			/*
			// Convertendo a imagem para redimensionar
			BufferedImage image = ImageIO.read(imgStream);
			Image rediImg = image.getScaledInstance(largura, altura, java.awt.Image.SCALE_SMOOTH);
			image = new BufferedImage(rediImg.getWidth(null), rediImg.getHeight(null), BufferedImage.TYPE_INT_RGB);
			
			// Convertendo para BufferedImage
			//BufferedImage bufRediImg = new BufferedImage(rediImg.getWidth(null), rediImg.getHeight(null), BufferedImage.TYPE_INT_ARGB);		
						
			// Reconvertendo para um input stream
			ByteArrayOutputStream outStream = new ByteArrayOutputStream();
			ImageIO.write(image, "jpg", outStream); 
			InputStream novaImgStream = new ByteArrayInputStream(outStream.toByteArray());
			
			return novaImgStream;
			*/
			
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}		
	}

	/**
	 * Método para remover uma imagem
	 * @param imgFile Imagem a ser removida
	 * @return Retorna true se tudo der certo e false caso contrario
	 */
	public boolean removerImagem (String path) {
		
		System.out.println("Apagando imagem do servidor: " + path);
		
		try {
			File imgFile = new File (path);
			imgFile.delete();
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}
}







