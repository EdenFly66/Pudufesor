import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseErrorService } from 'src/app/services/firebase-error.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.scss']
})
export class RegistrarComponent {
  formulario: FormGroup;

  constructor(private readonly fb: FormBuilder, private afAuth: AngularFireAuth, private router:Router, private firebaseError:FirebaseErrorService, private userSv:UserService){
    this.formulario = this.fb.group({
      correo: ['',[Validators.required, Validators.email],],
      contrasena:['',[Validators.required]],
      contrasena2:['',[]],
    })
  }

  compararContrasenas():boolean{
    return this.formulario.value.contrasena==this.formulario.value.contrasena2
  }

  registrar(){
    const email = this.formulario.value.correo;
    const password1 = this.formulario.value.contrasena;

    if(this.formulario.value.correo==="" || this.formulario.value.contrasena==="" || this.formulario.value.contrasena2===""){
      Swal.fire({
        title: '¡Cuidado!',
        text: 'Faltan datos por completar.',
        icon: 'warning',
        allowOutsideClick: false,
      })
    }
    else if(!this.compararContrasenas()){
      Swal.fire({
        title: '¡Cuidado!',
        text: 'Tus contraseñas no coinciden.',
        icon: 'warning',
        allowOutsideClick: false,
      })
    }
    else{
      this.afAuth.createUserWithEmailAndPassword(email,password1).then(()=> {
      this.router.navigate(['/ingresar']);
      this.userSv.verificarCorreo();
      this.userSv.guardarUsuario(email);
      }).catch((error)=>{
        alert(this.firebaseError.firebaseError(error.code))
      });
    }
    
  }
}
