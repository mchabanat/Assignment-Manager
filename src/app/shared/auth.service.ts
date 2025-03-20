import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedIn = false;
  role: string | null = null; 

  private validUsers = [
    { username: 'admin', password: '1234', role: 'admin' },
    { username: 'user', password: '1234', role: 'user' },
  ];

  authenticate(username: string, password: string): boolean {
    const user = this.validUsers.find(
      (user) => user.username === username && user.password === password
    );

    if (user) {
      this.loggedIn = true;
      this.role = user.role;  // On enregistre le rôle de l'utilisateur
      return true;
    }

    this.loggedIn = false;
    this.role = null;
    return false;
  }

  login() {
    this.loggedIn = true;
  }

  logout() {
    this.loggedIn = false;
  }

  isAdmin() {
    return new Promise<boolean>((resolve, reject) => {
      if (this.loggedIn && this.role === 'admin') {
        resolve(true);  // Si l'utilisateur est connecté et est un admin
      } else {
        resolve(false);  // Sinon, il n'est pas admin
      }
    });
  }
}
