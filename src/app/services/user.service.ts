import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { signOut } from 'firebase/auth';
import { Auth } from '@angular/fire/auth';
import { FirebaseErrorService } from './firebase-error.service';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor(private afAuth:AngularFireAuth, private auth:Auth, private firebaseError:FirebaseErrorService, private firestore:Firestore) { }

  async getUid(){
    const user = await this.afAuth.currentUser;
    if(user === null){
      return null;
    }
    else{
      return user?.uid;
    }
  }

  conexion(){
    if(this.getUid()===null){
      return false
    }
    return true
  }

  cerrarSesion(){
    return signOut(this.auth);
  }

  iniciarSesion(correo:any,contrasena:any):void{
    this.afAuth.signInWithEmailAndPassword(correo,contrasena).catch((error)=>
      alert(this.firebaseError.firebaseError(error.code))
    )
  }

  verificarCorreo(){
    this.afAuth.currentUser.then(user=> user?.sendEmailVerification())
  }

  async guardarUsuario(correo:any){
    const id = await this.getUid();
    const rol = 'usuario'
    const obj = Object.assign({
        "UID":id,
        "rol":rol,
        "Correo electrónico":correo
      })
    const ref = collection(this.firestore,'Usuarios');
    Swal.fire({
      title: '¡Registrado!',
      text: 'Verifica tu correo antes de iniciar sesión.',
      icon: 'success',
      allowOutsideClick: false,
    })
    return addDoc(ref,obj);
  }
 
}
