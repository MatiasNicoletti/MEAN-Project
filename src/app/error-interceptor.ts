import { HttpInterceptor, HttpErrorResponse, HttpRequest, HttpHandler } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError, iif } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorComponent } from './error/error.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor{
    constructor(private dialog: MatDialog){}

    intercept(req: HttpRequest<any>, next: HttpHandler){ 
        return next.handle(req).pipe(
            catchError((error:HttpErrorResponse)=>{
                
                let errorMessage = error.error.message ? error.error.message : 'An unknown error occurred';
                // console.log(errorMessage)
                this.dialog.open(ErrorComponent, {data: errorMessage});
                return throwError(error); //creates an observable
            })
        );
    }
}
