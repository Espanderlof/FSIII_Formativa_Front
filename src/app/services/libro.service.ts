import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Libro } from '../models/libro.model';
import { AlertService } from './alert.service';
import { environment } from '../../environments/environment.prod';

@Injectable({
    providedIn: 'root'
})
export class LibroService {
    //private baseUrl = 'http://localhost:8081/api/libros';
    //private baseUrl = 'http://ip172-18-0-32-ct2gr0aim2rg008ls7q0-8081.direct.labs.play-with-docker.com/api/libros';

    private baseUrl = environment.apiUrl;

    constructor(
        private http: HttpClient,
        private alertService: AlertService
    ) { }

    private handleError(error: HttpErrorResponse) {
        let errorMessage = 'Ha ocurrido un error en el servidor';
        if (error.error instanceof ErrorEvent) {
            errorMessage = `Error: ${error.error.message}`;
        } else {
            errorMessage = `Error: ${error.status}\nMensaje: ${error.message}`;
        }
        this.alertService.showAlert({ type: 'danger', message: errorMessage });
        return throwError(() => new Error(errorMessage));
    }

    private logUrl(method: string) {
        console.log(`[${method}] URL de la petición: ${this.baseUrl}`);
    }

    getLibros(): Observable<Libro[]> {
        this.logUrl('GET-ALL');
        return this.http.get<Libro[]>(this.baseUrl)
            .pipe(catchError(this.handleError.bind(this)));
    }

    getLibro(id: number): Observable<Libro> {
        this.logUrl('GET-ONE');
        return this.http.get<Libro>(`${this.baseUrl}/${id}`)
            .pipe(catchError(this.handleError.bind(this)));
    }

    createLibro(libro: Libro): Observable<Libro> {
        this.logUrl('POST');
        return this.http.post<Libro>(this.baseUrl, libro)
            .pipe(catchError(this.handleError.bind(this)));
    }

    updateLibro(id: number, libro: Libro): Observable<Libro> {
        this.logUrl('PUT');
        return this.http.put<Libro>(`${this.baseUrl}/${id}`, libro)
            .pipe(catchError(this.handleError.bind(this)));
    }

    deleteLibro(id: number): Observable<any> {
        this.logUrl('DELETE');
        return this.http.delete(`${this.baseUrl}/${id}`)
            .pipe(catchError(this.handleError.bind(this)));
    }
}