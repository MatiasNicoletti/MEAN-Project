import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })
export class AuthService{
    constructor(private http: HttpClient){}

    createUser(email: string, password:string){
        const authData: AuthData = {email, password};
        this.http.post('http://localhost:3000/api/users/signup', authData)
            .subscribe(response => {
                console.log(authData);
            });
    }

    login(email: string, password:string){
        const authData: AuthData = {email, password};
        this.http.post('http://localhost:3000/api/users/login', authData)
            .subscribe(response => {
                console.log(response);
            })
    }
}