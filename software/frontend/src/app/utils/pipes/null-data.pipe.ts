import { Pipe, PipeTransform } from '@angular/core';

/**
 * @author Felipe Branquinho
 * Pipe criado para verificar se string é nula
 * @param data qualquer e uma string de erro
 * @return A data ou errStr 
 */
@Pipe({
  name: 'nullData'
})
export class NullDataPipe implements PipeTransform {

  transform(dataStr: any, errStr: string): string {
    return dataStr !== null && dataStr !== undefined ? dataStr : errStr;
  }

}