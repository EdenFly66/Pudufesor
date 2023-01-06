import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseErrorService } from 'src/app/services/firebase-error.service';

@Component({
  selector: 'app-ingresar',
  templateUrl: './ingresar.component.html',
  styleUrls: ['./ingresar.component.scss']
})
export class IngresarComponent {

  formulario: FormGroup;

  constructor(private readonly fb: FormBuilder, private afAuth: AngularFireAuth, private router:Router, private firebaseError:FirebaseErrorService){
    this.formulario = this.fb.group({
      correo: ['',[Validators.required, Validators.email],
      ],
      contrasena:['',[Validators.required]]
    })
  }

  ingresar(){
    const email = this.formulario.value.email;
    const password1 = this.formulario.value.password1;

    this.afAuth.signInWithEmailAndPassword(email,password1).then(()=>{
      this.router.navigate(['']);
    }).catch((error)=>
      alert(this.firebaseError.firebaseError(error.code))
    )
  }

}
