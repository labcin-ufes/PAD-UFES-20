/**
 * @author André Pacheco
 *
 * Classe de modelo do Usuario do sistema. Sempre que precisar cadastrar um ou utilizar os seus métodos
 * será utilizada essa classe
 *
 */
export default class Usuario {

    public nomeCompleto: string;
    public nomeUsuario: string;
    public senha: string;
    public email: string;
    public apto: boolean;
    public papel: string;

    constructor (nomeCompleto: string, nomeUsuario: string,
        senha: string, email: string, apto: boolean = false,
        papel: string = 'USER'
    ) {
        this.nomeCompleto = nomeCompleto.toUpperCase();
        this.nomeUsuario = nomeUsuario.toLowerCase();
        this.senha = senha;
        this.email = email.toLowerCase();
        this.apto = apto;
        this.papel = papel;
    }

    public print (): void {
        console.log('NomeCompleto: ' + this.nomeCompleto);
        console.log('nomeUsuario: ' + this.nomeUsuario);
        console.log('senha: ' + this.senha);
        console.log('email: ' + this.email);
        console.log('apto: ' + this.apto);
        console.log('papel: ' + this.papel);
    }

}
