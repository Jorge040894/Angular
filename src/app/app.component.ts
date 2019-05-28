import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {PersonaService} from './service/persona.service';
import {FormControl, FormGroup} from '@angular/forms';
import {NotificationService} from './service/notification.server';
import {campos} from './classes/campos';
import {Observable, BehaviorSubject} from 'rxjs/index';

@Component({
  selector: 'umg-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  title = 'profesional';

  // definir "FormGroup" para ingreso de datos por formulario
  public formGroup: FormGroup;

  public listadatos:campos[];
  public envivo: BehaviorSubject<any>;

  constructor(private personaService: PersonaService,
              private notificationService: NotificationService) {

  }




  public onClick(): void {
    console.log('on click');
  }


  public enviarFormulario(): void {
    console.log('Datos de formulario:' + JSON.stringify(this.formGroup.value));

    let parametros: any = null;
    parametros = Object.assign({}, this.formGroup.value);

    let datosAEnviar: any = {
      primerNombre: parametros.nombre,
      segundoNombre: parametros.apellido,
      edad: parametros.edad
    };

    console.log('Datos a enviar:' + JSON.stringify(datosAEnviar));

    this.personaService.create(datosAEnviar).subscribe(result => {
      console.log('Datos from server:' + JSON.stringify(result));
    });
  }


  public actualizarFormulario(): void {

    let parametros: any = null;
    parametros = Object.assign({}, this.formGroup.value);


    let datosAEnviar: any = {
      primerNombre: parametros.nombre,
      segundoNombre: parametros.apellido,
      edad: parametros.edad
    };

    console.log('Datos a enviar:' + JSON.stringify(datosAEnviar));

    this.personaService.update(datosAEnviar).subscribe(result => {
      console.log('Datos from server:' + JSON.stringify(result));
    });
  }


  private initForm(): void {
    this.formGroup = new FormGroup({
      nombre: new FormControl('', []
      ),
      apellido: new FormControl('', []
      ),
      edad: new FormControl('', []
      )
    });


  }


  /*-------entrega2------------------*/

     public obtener1(): void{
   
   this.personaService.obtener().subscribe(
      data=>
      {
      this.listadatos = data;
      }
  );
        console.log('Actualizando la tabla');
   }
   /*-----------------------------------------------*/

   /*Const DATA1 = [any];
   private DataStore = new BehaviorSubject(this.DATA1);
*/

  /* ------------------------------------------------------------------------------------------------- */
  private handleMessageReceived(message: any): void {
      this.listadatos.push(JSON.parse(message));
  } 

  /* ------------------------------------------------------------------------------------------------- */
  public doNotificationSubscription(): void {
    try {
      this.notificationService.getPersonaNotification().subscribe((result) => {
        this.handleMessageReceived(result);
      });
    } catch (e) {
      console.log(e);
    }
  }

  /* ------------------------------------------------------------------------------------------------- */

  ngAfterViewInit(): void {
    console.log('on after view');
  }

  ngOnDestroy(): void {
    console.log('on destroy');
  }

  ngOnInit(): void {

    console.log('on init');

    this.envivo = new BehaviorSubject(null);

    // realizar suscripcion
    this.doNotificationSubscription();

    // iniciar formulario
    this.initForm();

    // ejecutar llamada de servicio restful al iniciar la aplicacion
    this.personaService
      .personaList(null)
      .subscribe((result) => {
        console.log('RESULTADO:' + JSON.stringify(result));
        this.listadatos = result;
        this.envivo.next(this.listadatos);
      });
  }
  /*
      this.personaService.obtener().subscribe(
      data=>
      {
      this.listadatos = data;
      }
  );
  */
}
