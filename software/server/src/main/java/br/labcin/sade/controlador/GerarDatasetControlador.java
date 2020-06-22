package br.labcin.sade.controlador;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import br.labcin.sade.modelo.PacienteCirurgia;
import br.labcin.sade.modelo.PacienteDermato;
import br.labcin.sade.repositorio.PacienteCirurgiaRepositorio;
import br.labcin.sade.repositorio.PacienteDermatoRepositorio;
import br.labcin.sade.servico.GerarDatasetServico;

// Test
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import java.io.*;

@Controller
public class GerarDatasetControlador {

    @Autowired
    private GerarDatasetServico dataService;

    @Autowired
    private PacienteCirurgiaRepositorio pacCirurgiaRepo;

    @Autowired
    private PacienteDermatoRepositorio pacDermatoRepo;

    @GetMapping("/api/deletaDataset")
    public String removedorDataset(
        @RequestParam("pacTipo") String pacTipo
    ) {
    	File file = null;
    	System.out.println("Opaaa --- Deletando as paradas!!!!");
        if( pacTipo.equals("cirurgia") ) {
            file = new File("imagens/imagens_cirurgia/datasetCirurgia.csv");
            if(file.delete()) 
            { 
                System.out.println("File deleted successfully"); 
            } 
            else
            { 
                System.out.println("Failed to delete the file"); 
            }
        } else {
            file = new File("imagens/imagens_cirurgia/datasetDermato.csv");
            file.delete();
        }

        file = new File("imagens_" + pacTipo + ".zip");
        if(file.delete()) 
        { 
            System.out.println("File deleted successfully"); 
        } 
        else
        { 
            System.out.println("Failed to delete the file"); 
        }
        return "{\"estado\": \"arquivos deletados\"}";
    }
    
    /* @GetMapping("/api/geraDataset")
    public void geradorDataset(
    	@RequestParam("pacTipo") String pacTipo,
    	@RequestParam("dados") String dados,
        HttpServletResponse response
    ) throws IOException {
    	String[] dadosReq = dados.split(",");
        dados = dados.replace(',', ';');
    	if( pacTipo.equals("cirurgia") ) {
            List<PacienteCirurgia> pacCompleto = (List<PacienteCirurgia>) this.pacCirurgiaRepo.findAll();
            this.dataService.geraDatasetCirurgia(pacCompleto, dadosReq, dados);
        } else {
            List<PacienteDermato> pacCompleto = (List<PacienteDermato>) this.pacDermatoRepo.findAll();
            this.dataService.geraDatasetDermato(pacCompleto, dadosReq, dados);
        }

        File directoryToZip = new File("imagens/imagens_" + pacTipo);
        List<File> fileList = new ArrayList<File>();
        System.out.println("---Getting references to all files in: " + directoryToZip.getCanonicalPath());
        this.dataService.getAllFiles(directoryToZip, fileList, dadosReq[dadosReq.length - 1], pacTipo);
        System.out.println("---Creating zip file");
        this.dataService.writeZipFile(directoryToZip, fileList);
        System.out.println("---Done zipping");
    	
        response.addHeader("Content-disposition", "attachment;filename=dataset_" + pacTipo + ".zip");
        response.setContentType("application/zip");
        
        try {
            File f = new File("imagens_" + pacTipo + ".zip");
            byte[] arBytes = new byte[(int) FileUtils.sizeOf(f)];
            response.setContentLength((int)f.length());
            FileInputStream is = new FileInputStream(f);
            is.read(arBytes);
            ServletOutputStream op = response.getOutputStream();
            op.write(arBytes);
            op.flush();
      
       } catch(IOException ioe) {
           ioe.printStackTrace();
       }
    } */

