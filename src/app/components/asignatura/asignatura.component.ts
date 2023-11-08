import { Component } from '@angular/core';
import { collection,Firestore, getDocs, query } from '@angular/fire/firestore';
import { FormBuilder, Validators } from '@angular/forms';
import { addDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { Asignatura } from 'src/app/interfaces/asignatura';
import { Curso } from 'src/app/interfaces/curso';
import { Incremental } from 'src/app/interfaces/incremental';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-asignatura',
  templateUrl: './asignatura.component.html',
  styleUrls: ['./asignatura.component.scss']
})
export class AsignaturaComponent {
  incremental!: number;
  formulario:any
  formularioCrear:any
  asignaturas:Array<any> = []
  cursos:Array<Curso>=[]
  constructor(private readonly fb: FormBuilder, private userSv:UserService, private firestore:Firestore){
    this.formulario = this.fb.group({
      asignatura: ['',[Validators.required]],
      curso:['',[]]
    })
    this.formularioCrear = this.fb.group({
      asignatura:['',[]]
    })
  }

  async ngOnInit(){
    this.obtenerCursos()
    this.obtenerAsignaturas()
    const docRef = doc(this.firestore, 'Incrementales', 'UltimoIdAsignatura');
    const docSnap = await getDoc(docRef);
    let data: Incremental = docSnap.data() as Incremental;
    this.incremental = data.id;
  }

  async obtenerAsignaturas(){
    const q = query(collection(this.firestore,"Asignaturas"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(e => {
      const datos = e.data() as Asignatura
      this.asignaturas.push(datos)
    })
  }

  async obtenerCursos(){
    const q = query(collection(this.firestore,"Cursos"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(e => {
      const datos = e.data() as Curso
      this.cursos.push(datos)
    })
  }

  async crear(){
    console.log(this.asignaturas, this.formularioCrear.value.asignatura)
    const ref = collection(this.firestore, 'Asignaturas');
    const q = query(collection(this.firestore, 'Asignaturas'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((e) => {
      const datos = e.data() as Asignatura;
      this.asignaturas.push(datos.nombre);
    });
    if (this.formularioCrear.value.asignatura == '') {
      Swal.fire({
        title: '¡Cuidado!',
        text: 'No llenaste el formulario.',
        icon: 'warning',
        allowOutsideClick: false,
      });
    } else {
      let guardar = true;
      for (let i = 0; i < this.asignaturas.length; i++) {
        if (this.asignaturas[i].nombre == this.formularioCrear.value.asignatura) {
          guardar = false;
        }
      }
      if (!guardar) {
        Swal.fire({
          title: '¡Denegado!',
          text: 'Ya existe la asignatura.',
          icon: 'warning',
          allowOutsideClick: false,
        });
      } else {
        let id:number = this.incremental+1
        let nombreDoc:string = id.toString()
        setDoc(doc(ref, nombreDoc), {
          idCurso: id,
          nombre: this.formularioCrear.value.asignatura,
        });

        setDoc(
          doc(collection(this.firestore, 'Incrementales'), 'UltimoIdAsignatura'),
          {
            id: this.incremental + 1,
            nombre: 'asignatura',
          }
        );
        Swal.fire({
          title: '¡Hecho!',
          text: 'Se ha agregado el nuevo curso.',
          icon: 'success',
          allowOutsideClick: false,
        });
      }
    }
  }

  async agregar(){
    const ref = collection(this.firestore,"Cursos")
    if(this.formulario.value.asignatura=="" || this.formulario.value.curso=="" || this.formulario.value.curso=="Curso"){
      Swal.fire({
        title: '¡Cuidado!',
        text: 'No llenaste el formulario.',
        icon: 'warning',
        allowOutsideClick: false,
      })
    }
    else{
      let cursoId;
      let arrCurso:Array<string>= [];
      for(let i =0 ; i<this.cursos.length ; i++){
        if(this.cursos[i].nombre==this.formulario.value.curso){
          cursoId = this.cursos[i]
          arrCurso = cursoId.ramos
          arrCurso.push(this.formulario.value.asignatura)
          break
        }
      }
      setDoc(doc(ref,this.formulario.value.curso),{
        "nombre":cursoId?.nombre,
        "ramos":arrCurso,
      })
      Swal.fire({
        title: '¡Hecho!',
        text: 'Se ha agregado el nuevo curso.',
        icon: 'success',
        allowOutsideClick: false,
      })
    }
  }
}
