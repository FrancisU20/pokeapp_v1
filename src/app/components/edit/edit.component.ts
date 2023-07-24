import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormularioDatos } from 'src/app/interfaces/formulario.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  isLoading: boolean = true;
  selectedImage: File | null = null;
  selectedImageName: string = '';
  selectedImageURL: any;
  maskDui = '000000000-0';
  pasatiemposArray: string[] = [
    'Leer',
    'Cantar',
    'Bailar',
    'Jugar',
    'Dibujar',
    'Cocinar',
    'Programar',
    'Dormir',
    'Comer',
    'Correr',
    'Nadar',
    'Caminar',
    'Ver películas',
    'Ver series',
    'Ver anime',
    'Ver doramas',
    'Ver caricaturas',
    'Ver videos',
    'Ver memes',
    'Ver tutoriales',
    'Ver deportes',
    'Ver noticias',
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    console.log(localStorage.getItem('email'));
    this.formulario.get('dui')?.disable();
    this.formulario.get('dui')?.clearValidators();
    this.formulario.get('dui')?.updateValueAndValidity();
    //Cargar Local Storage
    this.formulario.get('nombre')?.setValue(localStorage.getItem('nombre'));
    this.formulario
      .get('pasatiempo')
      ?.setValue(localStorage.getItem('pasatiempo'));
    this.formulario
      .get('cumpleanos')
      ?.setValue(localStorage.getItem('cumpleanos'));
    this.formulario.get('dui')?.setValue(localStorage.getItem('dui'));
    this.selectedImageURL = localStorage.getItem('imagen');
    this.selectedImageName = 'profile-photo.png';
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

  // Formulario
  formulario = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.minLength(3)]),
    pasatiempo: new FormControl(''),
    cumpleanos: new FormControl('', Validators.required),
    dui: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10),
    ]),
  });

  // Método para manejar la selección de la imagen
  onImageSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      this.selectedImageName = this.limitFileNameLength(file.name, 20);
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImageURL = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Método para limpiar la imagen seleccionada
  clearImage() {
    this.selectedImage = null;
    this.selectedImageURL = null;
    this.selectedImageName = 'Adjunta una imagen';
  }

  // Método para limitar el nombre de la imagen
  private limitFileNameLength(name: string, maxLength: number): string {
    if (name.length > maxLength) {
      return name.substring(0, maxLength);
    }
    return name;
  }

  private isUserOver18(birthDate: Date): boolean {
    if (!birthDate) {
      return false;
    }
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age >= 18;
  }

  // Método para manejar el cambio de fecha de nacimiento
  onBirthDateChange(event: any) {
    if (event.value) {
      const birthDate = new Date(event.value);
      if (this.isUserOver18(birthDate)) {
        this.formulario.get('dui')?.enable();
        this.formulario
          .get('dui')
          ?.setValidators([
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10),
          ]);
        this.formulario.get('dui')?.updateValueAndValidity();
      } else {
        this.formulario.get('dui')?.setValue('');
        this.formulario.get('dui')?.disable();
        this.formulario.get('dui')?.clearValidators();
        this.formulario.get('dui')?.updateValueAndValidity();
      }
    } else {
      this.formulario.get('dui')?.setValue('');
      this.formulario.get('dui')?.disable();
      this.formulario.get('dui')?.clearValidators();
      this.formulario.get('dui')?.updateValueAndValidity();
    }
  }

  retrieveUserData() {
    console.log(localStorage.getItem('imagen'));
  }

  // Método para manejar el envío del formulario
  onSubmit() {
    if (this.formulario.valid && this.selectedImageURL) {
      const formData: FormularioDatos = {
        nombre: this.formulario.value.nombre!,
        pasatiempo: this.formulario.value.pasatiempo!,
        cumpleanos: new Date(this.formulario.value.cumpleanos!),
        dui: this.formulario.value.dui!,
        imagen: this.selectedImageURL,
      };
      this.router.navigate(['/dashboard']).then(() => {
        localStorage.setItem('nombre', formData.nombre);
        localStorage.setItem('pasatiempo', formData.pasatiempo);
        localStorage.setItem('cumpleanos', formData.cumpleanos.toISOString());
        localStorage.setItem('dui', formData.dui);
        localStorage.setItem('imagen', formData.imagen);
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Debes subir una imagen o verificar los campos del formulario antes de continuar.',
      });
    }
  }
}