    @GetMapping(
        value = "/api/zip",
        produces="application/zip"
    )
    public @ResponseBody FileSystemResource getFile(
        @RequestParam("pacTipo") String pacTipo,
        @RequestParam("dados") String dados,
        HttpServletResponse response
    ) throws IOException {
        //setting headers
        response.setContentType("application/zip");
        response.setStatus(HttpServletResponse.SC_OK);
        response.addHeader("Content-Disposition", "attachment; filename=\"test.zip\"");

        //creating byteArray stream, make it bufforable and passing this buffor to ZipOutputStream
        /*ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        BufferedOutputStream bufferedOutputStream = new BufferedOutputStream(byteArrayOutputStream);
        ZipOutputStream zipOutputStream = new ZipOutputStream(bufferedOutputStream);*/

        String[] dadosReq = dados.split(",");
        dados = dados.replace(',', ';');
    	if( pacTipo.equals("cirurgia") ) {
            List<PacienteCirurgia> pacCompleto = (List<PacienteCirurgia>) this.pacCirurgiaRepo.findAll();
            this.dataService.geraDatasetCirurgia(pacCompleto, dadosReq, dados);
        } else {
            List<PacienteDermato> pacCompleto = (List<PacienteDermato>) this.pacDermatoRepo.findAll();
            this.dataService.geraDatasetDermato(pacCompleto, dadosReq, dados);
        }

        File directoryToZip = new File("imagens/imagens_" + pacTipo);
        List<File> fileList = new ArrayList<File>();
        System.out.println("---Getting references to all files in: " + directoryToZip.getCanonicalPath());
        this.dataService.getAllFiles(directoryToZip, fileList, dadosReq[dadosReq.length - 1], pacTipo);
        System.out.println("---Creating zip file");
        /* this.dataService.writeZipFile(directoryToZip, fileList); */
        zipAqui(pacTipo, fileList);

        //packing files
        /*for (File file : fileList) {
            //new zip entry and copying inputstream with file to zipOutputStream, after all closing streams
            zipOutputStream.putNextEntry(new ZipEntry(file.getName()));
            FileInputStream fileInputStream = new FileInputStream(file);
            System.out.println("Writing '" + file.getName() + "' to zip file");

            IOUtils.copy(fileInputStream, zipOutputStream);

            fileInputStream.close();
            zipOutputStream.closeEntry();
        }
        System.out.println("---Done zipping");

        if (zipOutputStream != null) {
            zipOutputStream.finish();
            zipOutputStream.flush();
            IOUtils.closeQuietly(zipOutputStream);
        }
        IOUtils.closeQuietly(bufferedOutputStream);
        IOUtils.closeQuietly(byteArrayOutputStream);
        return byteArrayOutputStream.toByteArray();*/
        File file = new File("imagens_" + pacTipo + ".zip");
        //return IOUtils.toByteArray(new FileInputStream(file));
        return new FileSystemResource(file);
    }
    
    public void zipAqui(String pacTipo, List<File> fileList) {
    	int BUFR = 2048;
    	try {
    		BufferedInputStream origin = null;
    		FileOutputStream destin = new FileOutputStream("imagens_" + pacTipo + ".zip");
    		ZipOutputStream output = new ZipOutputStream(new BufferedOutputStream(destin)); //output.setMethod(ZipOutputStream.DEFLATED);
    		byte data[] = new byte[BUFR]; // getting a list of files from the current directory
    		//File fil = new File(".");
    		//String file[] = fil.list();
    		for (File file : fileList) {
    			System.out.println("Adding: "+ file.getName());
    			FileInputStream fi = new FileInputStream(file);
    			origin = new BufferedInputStream(fi, BUFR);
    			ZipEntry enter = new ZipEntry(file.getName());
    			output.putNextEntry(enter);
    			int counter;
    			while((counter = origin.read(data, 0, BUFR)) != -1) {
    				output.write(data, 0, counter);
    			}
    			origin.close();
    		}
    		output.close();
    	} catch(Exception exp) {
    		exp.printStackTrace();
    	}
    }
    
    private final Logger logger = LoggerFactory.getLogger(GerarDatasetControlador.class);

    @GetMapping (value = "/api/download", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StreamingResponseBody> download(final HttpServletResponse response) {
        response.setContentType("application/zip");
        response.setHeader(
                "Content-Disposition",
                "attachment;filename=sample.zip");

        StreamingResponseBody stream = out -> {

            //final String home = System.getProperty("user.home");
            final File directory = new File("imagens/imagens_cirurgia");
            final ZipOutputStream zipOut = new ZipOutputStream(response.getOutputStream());

            if(directory.exists() && directory.isDirectory()) {
                try {
                    for (final File file : directory.listFiles()) {
                        final InputStream inputStream=new FileInputStream(file);
                        final ZipEntry zipEntry=new ZipEntry(file.getName());
                        zipOut.putNextEntry(zipEntry);
                        byte[] bytes=new byte[2048];
                        int length;
                        while ((length=inputStream.read(bytes)) >= 0) {
                            zipOut.write(bytes, 0, length);
                        }
                        inputStream.close();
                    }
                    zipOut.close();
                } catch (final IOException e) {
                    logger.error("Exception while reading and streaming data {} ", e);
                }
            }
        };
        logger.info("steaming response {} ", stream);
        return new ResponseEntity<StreamingResponseBody>(stream, HttpStatus.OK);
    }
}