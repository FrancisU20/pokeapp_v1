import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit{
  mostrarCampoTexto = false;
  nombreUsuario = '';

  constructor(public router: Router) {}

  ngOnInit(): void {
    const nombreUsuario = localStorage.getItem('nombre');
    if (nombreUsuario) {
      const nombres = nombreUsuario.split(' ');
      this.nombreUsuario = nombres[0];
    }
  }

  toggleCampoTexto() {
    this.mostrarCampoTexto = !this.mostrarCampoTexto;
  }

  
  

  salir() {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}
