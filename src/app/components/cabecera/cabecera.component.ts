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
  
  botonSalir(){
    this.userSv.cerrarSesion().then(()=>{
      this.router.navigate([''])
    })
  }

  botonPerfil(){
    this.router.navigate(['/perfil'])
  }

}
