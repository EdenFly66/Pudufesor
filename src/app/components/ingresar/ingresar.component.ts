import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseErrorService } from 'src/app/services/firebase-error.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ingresar',
  templateUrl: './ingresar.component.html',
  styleUrls: ['./ingresar.component.scss']
})
export class IngresarComponent {

  formulario: FormGroup;

  constructor(private readonly fb: FormBuilder, private afAuth: AngularFireAuth, private router:Router, private firebaseError:FirebaseErrorService,private userSv: UserService){
    this.formulario = this.fb.group({
      correo: ['',[Validators.required, Validators.email],],
      contrasena:['',[Validators.required]]
    })
  }

  ngOnInit(){
    this.userSv.cerrarSesion()
  }

  ingresar(){
    const email = this.formulario.value.correo;
    const password1 = this.formulario.value.contrasena;
    if(this.formulario.value.correo==="" || this.formulario.value.contrasena===""){
      Swal.fire({
        title: '¡Cuidado!',
        text: 'Faltan datos por completar.',
        icon: 'warning',
        allowOutsideClick: false,
      })
    }
    else{
      this.afAuth.signInWithEmailAndPassword(email,password1).then(()=>{
      this.router.navigate(['']);
    }).catch((error)=>
      alert(this.firebaseError.firebaseError(error.code))
    )
    }
    
  }

}
