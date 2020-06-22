import LesaoDermato from './LesaoDermato';

/**
 * Classe de modelo do PacienteDermato do sistema. Sempre que precisar cadastrar um ou utilizar os seus métodos
 * será utilizada essa classe
 * @author Beatriz Ogioni
 */

export default class PacienteDermato {
    private cartaoSus: string;
    private lesoes: LesaoDermato[];
    private id: number;
    private sincronizar: boolean;
    private auditado: boolean;

    constructor(obj?: any) {

        // Todo paciente adicionado tem que ser sincronizado e auditado
        this.sincronizar = true;
        this.auditado = false;

        if (obj !== undefined) {
            this.cartaoSus = obj.cartaoSus;
            this.id = obj.id;

            obj.lesoes !== undefined ? this.lesoes = obj.lesoes :
                this.lesoes = [];
        }
    }

    public getSincronizar (): boolean {
        return this.sincronizar;
    }

    public setSincronizar (sincronizar: boolean): void {
        this.sincronizar = sincronizar;
    }

    public getAuditado (): boolean {
        return this.auditado;
    }

    public setAuditado (auditado: boolean): void {
        this.auditado = auditado;
    }

    public getCartaoSus(): string {
        return this.cartaoSus;
    }

    public setCartaoSus(cartaoSus: string): void {
        this.cartaoSus = cartaoSus;
    }

    public getLesoes(): LesaoDermato[] {
        return this.lesoes;
    }

    public setLesoes(lesoes: LesaoDermato[]): void {
        this.lesoes = lesoes;
    }

    public getId(): number {
        return this.id;
    }

    public setId(id: number): void {
        this.id = id;
    }
}
