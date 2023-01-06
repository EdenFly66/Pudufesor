import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-cabecera',
  templateUrl: './cabecera.component.html',
  styleUrls: ['./cabecera.component.scss'],
  providers: [UserService]
})
export class CabeceraComponent {

  

  constructor(private router:Router, private userSv: UserService){

  }

  botonIngresar(){
    this.router.navigate(['/ingresar'])
  }

  botonSalir(){
    
  }

  botonPerfil(){
    this.router.navigate(['/perfil'])
  }
  
  estadoSesion(){
    //return this.userSv.conexion()
  }

}
