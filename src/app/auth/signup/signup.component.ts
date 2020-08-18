import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  private authStatusSubscription: Subscription;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authStatusSubscription = this.authService.getAuthStatusListener().subscribe(
      authStatus =>{
        this.isLoading = false; 
      }
    );
  }
  ngOnDestroy(){
    this.authStatusSubscription.unsubscribe();
  }

  onSignup(signUp: NgForm){
    if(signUp.invalid){
      return;
    }
    this.isLoading = true;
    this.authService.createUser(signUp.value.email,signUp.value.password);
  }
}
