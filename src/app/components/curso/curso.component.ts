import { Component } from '@angular/core';
import {
  collection,
  Firestore,
  getDocs,
  query,
  collectionData,
} from '@angular/fire/firestore';
import { doc, setDoc, getDoc, where } from 'firebase/firestore';
import { FormBuilder, NumberValueAccessor, Validators } from '@angular/forms';
import { Curso } from 'src/app/interfaces/curso';
import { Incremental } from 'src/app/interfaces/incremental';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-curso',
  templateUrl: './curso.component.html',
  styleUrls: ['./curso.component.scss'],
})
export class CursoComponent {
  cursoCambio!:Curso;
  show:boolean = false;
  listaCursos: any = [];
  incremental!: number;
  formulario: any;
  formularioCambio:any;
  cursos: Array<any> = [];
  constructor(
    private readonly fb: FormBuilder,
    private userSv: UserService,
    private firestore: Firestore
  ) {
    this.formulario = this.fb.group({
      curso: ['', [Validators.required]],
    });
    this.formularioCambio = this.fb.group({
      curso:[]
    })
  }

  async ngOnInit() {
    const docRef = doc(this.firestore, 'Incrementales', 'UltimoIdCurso');
    const docSnap = await getDoc(docRef);
    let data: Incremental = docSnap.data() as Incremental;
    this.obtenerCursos().subscribe(e=>{
      this.listaCursos = e;
    })
    this.incremental = data.id;
  }

  obtenerCursos():Observable<Curso[]>{
    const q = query(collection(this.firestore, 'Cursos'));
    return collectionData(q) as Observable<Curso[]>
  }

  async agregar() {
    const ref = collection(this.firestore, 'Cursos');
    const q = query(collection(this.firestore, 'Cursos'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((e) => {
      const datos = e.data() as Curso;
      this.cursos.push(datos.nombre);
    });
    if (this.formulario.value.curso == '') {
      Swal.fire({
        title: '¡Cuidado!',
        text: 'No llenaste el formulario.',
        icon: 'warning',
        allowOutsideClick: false,
      });
    } else {
      let guardar = true;
      for (let i = 0; i < this.cursos.length; i++) {
        if (this.cursos[i] == this.formulario.value.curso) {
          guardar = false;
        }
      }
      if (!guardar) {
        Swal.fire({
          title: '¡Denegado!',
          text: 'Ya existe el curso.',
          icon: 'warning',
          allowOutsideClick: false,
        });
      } else {
        let id:number = this.incremental+1
        let nombreDoc:string = id.toString()
        setDoc(doc(ref, nombreDoc), {
          idCurso: id,
          nombre: this.formulario.value.curso,
          ramos: [],
          habilitado : false
        });

        setDoc(
          doc(collection(this.firestore, 'Incrementales'), 'UltimoIdCurso'),
          {
            id: this.incremental + 1,
            nombre: 'curso',
          }
        );
        Swal.fire({
          title: '¡Hecho!',
          text: 'Se ha agregado el nuevo curso.',
          icon: 'success',
          allowOutsideClick: false,
        });

        window.location.reload();
      }
    }
  }

  habilitar(curso:Curso){
    let nuevoEstado = !curso.habilitado;
    const ref = collection(this.firestore, 'Cursos');

    

    setDoc(doc(ref, curso.idCurso.toString()), {
      idCurso: curso.idCurso,
      nombre: curso.nombre,
      ramos: curso.ramos,
      habilitado : nuevoEstado
    });

  }

  mostrarForm(curso:Curso){
    this.show = true
    this.cursoCambio = curso
  }

  editarNombre(curso:Curso){
    const inputElement = document.getElementById('inputPalabras') as HTMLInputElement
    let nuevoNombre = inputElement.value
    const ref = collection(this.firestore, 'Cursos');


    let guardar = true;
      for (let i = 0; i < this.listaCursos.length; i++) {
        if (this.listaCursos[i].nombre == nuevoNombre) {
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
    }
    else{
      setDoc(doc(ref, curso.idCurso.toString()), {
        idCurso: curso.idCurso,
        nombre: nuevoNombre,
        ramos: curso.ramos,
        habilitado : curso.habilitado
      });
    }

    
  }

  cerrar(){
    this.show = false;
  }
}
