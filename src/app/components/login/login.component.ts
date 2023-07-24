import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  isLoading: boolean = true;
  loginForm!: FormGroup;

  constructor(private router: Router, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const storedEmail = localStorage.getItem('email');

    if (storedEmail && storedEmail === this.loginForm.value.email) {
      this.router.navigate(['/dashboard']);
    } else {
      localStorage.clear();
      this.router.navigate(['/register']);
      localStorage.setItem('email', this.loginForm.value.email);
    }
  }
}
