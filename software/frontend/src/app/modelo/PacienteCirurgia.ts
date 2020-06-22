/**
 * @author Gabriel G
 *
 * Classe de modelo do PacienteCirurgia do sistema. Sempre que precisar cadastrar um ou utilizar os seus métodos
 * será utilizada essa classe
 *
 */
import LesaoCirurgia from './LesaoCirurgia';

export default class PacienteCirurgia {
    public id: number;
    public localUltimoAtendimento: string;
    public dataUltimoAtendimento: Date;
    public prontuario: string;
    public sincronizar: boolean;
    public cartaoSus: string;
    public nomeCompleto: string;
    public localNascimento: string;
    public estadoNascimento: string;
    public dataNascimento: Date;
    public nomeMae: string;
    public endereco: string;
    public atvPrincipal: string;
    public escolaridade: string;
    public usoCigarro: string;
    public usoBebida: string;
    public renda: string;
    public origemFamiliarMae: string;
    public origemFamiliarPai: string;
    public usoAgrotoxico: string;
    public diabetes: string;
    public usoAnticoagulante: string;
    public alergia: string;
    public obs: string;
    public presArtSistolica: number;
    public presArtDiastolica: number;
    public numPessoasCasa: number;
    public sexo: string;
    public aguaEncanada: string;
    public redeEsgoto: string;
    public idadeInicioAtv: number;
    public estadoCivil: string;
    public destrofiaSolar: string;
    public expSol: number;
    public horaExpSol: string;
    public usoChapeu: string;
    public usoMangaCumprida: string;
    public usoCalcaCumprida: string;
    public usoFiltroSolar: string;
    public histCancerPele: string;
    public histCancer: string;
    public numVezesAtendido: number;
    public tipoPele: string;
    public hipertensao: string;
    public auditado: boolean;
    // A lesão não possui nullable=false por que o paciente pode ser inserido sem lesão
    // e mais tarde ela é preenchida via app ou no sistema
    public lesoes: Array<LesaoCirurgia>;

    constructor(obj?: any) {

        // Todo paciente adicionado tem que ser sincronizado e auditado
        this.sincronizar = true;
        this.auditado = false;

        if (obj !== undefined) {
            this.localUltimoAtendimento = obj.localUltimoAtendimento.toUpperCase();
            this.dataUltimoAtendimento = obj.dataUltimoAtendimento;
            this.prontuario = obj.prontuario;
            this.cartaoSus = obj.cartaoSus;
            this.nomeCompleto = obj.nomeCompleto.toUpperCase();
            this.localNascimento = obj.localNascimento.toUpperCase();
            this.estadoNascimento = obj.estadoNascimento.toUpperCase();
            this.dataNascimento = obj.dataNascimento;
            this.nomeMae = obj.nomeMae.toUpperCase();
            this.endereco = obj.endereco.toUpperCase();
            this.atvPrincipal = obj.atvPrincipal.toUpperCase();
            this.escolaridade = obj.escolaridade.toUpperCase();
            this.usoCigarro = obj.usoCigarro.toUpperCase();
            this.usoBebida = obj.usoBebida.toUpperCase();
            this.renda = obj.renda.toUpperCase();
            this.origemFamiliarMae = obj.origemFamiliarMae.toUpperCase();
            this.origemFamiliarPai = obj.origemFamiliarPai.toUpperCase();
            this.usoAgrotoxico = obj.usoAgrotoxico.toUpperCase();
            this.diabetes = obj.diabetes.toUpperCase();
            this.usoAnticoagulante = obj.usoAnticoagulante.toUpperCase();
            this.alergia = obj.alergia.toUpperCase();
            this.obs = obj.obs.toUpperCase();
            this.presArtSistolica = obj.presArtSistolica;
            this.presArtDiastolica = obj.presArtDiastolica;
            this.numPessoasCasa = obj.numPessoasCasa;
            this.sexo = obj.sexo.toUpperCase();
            this.aguaEncanada = obj.aguaEncanada.toUpperCase();
            this.redeEsgoto = obj.redeEsgoto.toUpperCase();
            this.idadeInicioAtv = obj.idadeInicioAtv;
            this.estadoCivil = obj.estadoCivil.toUpperCase();
            this.destrofiaSolar = obj.destrofiaSolar.toUpperCase();
            this.expSol = obj.expSol;
            this.horaExpSol = obj.horaExpSol.toUpperCase();
            this.usoChapeu = obj.usoChapeu.toUpperCase();
            this.usoMangaCumprida = obj.usoMangaCumprida.toUpperCase();
            this.usoCalcaCumprida = obj.usoCalcaCumprida.toUpperCase();
            this.usoFiltroSolar = obj.usoFiltroSolar.toUpperCase();
            this.histCancerPele = obj.histCancerPele.toUpperCase();
            this.histCancer = obj.histCancer.toUpperCase();
            this.numVezesAtendido = obj.numVezesAtendido;
            this.tipoPele = obj.tipoPele.toUpperCase();
            this.hipertensao = obj.hipertensao.toUpperCase();

            // O id só é obtido quando o paciente é retornado do banco
            this.id = obj.id;

            // A lesão não possui nullable=false por que o paciente pode ser inserido sem lesão
            // e mais tarde ela é preenchida via app ou no sistema
            if (obj.lesoes !== undefined && obj.lesoes.lenght !== 0) {
                this.lesoes = obj.lesoes;
            } else {
                this.lesoes = new Array<LesaoCirurgia> ();
            }
        }

    }

    public adicionarLesao (lesao: LesaoCirurgia): void {
        this.lesoes.push(lesao);
    }

}
