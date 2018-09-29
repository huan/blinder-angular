import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import {MatButtonModule} from '@angular/material';

import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PhotoMarkComponent } from './photo-mark/photo-mark.component';
import { DownloadPhotoComponent } from './download-photo/download-photo.component';
import { FormsModule } from '@angular/forms';
// route

const routes: Routes = [
   { path: 'photo/originDownload', component: DownloadPhotoComponent },
   { path: 'photo/:id', component: PhotoMarkComponent },
   { path: '', component: HomeComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    PhotoMarkComponent,
    DownloadPhotoComponent,
    PageNotFoundComponent,
    HomeComponent,
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    FormsModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
