import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-login',
  imports: [MatInputModule, MatButtonModule, MatFormFieldModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  title = 'Login';

  username = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    if (this.authService.authenticate(this.username, this.password)) {
      console.log('Login successful');
      this.router.navigate(['/home']);
    } else {
      alert('Invalid credentials');
    }
  }
}
