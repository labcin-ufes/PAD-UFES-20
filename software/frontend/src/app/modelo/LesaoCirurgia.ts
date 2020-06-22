import Imagem from './Imagem';

export default class LesaoCirurgia {

    // Dados gerais da lesão do paciente
    private id: number;
    private diagnosticoClinico: string;
    private diagnosticoClinicoSecundario: string;
    private procedimento: string;
    private cirurgiao: string;
    private obs: string;
    private diametroMaior: number;
    private diametroMenor: number;
    private imagens: Array<Imagem>;
    private dataProcedimento: Date;
    private localProcedimento: string;
    private regiao: string;
    private grandeRegiao: string;

    private pacienteId: string;

    // Dados para completar quando tiver o histopatologico
    private diagnosticoHisto: string;
    private subtipoHisto: string;
    private clark: string;
    private breslow: number;
    private indiceMiotico: number;
    private tipoTumor: string;
    private tamanhoTumorDimMaior: number;
    private tamanhoTumorDimMenor: number;
    private crescimentoRadial: string;
    private crescimentoVertical: string;
    private ulceracao: string;
    private lesaoSatelite: string;
    private evidenciaRegressao: string;
    private associacaoNevoMelanocito: string;
    private margemCirurgiaProfunda: string;
    private margemCirurgiaLateral: string;
    private margemLateralLivre: string; // infs extra para margem lateral livre
    private margemProfundaLivre: string; // infs extra para margem profunda livre
    private invasaoVascular: string;
    private menorDistMargemRessecaoLateral: string;
    private limiteRessecao: string;
    private infiltracaoPerineural: string;
    private infiltracaoAngiolinfatica: string;
    private infiltradoLinfocito: string;
    private auditado: boolean;


