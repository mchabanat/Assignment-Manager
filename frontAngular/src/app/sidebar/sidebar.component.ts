import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, CommonModule ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.router.navigate(['/login']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  isLoggedIn(): boolean {
    return this.authService.loggedIn;
  }
}
