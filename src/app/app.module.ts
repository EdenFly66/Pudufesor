import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';

import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { provideAnalytics,getAnalytics,ScreenTrackingService,UserTrackingService } from '@angular/fire/analytics';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { PrincipalComponent } from './components/principal/principal.component';
import { RegistrarComponent } from './components/registrar/registrar.component';
import { CabeceraComponent } from './components/cabecera/cabecera.component';
import { IngresarComponent } from './components/ingresar/ingresar.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { UserService } from './services/user.service';

const appRoutes:Routes=[
  {path:'',component:PrincipalComponent},
  {path:'ingresar',component:IngresarComponent},
  {path:'registrar',component:RegistrarComponent},
  {path:'perfil',component:PerfilComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    PrincipalComponent,
    RegistrarComponent,
    CabeceraComponent,
    IngresarComponent,
    PerfilComponent
  ],
  imports: [
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
