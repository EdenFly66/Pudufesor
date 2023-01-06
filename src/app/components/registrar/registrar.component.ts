import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseErrorService } from 'src/app/services/firebase-error.service';
import { UserService } from 'src/app/services/user.service';

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

  compararContrasenas(){
    return this.formulario.value.contrasena==this.formulario.value.contrasena2
  }

  registrar(){
    const email = this.formulario.value.email;
    const password1 = this.formulario.value.password1;
    this.afAuth.createUserWithEmailAndPassword(email,password1).then(()=> {
      this.router.navigate(['/verificado']);
      this.userSv.verificarCorreo();
      this.userSv.guardarUsuario(email);
    }).catch((error)=>{
      alert(this.firebaseError.firebaseError(error.code))
    });
  }
}