    constructor (dados?: any) {

        // Toda lesao adicionana precisa ser auditada
        this.auditado = false;

        if (dados !== undefined) {

            // o id só é preenchido qnd o paciente é retornado do banco
            this.id = dados.id;
            this.diagnosticoClinico = dados.diagnosticoClinico.toUpperCase();
            this.diagnosticoClinicoSecundario = dados.diagnosticoClinicoSecundario.toUpperCase();
            this.procedimento = dados.procedimento.toUpperCase();
            this.cirurgiao = dados.cirurgiao.toUpperCase();

            this.auditado = dados.auditado;

            if (dados.obs !== undefined && dados.obs !== null) {
                this.obs = dados.obs.toUpperCase();
            } else {
                this.obs = "NENHUMA";
            }

            this.localProcedimento = dados.localProcedimento.toUpperCase();
            this.regiao = dados.regiao.toUpperCase();

            if (dados.grandeRegiao !== undefined && dados.grandeRegiao !== null) {
                this.grandeRegiao = dados.grandeRegiao.toUpperCase();
            }

            this.diametroMaior = dados.diametroMaior;
            this.diametroMenor = dados.diametroMenor;
            this.dataProcedimento = dados.dataProcedimento;

            // A imagem pode ser vazia
            dados.imagens !== undefined ?
                this.imagens = dados.imagens
                : this.imagens = new Array<Imagem>();

            // Dados para completar quando tiver o histopatologico

            if (dados.diagnosticoHisto !== undefined && dados.diagnosticoHisto !== null) {
                this.diagnosticoHisto = dados.diagnosticoHisto.toUpperCase();
            }

            if (dados.subtipoHisto !== undefined && dados.subtipoHisto !== null) {
                this.subtipoHisto = dados.subtipoHisto.toUpperCase();
            }


            if (dados.clark !== undefined && dados.clark !== null) {
                this.clark = dados.clark.toUpperCase();
            }

            this.breslow = dados.breslow;

            this.indiceMiotico = dados.indiceMiotico;

            if (dados.tipoTumor !== undefined && dados.tipoTumor !== null) {
                this.tipoTumor = dados.tipoTumor.toUpperCase();
            }

            this.tamanhoTumorDimMaior = dados.tamanhoTumorDimMaior;

            this.tamanhoTumorDimMenor = dados.tamanhoTumorDimMenor;

            if (dados.crescimentoRadial !== undefined && dados.crescimentoRadial !== null) {
                this.crescimentoRadial = dados.crescimentoRadial.toUpperCase();
            }

            if (dados.crescimentoVertical !== undefined && dados.crescimentoVertical !== null) {
                this.crescimentoVertical = dados.crescimentoVertical.toUpperCase();
            }

            if (dados.ulceracao !== undefined && dados.ulceracao !== null) {
                this.ulceracao = dados.ulceracao.toUpperCase();
            }

            if (dados.lesaoSatelite !== undefined && dados.lesaoSatelite !== null) {
                this.lesaoSatelite = dados.lesaoSatelite.toUpperCase();
            }

            if (dados.evidenciaRegressao !== undefined && dados.evidenciaRegressao !== null) {
                this.evidenciaRegressao = dados.evidenciaRegressao.toUpperCase();
            }

            if (dados.associacaoNevoMelanocito !== undefined && dados.associacaoNevoMelanocito !== null) {
                this.associacaoNevoMelanocito = dados.associacaoNevoMelanocito.toUpperCase();
            }

            if (dados.margemCirurgiaProfunda !== undefined && dados.margemCirurgiaProfunda !== null) {
                this.margemCirurgiaProfunda = dados.margemCirurgiaProfunda.toUpperCase();
            }

            if (dados.margemCirurgiaLateral !== undefined && dados.margemCirurgiaLateral !== null) {
                this.margemCirurgiaLateral = dados.margemCirurgiaLateral.toUpperCase();
            }

            if (dados.margemProfundaLivre !== undefined && dados.margemProfundaLivre !== null) {
                this.margemProfundaLivre = dados.margemProfundaLivre.toUpperCase();
            }

            if (dados.margemLateralLivre !== undefined && dados.margemLateralLivre !== null) {
                this.margemLateralLivre = dados.margemLateralLivre.toUpperCase();
            }

            if (dados.invasaoVascular !== undefined && dados.invasaoVascular !== null) {
                this.invasaoVascular = dados.invasaoVascular.toUpperCase();
            }

            if (dados.menorDistMargemRessecaoLateral !== undefined && dados.menorDistMargemRessecaoLateral !== null) {
                this.menorDistMargemRessecaoLateral = dados.menorDistMargemRessecaoLateral.toUpperCase();
            }

            if (dados.infiltracaoAngiolinfatica !== undefined && dados.infiltracaoAngiolinfatica !== null) {
                this.infiltracaoAngiolinfatica = dados.infiltracaoAngiolinfatica.toUpperCase();
            }

            if (dados.infiltracaoPerineural !== undefined && dados.infiltracaoPerineural !== null) {
                this.infiltracaoPerineural = dados.infiltracaoPerineural.toUpperCase();
            }

            if (dados.infiltradoLinfocito !== undefined && dados.infiltradoLinfocito !== null) {
                this.infiltradoLinfocito = dados.infiltradoLinfocito.toUpperCase();
            }

            if (dados.limiteRessecao !== undefined && dados.limiteRessecao !== null) {
                this.limiteRessecao = dados.limiteRessecao.toUpperCase();
            }

        } else {
            this.imagens = new Array<Imagem>();
        }
    }

    public getAuditado (): boolean {
        return this.auditado;
    }

    public setAuditado (auditado: boolean): void {
        this.auditado = auditado;
    }

    public getId(): number {
        return this.id;
    }

    public setId(id: number): void {
        this.id = id;
    }

    public getDiagnosticoClinico(): string {
        return this.diagnosticoClinico;
    }

    public setDiagnosticoClinico(diagnosticoClinico: string): void {
        this.diagnosticoClinico = diagnosticoClinico;
    }

