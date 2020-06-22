import Imagem from './Imagem';

export default class LesaoDermato {

    private id: number;
    private regiao: string;
    private grandeRegiao: string;
    private diagnostico: string;
    private diagnosticoSecundario: string;
    private cresceu: string;
    private cocou: string;
    private sangrou: string;
    private doeu: string;
    private mudou: string;
    private relevo: string;
    private idade: number;
    private obs: string;
    private imagens: Imagem[];
    private pacienteId: number;
    private auditado: boolean;

    constructor (obj?: any) {

        // Toda lesao adicionana precisa ser auditada
        this.auditado = false;

        if (obj !== undefined) {
            this.id = obj.id;
            this.regiao = obj.regiao;
            
            this.diagnostico = obj.diagnostico;
            this.diagnosticoSecundario = obj.diagnosticoSecundario;
            this.imagens = obj.imagens;
            this.idade = obj.idade;            
            this.pacienteId = obj.pacienteId;
            this.auditado = obj.auditado;

            if (obj.obs !== undefined && obj.obs !== null) {
                this.obs = obj.obs.toUpperCase();
            } else {
                this.obs = "NENHUMA";
            }

            if (obj.grandeRegiao !== undefined && obj.grandeRegiao !== null) {
                this.grandeRegiao = obj.grandeRegiao.toUpperCase();
            }

            

            obj.cresceu ? this.cresceu = 'S' : this.cresceu = 'N';
            obj.cocou ? this.cocou = 'S' : this.cocou = 'N';
            obj.sangrou ? this.sangrou = 'S' : this.sangrou = 'N';
            obj.doeu ? this.doeu = 'S' : this.doeu = 'N';
            obj.mudou ? this.mudou = 'S' : this.mudou = 'N';
            obj.relevo ? this.relevo = 'S' : this.relevo = 'N';
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

    public getRegiao(): string {
        return this.regiao;
    }

    public setRegiao(regiao: string): void {
        this.regiao = regiao;
    }

    public getDiagnostico(): string {
        return this.diagnostico;
    }

    public setDiagnostico(diagnostico: string): void {
        this.diagnostico = diagnostico;
    }

    public getDiagnosticoSecundario(): string {
        return this.diagnosticoSecundario;
    }

    public setDiagnosticoSecundario(diagnosticoSecundario: string): void {
        this.diagnosticoSecundario = diagnosticoSecundario;
    }

    public getCresceu(): string {
        return this.cresceu;
    }

    public setCresceu(cresceu: string): void {
        this.cresceu = cresceu;
    }

    public getCocou(): string {
        return this.cocou;
    }

    public setCocou(cocou: string): void {
        this.cocou = cocou;
    }

    public getSangrou(): string {
        return this.sangrou;
    }

    public setSangrou(sangrou: string): void {
        this.sangrou = sangrou;
    }

    public getDoeu(): string {
        return this.doeu;
    }

    public setDoeu(doeu: string): void {
        this.doeu = doeu;
    }

    public getMudou(): string {
        return this.mudou;
    }

    public setMudou(mudou: string): void {
        this.mudou = mudou;
    }

    public getRelevo(): string {
        return this.relevo;
    }

    public setRelevo(relevo: string): void {
        this.relevo = relevo;
    }

    public getIdade(): number {
        return this.idade;
    }

    public setIdade(idade: number): void {
        this.idade = idade;
    }

    public getObs(): string {
        return this.obs;
    }

    public setObs(obs: string): void {
        this.obs = obs;
    }

    public getImagens(): Imagem[] {
        return this.imagens;
    }

    public setImagens(imagens: Imagem[]): void {
        this.imagens = imagens;
    }

    public getPacienteId(): number {
        return this.pacienteId;
    }

    public setPacienteId(pacienteId: number): void {
        this.pacienteId = pacienteId;
    }
}
