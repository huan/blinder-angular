import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginComponent } from './login/login.component';
import { PhotoMarkComponent } from './photo-mark/photo-mark.component';
import { DownloadPhotoComponent } from './download-photo/download-photo.component';
import {MatButtonModule} from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

// route

const appRoutes: Routes = [
   { path: 'photo/originDownload', component: DownloadPhotoComponent },
   { path: 'photo/:id', component: PhotoMarkComponent },
   { path: 'login', component: LoginComponent },
   { path: '', component: HomeComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PhotoMarkComponent,
    DownloadPhotoComponent,
    PageNotFoundComponent,
    HomeComponent,
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    BrowserModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
