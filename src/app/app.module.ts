import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAnalytics,getAnalytics,ScreenTrackingService,UserTrackingService } from '@angular/fire/analytics';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideDatabase,getDatabase } from '@angular/fire/database';
import { provideFunctions,getFunctions } from '@angular/fire/functions';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { DataService } from 'src/app/data/data.service';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import { RouterModule, Routes } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from './login/login.service';
import { RegisterService } from './register/register.service';
import { ProductsComponent } from './products/products.component';
import { ProfileComponent } from './user/profile/profile.component';
import { AdministrateComponent } from './user/administrate/administrate.component';
import { DetailsComponent } from './products/details/details.component';
import { NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';
import { TopNavBarComponent } from './top-nav-bar/top-nav-bar.component';
import { QRCodeModule } from 'angularx-qrcode';
import { FavouritesComponent } from './user/favourites/favourites.component';

const appRoutes:Routes=[
  {path: '', component:UserComponent  },
  {path: 'login', component:LoginComponent},
  {path: 'register', component:RegisterComponent},
  {path: 'products', component:ProductsComponent},
  {path: 'profile', component:ProfileComponent},
  {path: 'adminProfiles', component:AdministrateComponent},
  {path: 'topNavBar', component:TopNavBarComponent},
  {path: 'details/:id', component:DetailsComponent},
  {path: 'favourites', component: FavouritesComponent},
  {path: '**', component:UserComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    UserComponent,
    ProductsComponent,
    ProfileComponent,
    AdministrateComponent,
    DetailsComponent,
    TopNavBarComponent,
    FavouritesComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAnalytics(() => getAnalytics()),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideFunctions(() => getFunctions()),
    provideStorage(() => getStorage()),
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    NgxScannerQrcodeModule,
    QRCodeModule
  ],
  providers: [
    ScreenTrackingService,UserTrackingService,DataService,CookieService,LoginService,RegisterService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
