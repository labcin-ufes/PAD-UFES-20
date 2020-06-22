package br.labcin.sade.servico;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.springframework.stereotype.Service;

import br.labcin.sade.modelo.PacienteCirurgia;
import br.labcin.sade.modelo.PacienteDermato;

@Service
public class GerarDatasetServico {

    public void geraDatasetCirurgia(List<PacienteCirurgia> pacCompleto, String[] dadosReq, String header) {
        //String[] dadosReq = {"id","cartaoSus","nomeCompleto"};
        /* for( PacienteCirurgia p : pacCompleto ) {
            System.out.println(p.datasetLinha(dadosReq));
        } */

        try {
            PrintWriter pw = new PrintWriter(new File("imagens/imagens_cirurgia/dataset_cirurgia.csv"));
            StringBuilder sb = new StringBuilder();

            //String header = "id,cartaoSus,nomeCompleto,path\n";
            sb.append(header+"\n");

            for( PacienteCirurgia p : pacCompleto ) {
                String linha = p.datasetLinha(dadosReq);
                sb.append(linha.replace(',', '-'));
            }

            pw.write(sb.toString());
            pw.close();

            /* File datasetFile = new File("./datasetCirurgia.csv");
            InputStream datasetStream = FileUtils.openInputStream(datasetFile);
            return datasetStream; */
        } catch (Exception e) {
			e.printStackTrace();
			//return null;
		}
    }

    public void geraDatasetDermato(List<PacienteDermato> pacCompleto, String[] dadosReq, String header) {
        //String[] dadosReq = {"id","cartaoSus"};
        /* for( PacienteDermato p : pacCompleto ) {
            System.out.println(p.datasetLinha(dadosReq));
        } */

        try {
            PrintWriter pw = new PrintWriter(new File("imagens/imagens_dermato/dataset_dermato.csv"));
            StringBuilder sb = new StringBuilder();

            //String header = "id,cartaoSus,nomeCompleto,path\n";
            sb.append(header+"\n");

            for( PacienteDermato p : pacCompleto ) {
				String linha = p.datasetLinha(dadosReq);
                sb.append(linha.replace(',', '-'));
            }

            pw.write(sb.toString());
            pw.close();

            /* File datasetFile = new File("./datasetDermato.csv");
            InputStream datasetStream = FileUtils.openInputStream(datasetFile);
            return datasetStream; */
        } catch (Exception e) {
			e.printStackTrace();
			//return null;
		}
    }

    public void getAllFiles(File dir, List<File> fileList, String lastDado, String pacTipo) {
		try {
			File[] files = dir.listFiles();
			for (File file : files) {
				if (!lastDado.equals("path")) {
					if (file.getCanonicalPath().equals(new File("imagens/imagens_"+pacTipo+"/dataset_"+pacTipo+".csv").getCanonicalPath())) {
						fileList.add(file);
						System.out.println("     file:" + file.getCanonicalPath());
					}
				} else {
					fileList.add(file);
					System.out.println("     file:" + file.getCanonicalPath());
				}
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public void writeZipFile(File directoryToZip, List<File> fileList) {
		try {
			FileOutputStream fos = new FileOutputStream(directoryToZip.getName() + ".zip");
			ZipOutputStream zos = new ZipOutputStream(fos);

			for (File file : fileList) {
				if (!file.isDirectory()) { // we only zip files, not directories
					addToZip(directoryToZip, file, zos);
				}
			}

			zos.close();
			fos.close();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public void addToZip(File directoryToZip, File file, ZipOutputStream zos) throws FileNotFoundException, IOException {
		FileInputStream fis = new FileInputStream(file);

		// we want the zipEntry's path to be a relative path that is relative
		// to the directory being zipped, so chop off the rest of the path
		String zipFilePath = file.getCanonicalPath().substring(directoryToZip.getCanonicalPath().length() + 1,
				file.getCanonicalPath().length());
		System.out.println("Writing '" + zipFilePath + "' to zip file");
		ZipEntry zipEntry = new ZipEntry(zipFilePath);
		zos.putNextEntry(zipEntry);

		byte[] bytes = new byte[1024];
		int length;
		while ((length = fis.read(bytes)) >= 0) {
			zos.write(bytes, 0, length);
		}

		zos.closeEntry();
		fis.close();
	}
}