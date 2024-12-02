import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LibroService } from './libro.service';
import { AlertService } from './alert.service';
import { Libro } from '../models/libro.model';
import { environment } from '../../environments/environment.prod';

describe('pruebas del servicio de libros', () => {
    let service: LibroService;
    let httpMock: HttpTestingController;
    let alertServiceSpy: jasmine.SpyObj<AlertService>;

    beforeEach(() => {
        alertServiceSpy = jasmine.createSpyObj('AlertService', ['showAlert']);

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                LibroService,
                { provide: AlertService, useValue: alertServiceSpy }
            ]
        });

        service = TestBed.inject(LibroService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('deberia crear el servicio', () => {
        expect(service).toBeTruthy();
    });

    it('deberia obtener todos los libros', () => {
        const mockLibros: Libro[] = [
            { id: 1, titulo: 'Libro 1', autor: 'Autor 1', anioPublicacion: 2024, genero: 'genero 1' },
            { id: 2, titulo: 'Libro 2', autor: 'Autor 2', anioPublicacion: 2023, genero: 'genero 2' }
        ];

        service.getLibros().subscribe(libros => {
            expect(libros).toEqual(mockLibros);
        });

        const req = httpMock.expectOne(`${environment.apiUrl}`);
        expect(req.request.method).toBe('GET');
        req.flush(mockLibros);
    });

    it('deberia obtener un libro por id', () => {
        const mockLibro: Libro = {
            id: 1,
            titulo: 'Libro 1',
            autor: 'Autor 1',
            anioPublicacion: 2024,
            genero: 'genero 1'
        };

        service.getLibro(1).subscribe(libro => {
            expect(libro).toEqual(mockLibro);
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/1`);
        expect(req.request.method).toBe('GET');
        req.flush(mockLibro);
    });

    it('deberia crear un nuevo libro', () => {
        const mockLibro: Libro = {
            titulo: 'Nuevo Libro',
            autor: 'Nuevo Autor',
            anioPublicacion: 2024,
            genero: 'nuevo genero'
        };

        service.createLibro(mockLibro).subscribe(libro => {
            expect(libro).toEqual({ ...mockLibro, id: 1 });
        });

        const req = httpMock.expectOne(environment.apiUrl);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(mockLibro);
        req.flush({ ...mockLibro, id: 1 });
    });

    it('deberia actualizar un libro existente', () => {
        const mockLibro: Libro = {
            id: 1,
            titulo: 'Libro Actualizado',
            autor: 'Autor Actualizado',
            anioPublicacion: 2024,
            genero: 'genero actualizado'
        };

        service.updateLibro(1, mockLibro).subscribe(libro => {
            expect(libro).toEqual(mockLibro);
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/1`);
        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toEqual(mockLibro);
        req.flush(mockLibro);
    });

    it('deberia eliminar un libro', () => {
        service.deleteLibro(1).subscribe(response => {
            expect(response).toBeTruthy();
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/1`);
        expect(req.request.method).toBe('DELETE');
        req.flush({});
    });

    it('deberia manejar errores y mostrar alerta', () => {
        service.getLibros().subscribe({
            error: (error) => {
                expect(error).toBeTruthy();
                expect(alertServiceSpy.showAlert).toHaveBeenCalledWith({
                    type: 'danger',
                    message: jasmine.any(String)
                });
            }
        });

        const req = httpMock.expectOne(`${environment.apiUrl}`);
        req.error(new ErrorEvent('Network error'));
    });

    it('deberia manejar errores de servidor correctamente', () => {
        service.getLibros().subscribe({
            error: (error) => {
                expect(error).toBeTruthy();
                expect(alertServiceSpy.showAlert).toHaveBeenCalledWith({
                    type: 'danger',
                    message: `Error: 404\nMensaje: Http failure response for ${environment.apiUrl}: 404 Not Found`
                });
            }
        });

        const req = httpMock.expectOne(`${environment.apiUrl}`);
        req.flush('Error', {
            status: 404,
            statusText: 'Not Found'
        });
    });
});