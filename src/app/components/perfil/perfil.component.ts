import { Component } from '@angular/core';
import { collection,Firestore } from '@angular/fire/firestore';
import { getDocs, query, where } from 'firebase/firestore';
import { Usuario } from 'src/app/interfaces/usuario';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent {

  id:any;
  correo:any;
  rol:any;
  constructor(private firestore:Firestore,private userSv:UserService){
    
  }

  async ngOnInit(){
    const id:any = await this.userSv.getUid()
    const q = query(collection(this.firestore,'Usuarios'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(e => {
      const datos = e.data() as Usuario
      if(datos.UID===id){
        this.id = datos.UID;
        this.correo = datos.correo;
        this.rol = datos.rol;
      } 
    });
  }
}
