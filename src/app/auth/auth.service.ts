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
    private tokenTimer: any;
    private userId: string;
    private authStatusListener = new Subject<boolean>();
    constructor(private http: HttpClient, private router: Router){}

    createUser(email: string, password:string){
        const authData: AuthData = {email, password};
        return this.http.post('http://localhost:3000/api/users/signup', authData)
            .subscribe(response => {
                this.router.navigate[('/')];
            }, error => {
                this.authStatusListener.next(false);
            });
    }

    login(email: string, password:string){
        const authData: AuthData = {email, password};
        this.http.post<{token:string, expiresIn:number, userId:string}>('http://localhost:3000/api/users/login', authData)
            .subscribe(response => {
                this.token = response.token;
                if(this.token){
                    const expiresIn = response.expiresIn;
                    this.setAuthTimer(expiresIn);
                    this.isAuthenticated = true;
                    this.userId = response.userId;
                    this.authStatusListener.next(true);
                    const expirationDate = new Date(Date.now() + expiresIn *1000);
                    console.log(expirationDate);
                    this.saveAuthData(this.token, expirationDate, this.userId);
                    this.router.navigate(['/']);
                }
            }, error =>{
                this.authStatusListener.next(false);
            });
    }

    logout(){
        this.token = null;
        this.isAuthenticated =false;
        this.authStatusListener.next(false);
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.userId = null;
        this.router.navigate(['/']);
    }

    private setAuthTimer(duration:number){
        this.tokenTimer = setTimeout(()=>{
            this.logout();
        }, duration * 1000);
    }

    autoAuthUser(){
        const authInformation = this.getAuthData();
        if(!authInformation){
            return;
        }
        const expiresIn = authInformation.expirationDate.getTime() - new Date().getTime();
        if(expiresIn > 0){
            this.token = authInformation.token;
            this.isAuthenticated = true;
            this.userId = authInformation.userId;
            this.setAuthTimer(expiresIn / 1000);
            this.authStatusListener.next(true);
        }
    }

    private getAuthData(){
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');
        const userId = localStorage.getItem('userId');
        if(!token || !expirationDate){
            return;
        }
        return{
            token,
            expirationDate: new Date(expirationDate),
            userId
        }
    }
    private saveAuthData(token:string, expirationDate: Date,userId:string){
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());
        localStorage.setItem('userId', userId);
    }
    private clearAuthData(){
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        localStorage.removeItem('userId');
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

    getUserId(){
        return this.userId;
    }
}