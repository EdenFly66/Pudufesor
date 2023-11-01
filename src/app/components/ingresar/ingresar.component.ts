import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseErrorService } from 'src/app/services/firebase-error.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { collection, Firestore } from '@angular/fire/firestore';
import { query, getDocs } from 'firebase/firestore';
import { Usuario } from 'src/app/interfaces/usuario';
@Component({
  selector: 'app-ingresar',
  templateUrl: './ingresar.component.html',
  styleUrls: ['./ingresar.component.scss'],
})
export class IngresarComponent {
  rol?: string;
  formulario: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private router: Router,
    private firebaseError: FirebaseErrorService,
    private userSv: UserService,
    private firestore: Firestore
  ) {
    this.formulario = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.rolUser();
    if (this.rol == 'admin' || this.rol == 'usuario') {
      this.userSv.cerrarSesion();
    }
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

  ingresar() {
    const email = this.formulario.value.correo;
    const password1 = this.formulario.value.contrasena;
    if (
      this.formulario.value.correo === '' ||
      this.formulario.value.contrasena === ''
    ) {
      Swal.fire({
        title: '¡Cuidado!',
        text: 'Faltan datos por completar.',
        icon: 'warning',
        allowOutsideClick: false,
      });
    } else {
      this.afAuth
        .signInWithEmailAndPassword(email, password1)
        .then(() => {
          this.router.navigate(['']);
        })
        .catch((error) => alert(this.firebaseError.firebaseError(error.code)));
    }
  }
}