    public getDiagnosticoClinicoSecundario(): string {
        return this.diagnosticoClinicoSecundario;
    }

    public setDiagnosticoClinicoSecundario(diagnosticoClinicoSecundario: string): void {
        this.diagnosticoClinicoSecundario = diagnosticoClinicoSecundario;
    }

    public getProcedimento(): string {
        return this.procedimento;
    }

    public setProcedimento(procedimento: string): void {
        this.procedimento = procedimento;
    }

    public getCirurgiao(): string {
        return this.cirurgiao;
    }

    public setCirurgiao(cirurgiao: string): void {
        this.cirurgiao = cirurgiao;
    }

    public getObs(): string {
        return this.obs;
    }

    public setObs(obs: string): void {
        this.obs = obs;
    }

    public getDiametroMaior(): number {
        return this.diametroMaior;
    }

    public setDiametroMaior(diametroMaior: number): void {
        this.diametroMaior = diametroMaior;
    }

    public getDiametroMenor(): number {
        return this.diametroMenor;
    }

    public setDiametroMenor(diametroMenor: number): void {
        this.diametroMenor = diametroMenor;
    }

    public getImagens(): Imagem[] {
        return this.imagens;
    }

    public setImagens(imagens: Imagem[]): void {
        this.imagens = imagens;
    }

    public getDataProcedimento(): Date {
        return this.dataProcedimento;
    }

    public setDataProcedimento(dataProcedimento: Date): void {
        this.dataProcedimento = dataProcedimento;
    }

    public getLocalProcedimento(): string {
        return this.localProcedimento;
    }

    public setLocalProcedimento(localProcedimento: string): void {
        this.localProcedimento = localProcedimento;
    }

    public getDiagnosticoHisto(): string {
        return this.diagnosticoHisto;
    }

    public setDiagnosticoHisto(diagnosticoHisto: string): void {
        this.diagnosticoHisto = diagnosticoHisto;
    }

    public getSubtipoHisto(): string {
        return this.subtipoHisto;
    }

    public setSubtipoHisto(subtipoHisto: string): void {
        this.subtipoHisto = subtipoHisto;
    }

    public getClark(): string {
        return this.clark;
    }

    public setClark(clark: string): void {
        this.clark = clark;
    }

    public getBreslow(): number {
        return this.breslow;
    }

    public setBreslow(breslow: number): void {
        this.breslow = breslow;
    }

    public getIndiceMiotico(): number {
        return this.indiceMiotico;
    }

    public setIndiceMiotico(indiceMiotico: number): void {
        this.indiceMiotico = indiceMiotico;
    }

    public getRegiao(): string {
        return this.regiao;
    }

    public setRegiao(regiao: string): void {
        this.regiao = regiao;
    }

    public setPacienteId (id: number) {
        this.pacienteId = 'paciente/' + id;
    }

    public getPacienteId (): string {
        return this.pacienteId;
    }

    public getLimiteRessecao(): string {
        return this.limiteRessecao;
    }

    public setLimiteRessecao(limiteRessecao: string): void {
        this.limiteRessecao = limiteRessecao;
    }

    public getInfiltracaoPerineural(): string {
        return this.infiltracaoPerineural;
    }

    public setInfiltracaoPerineural(infiltracaoPerineural: string): void {
        this.infiltracaoPerineural = infiltracaoPerineural;
    }

    public getInfiltracaoAngiolinfatica(): string {
        return this.infiltracaoAngiolinfatica;
    }

    public setInfiltracaoAngiolinfatica(infiltracaoAngiolinfatica: string): void {
        this.infiltracaoAngiolinfatica = infiltracaoAngiolinfatica;
    }

    public getInfiltradoLinfocito(): string {
        return this.infiltradoLinfocito;
    }

    public setInfiltradoLinfocito(infiltradoLinfocito: string): void {
        this.infiltradoLinfocito = infiltradoLinfocito;
    }


}
