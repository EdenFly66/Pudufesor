import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { collection, Firestore } from '@angular/fire/firestore';
import { query, getDocs } from 'firebase/firestore';
import { Usuario } from 'src/app/interfaces/usuario';

@Component({
  selector: 'app-cabecera',
  templateUrl: './cabecera.component.html',
  styleUrls: ['./cabecera.component.scss'],
  providers: [UserService]
})
export class CabeceraComponent {
  rol?: string;
  constructor(
    private router: Router,
    private userSv: UserService,
    private firestore: Firestore
  ) {}

  ngOnInit() {
    this.rolUser();
  }

  async rolUser() {
    const id = await this.userSv.getUid();
    const q = query(collection(this.firestore, 'Usuarios'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((e) => {
      const datos = e.data() as Usuario;
      if (datos.UID === id) {
        this.rol = datos.rol;
      }
    });
  }
  
  botonSalir(){
    this.userSv.cerrarSesion().then(()=>{
      window.location.reload()
    })
  }
  botonPerfil(){
    this.router.navigate(['/perfil'])
  }

  botonInicio(){
    this.router.navigate([''])
  }

  botonIngresar(){
    this.router.navigate(['/ingresar'])
  }

  botonRegistrar(){
    this.router.navigate(['/registrar'])
  }

}
