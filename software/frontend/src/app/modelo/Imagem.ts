export default class Imagem {

    public id: number;
    public path: string;
    public segmentado: boolean;

    constructor (dados?: any) {
        if (dados !== undefined) {
            if (dados.id !== undefined) {
                this.id = dados.id;
            }

            // Definindo o padrão png nas imagens
            if (dados.formato !== undefined) {
                this.path = dados.path + '.' + dados.formato;
            } else {
                this.path = dados.path + '.png';
            }

            this.segmentado = false;
        }
    }

    public adicionaFormatoImg (formato = 'png'): void {
        if (this.path.substring(this.path.length-3, this.path.length) !== formato) {
            this.path = this.path + '.' + formato;
        }
    }

    public getId(): number {
        return this.id;
    }

    public setId(id: number): void {
        this.id = id;
    }

    public getPath(): string {
        return this.path;
    }

    public setPath(path: string): void {
        this.path = path;
    }

    public getSegmentado(): boolean {
        return this.segmentado;
    }

    public setSegmentado(segmentado: boolean): void {
        this.segmentado = segmentado;
    }

}
