export default class Utils {

    /**
     * @author André Pacheco
     * Função auxiliar para converter um data de string no formato brasileiro para o formato
     * padrão que o Spring Boot aceita, ou seja, de dd-mm-aaaa para aaaa-mm-dd
     * @param dataStr String com formato dd-mm-aaaa
     */
    public static converterStrDate (dataStr: string): string {
        if (dataStr === '') {
            return undefined;
        }
        const stringSep = dataStr.split('/', 3);
        return stringSep[2] + '-' + stringSep[1] + '-' + stringSep[0];
      }

    /**
     * @author André Pacheco
     * Função auxiliar para parsear os dados do formulario de filtros. ALguns deles, quando não preenchidos,
     * retornam uma string vazia. Essa unção converte para undefined. Além disso, switchers não preenchidos,
     * ao invés de retornar '', retornam false;
     * @param dado Dado a ser convertido
     * @param isBool Se o dado for booleano, outra ação é tomada
     */
    public static parseFiltros (dado: string, isBool: boolean): any {
        if (isBool) {
            if (dado.toString() === '' || dado.toString() === 'false') {
            return false;
            } else {
            return true;
            }
        } else {
            if (dado === '') {
            return undefined;
            } else {
            return dado;
            }
        }
    }

    /**
     * Método para trocar o nome da imagem, colocando o cartão do sus
     * e timestamp
     * @author André Pacheco
     * @param imagens As images vinda do upload
     * @param cartaoSus String com o cartao do sus
     */
    public static nomeiaImagens (imagens: any, cartaoSus: string): any {

        for (const img of imagens) {
            img.name = cartaoSus + new Date();
        }

        return imagens;
    }

    /**
     * Método para calcular a idade de uma pessoa
     * @param dataNascStr string com a data de nascimento
     * @author André Pacheco
     */
    public static calculaIdade (dataNascStr: string): number {
        const dataNasc = new Date (dataNascStr);
        const difTempo = Math.abs(Date.now() - dataNasc.getTime());
        const idade = Math.floor((difTempo / (1000 * 3600 * 24)) / 365.25);
        return idade;
    }

    /**
     * Método que parseia uma data do formato americano para brasileiro
     * @param dataStr data a ser parseada
     * @author André Pacheco
     */
    public static dataParaBr (dataStr: string): string {
        const stringSep = dataStr.split('-', 3);
        return stringSep[2] + '/' + stringSep[1] + '/' + stringSep[0];
    }

    /**
     * Método para converter uma string base64 para blob
     * @param b64Data
     * @param contentType
     * @param sliceSize
     */
    public static base642Blob (b64Data: any, contentType = 'image/png', sliceSize = 512) {
        const byteCharacters = atob(b64Data.split(',')[1]);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

                const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, {type: contentType});
        return blob;
    }

}
