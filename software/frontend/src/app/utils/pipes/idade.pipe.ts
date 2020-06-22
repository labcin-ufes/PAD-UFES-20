import { Pipe, PipeTransform } from '@angular/core';

/**
 * @author André Pacheco
 * Pipe criado para parsear uma em string para uma idade
 * @param data Data em formato de string, ex: 1942-07-17
 * @return A idade de acordo com a data
 */
@Pipe({
  name: 'idade'
})
export class IdadePipe implements PipeTransform {

  transform(dataNascStr: string): number {
    const dataNasc = new Date (dataNascStr);
    const difTempo = Math.abs(Date.now() - dataNasc.getTime());
    const idade = Math.floor((difTempo / (1000 * 3600 * 24)) / 365.25);
    return idade;
  }

}
