import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
  })
export class AuthService{
    private isAuthenticated:boolean = false;
    private token:string;
    private authStatusListener = new Subject<boolean>();
    constructor(private http: HttpClient, private router: Router){}

    createUser(email: string, password:string){
        const authData: AuthData = {email, password};
        this.http.post('http://localhost:3000/api/users/signup', authData)
            .subscribe(response => {
                console.log(authData);
            });
    }

    login(email: string, password:string){
        const authData: AuthData = {email, password};
        this.http.post<{token:string}>('http://localhost:3000/api/users/login', authData)
            .subscribe(response => {
                this.token = response.token;
                if(this.token){
                    this.isAuthenticated = true;
                    this.authStatusListener.next(true);
                    this.router.navigate(['/']);
                }
            });
    }

    logout(){
        this.token = null;
        this.isAuthenticated =false;
        this.authStatusListener.next(false);
        this.router.navigate(['/']);
    }

    getAuthStatusListener(){
        return this.authStatusListener.asObservable();
    }

    getIsAuth(){
        return this.isAuthenticated;
    }

    getToken(){
        return this.token;
    }
}