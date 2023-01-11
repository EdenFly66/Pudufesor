import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire/compat';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { provideAnalytics,getAnalytics,ScreenTrackingService,UserTrackingService } from '@angular/fire/analytics';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { AppComponent } from './app.component';
import { PrincipalComponent } from './components/principal/principal.component';
import { RegistrarComponent } from './components/registrar/registrar.component';
import { CabeceraComponent } from './components/cabecera/cabecera.component';
import { IngresarComponent } from './components/ingresar/ingresar.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { UserService } from './services/user.service';
import { PieComponent } from './components/pie/pie.component';
import { RecuperarComponent } from './components/recuperar/recuperar.component';
import { CursoComponent } from './components/curso/curso.component';
import { AsignaturaComponent } from './components/asignatura/asignatura.component';
import { PreguntaComponent } from './components/pregunta/pregunta.component';
import { NoDisponibleComponent } from './components/no-disponible/no-disponible.component';
import { MaterialComponent } from './components/material/material.component';
import { ContenidosMat1mComponent } from './components/contenidos-mat1m/contenidos-mat1m.component';

const appRoutes:Routes=[
  {path:'',component:IngresarComponent},
  {path:'registrar',component:RegistrarComponent},
  {path:'recuperar',component:RecuperarComponent},
  {path:'perfil',component:PerfilComponent,...canActivate(()=>redirectUnauthorizedTo(['']))},
  {path:'principal',component:PrincipalComponent,...canActivate(()=>redirectUnauthorizedTo(['']))},
  {path:'curso',component:CursoComponent,...canActivate(()=>redirectUnauthorizedTo(['']))},
  {path:'asignatura',component:AsignaturaComponent,...canActivate(()=>redirectUnauthorizedTo(['']))},
  {path:'pregunta',component:PreguntaComponent,...canActivate(()=>redirectUnauthorizedTo(['']))},
  {path:'no-disponible',component:NoDisponibleComponent,...canActivate(()=>redirectUnauthorizedTo(['']))},
  {path:'material',component:MaterialComponent,...canActivate(()=>redirectUnauthorizedTo(['']))},
  {path:'contenidos-mat1m',component:ContenidosMat1mComponent,...canActivate(()=>redirectUnauthorizedTo(['']))}
]

@NgModule({
  declarations: [
    AppComponent,
    PrincipalComponent,
    RegistrarComponent,
    CabeceraComponent,
    IngresarComponent,
    PerfilComponent,
    PieComponent,
    RecuperarComponent,
    CursoComponent,
    AsignaturaComponent,
    PreguntaComponent,
    NoDisponibleComponent,
    MaterialComponent,
    ContenidosMat1mComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAnalytics(() => getAnalytics()),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ],
  providers: [
    ScreenTrackingService,
    UserTrackingService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
