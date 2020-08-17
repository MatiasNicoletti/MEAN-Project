import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  isLoading: boolean = false;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }
  onSignup(signUp: NgForm){
    if(signUp.invalid){
      return;
    }
    this.isLoading = true;
    this.authService.createUser(signUp.value.email,signUp.value.password);
  }
}
