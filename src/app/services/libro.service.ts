import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Libro } from '../models/libro.model';
import { AlertService } from './alert.service';

@Injectable({
    providedIn: 'root'
})
export class LibroService {
    private baseUrl = 'http://localhost:8080/api/libros';

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

    getLibros(): Observable<Libro[]> {
        return this.http.get<Libro[]>(this.baseUrl)
            .pipe(catchError(this.handleError.bind(this)));
    }

    getLibro(id: number): Observable<Libro> {
        return this.http.get<Libro>(`${this.baseUrl}/${id}`)
            .pipe(catchError(this.handleError.bind(this)));
    }

    createLibro(libro: Libro): Observable<Libro> {
        return this.http.post<Libro>(this.baseUrl, libro)
            .pipe(catchError(this.handleError.bind(this)));
    }

    updateLibro(id: number, libro: Libro): Observable<Libro> {
        return this.http.put<Libro>(`${this.baseUrl}/${id}`, libro)
            .pipe(catchError(this.handleError.bind(this)));
    }

    deleteLibro(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/${id}`)
            .pipe(catchError(this.handleError.bind(this)));
    }
}