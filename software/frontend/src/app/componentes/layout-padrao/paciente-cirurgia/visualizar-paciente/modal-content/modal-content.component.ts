import { OnInit, Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { URL_API } from '../../../../../utils/url-api';
import { VisualizarPacienteComponent } from '../../../paciente-dermato/visualizar-paciente/visualizar-paciente.component';

@Component({
    selector: 'app-modal-content',
    templateUrl: './modal-content.component.html',
    styleUrls: [ './modal-content.component.css' ]
})
export class ModalContentComponent implements OnInit {
    lesao: any;
    closeBtnName: string;
    imagens: any;
    url_api: string;
   
    constructor(public bsModalRef: BsModalRef) {
        this.url_api = URL_API;
        
    }
   
    ngOnInit() {
      console.log( this.imagens );
    }
}