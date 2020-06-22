import { Component, OnInit } from '@angular/core';
import { TermosService } from '../../servicos/termos.service';

@Component({
  selector: 'app-termos-de-uso',
  templateUrl: './termos-de-uso.component.html',
  styleUrls: ['./termos-de-uso.component.scss']
})
export class TermosDeUsoComponent implements OnInit {

  public termos: any;
  public falhaReq: boolean;

  constructor(private termosService: TermosService) {

    this.termos = [];
    this.falhaReq = false;
   }

  ngOnInit( ) {
    this.termosService.obtemTermos('termo-de-uso-html').subscribe(
      resp => {
        if (resp !== null) {
          this.termos = resp;
          console.log(this.termos);
        }
      },
      erro => {
        console.log(erro);
        this.falhaReq = true;
      }
    );
  }

}
