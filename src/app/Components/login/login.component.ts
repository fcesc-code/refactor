import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthDTO } from 'src/app/Models/auth.dto';
import { HeaderMenus } from 'src/app/Models/header-menus.dto';
import { AuthService } from 'src/app/Services/auth.service';
import { HeaderMenusService } from 'src/app/Services/header-menus.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { SharedService } from 'src/app/Services/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
})
export class LoginComponent {
  loginUser: AuthDTO;
  email: FormControl;
  password: FormControl;
  loginForm: FormGroup;
  isValidForm: boolean | null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private sharedService: SharedService,
    private headerMenusService: HeaderMenusService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {
    this.isValidForm = null;
    this.loginUser = new AuthDTO('', '', '', '');

    this.email = new FormControl('', [
      Validators.required,
      Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
    ]);

    this.password = new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(16),
    ]);

    this.loginForm = this.formBuilder.group({
      email: this.email,
      password: this.password,
    });
  }

  async login(): Promise<void> {
    this.isValidForm = false;
    if (this.validateForm()) {
      this.loginUser.email = this.email.value;
      this.loginUser.password = this.password.value;
      try {
        const authToken = await this.authService.login(this.loginUser);
        this.loginUser.user_id = authToken.user_id;
        this.loginUser.access_token = authToken.access_token;
        this.localStorageService.set('user_id', this.loginUser.user_id);
        this.localStorageService.set(
          'access_token',
          this.loginUser.access_token
        );
        await this.sharedService.managementToast('loginFeedback', true);
        this.setPrivateHeaders();
        this.router.navigateByUrl('home');
      } catch (error: any) {
        this.setPublicHeaders();
        this.logError(error.error);
      }
    }
  }

  private async logError(error: any): Promise<void> {
    this.sharedService.errorLog(error);
    await this.sharedService.managementToast('loginFeedback', false, error);
  }

  private async setPublicHeaders(): Promise<void> {
    const headerInfo: HeaderMenus = {
      showAuthSection: false,
      showNoAuthSection: true,
    };
    this.headerMenusService.headerManagement.next(headerInfo);
  }

  private async setPrivateHeaders(): Promise<void> {
    const headerInfo: HeaderMenus = {
      showAuthSection: true,
      showNoAuthSection: false,
    };
    this.headerMenusService.headerManagement.next(headerInfo);
  }

  private validateForm(): boolean {
    this.isValidForm = !this.loginForm.invalid;
    return !this.loginForm.invalid;
  }
}
