import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CategoriesListComponent } from './Components/categories/categories-list/categories-list.component';
import { CategoryFormComponent } from './Components/categories/category-form/category-form.component';
import { FooterComponent } from './Components/footer/footer.component';
import { HeaderComponent } from './Components/header/header.component';
import { HomeComponent } from './Components/home/home.component';
import { LoginComponent } from './Components/login/login.component';
import { PostFormComponent } from './Components/posts/post-form/post-form.component';
import { PostsListComponent } from './Components/posts/posts-list/posts-list.component';
import { ProfileComponent } from './Components/profile/profile.component';
import { RegisterComponent } from './Components/register/register.component';
import { AuthInterceptorService } from './Services/auth-interceptor.service';
import { FormatDatePipe } from './Pipes/format-date.pipe';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    ProfileComponent,
    PostsListComponent,
    CategoriesListComponent,
    CategoryFormComponent,
    PostFormComponent,
    FormatDatePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
