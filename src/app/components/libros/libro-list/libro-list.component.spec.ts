import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LibroListComponent } from './libro-list.component';
import { LibroService } from '../../../services/libro.service';
import { AlertService } from '../../../services/alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Libro } from '../../../models/libro.model';

describe('pruebas del componente de listado de libros', () => {
    let component: LibroListComponent;
    let fixture: ComponentFixture<LibroListComponent>;
    let libroServiceSpy: jasmine.SpyObj<LibroService>;
    let alertServiceSpy: jasmine.SpyObj<AlertService>;
    let routerSpy: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        libroServiceSpy = jasmine.createSpyObj('LibroService', ['getLibros', 'deleteLibro']);
        alertServiceSpy = jasmine.createSpyObj('AlertService', ['showAlert']);
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [LibroListComponent, FormsModule],
            providers: [
                { provide: LibroService, useValue: libroServiceSpy },
                { provide: AlertService, useValue: alertServiceSpy },
                { provide: Router, useValue: routerSpy },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            paramMap: {
                                get: () => null,
                                has: () => false,
                                getAll: () => [],
                                keys: []
                            }
                        }
                    }
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(LibroListComponent);
        component = fixture.componentInstance;
    });

    it('deberia crear el componente correctamente', () => {
        expect(component).toBeTruthy();
    });

    it('deberia cargar los libros al inicializar', () => {
        const mockLibros: Libro[] = [
            { id: 1, titulo: 'Libro 1', autor: 'Autor 1', anioPublicacion: 2024, genero: 'Genero 1' },
            { id: 2, titulo: 'Libro 2', autor: 'Autor 2', anioPublicacion: 2023, genero: 'Genero 2' }
        ];

        libroServiceSpy.getLibros.and.returnValue(of(mockLibros));

        fixture.detectChanges();

        expect(component.libros).toEqual(mockLibros);
        expect(component.librosFiltrados).toEqual(mockLibros);
    });

    it('deberia filtrar libros por busqueda', () => {
        component.libros = [
            { id: 1, titulo: 'Libro 1', autor: 'Autor 1', anioPublicacion: 2024, genero: 'Genero 1' },
            { id: 2, titulo: 'Otro libro', autor: 'Autor 2', anioPublicacion: 2023, genero: 'Genero 2' }
        ];

        component.busqueda = 'Libro 1';
        component.aplicarFiltros();

        expect(component.librosFiltrados.length).toBe(1);
        expect(component.librosFiltrados[0].titulo).toBe('Libro 1');
    });

    it('deberia filtrar libros por genero', () => {
        component.libros = [
            { id: 1, titulo: 'Libro 1', autor: 'Autor 1', anioPublicacion: 2024, genero: 'Genero 1' },
            { id: 2, titulo: 'Libro 2', autor: 'Autor 2', anioPublicacion: 2023, genero: 'Genero 2' }
        ];

        component.filtroGenero = 'Genero 1';
        component.aplicarFiltros();

        expect(component.librosFiltrados.length).toBe(1);
        expect(component.librosFiltrados[0].genero).toBe('Genero 1');
    });

    it('deberia ordenar libros por titulo', () => {
        component.librosFiltrados = [
            { id: 2, titulo: 'Z Libro', autor: 'Autor 2', anioPublicacion: 2023, genero: 'Genero 2' },
            { id: 1, titulo: 'A Libro', autor: 'Autor 1', anioPublicacion: 2024, genero: 'Genero 1' }
        ];

        component.ordenarPor = 'titulo';
        component.ordenAscendente = true;
        component.ordenarLibros();

        expect(component.librosFiltrados[0].titulo).toBe('A Libro');
        expect(component.librosFiltrados[1].titulo).toBe('Z Libro');
    });

    it('deberia eliminar un libro cuando se confirma', () => {
        spyOn(window, 'confirm').and.returnValue(true);
        libroServiceSpy.deleteLibro.and.returnValue(of({}));
        libroServiceSpy.getLibros.and.returnValue(of([]));

        component.deleteLibro(1);

        expect(libroServiceSpy.deleteLibro).toHaveBeenCalledWith(1);
        expect(alertServiceSpy.showAlert).toHaveBeenCalledWith({
            type: 'success',
            message: 'Libro eliminado exitosamente'
        });
        expect(libroServiceSpy.getLibros).toHaveBeenCalled();
    });

    describe('pruebas de ordenamiento', () => {
        beforeEach(() => {
            component.librosFiltrados = [
                { id: 1, titulo: 'Z Libro', autor: 'Z Autor', anioPublicacion: 2024, genero: 'genero 1' },
                { id: 2, titulo: 'A Libro', autor: 'A Autor', anioPublicacion: 2020, genero: 'genero 2' }
            ];
        });

        it('deberia ordenar libros por autor', () => {
            component.ordenarPor = 'autor';
            component.ordenAscendente = true;
            component.ordenarLibros();

            expect(component.librosFiltrados[0].autor).toBe('A Autor');
            expect(component.librosFiltrados[1].autor).toBe('Z Autor');
        });

        it('deberia ordenar libros por anio de publicacion', () => {
            component.ordenarPor = 'anio';
            component.ordenAscendente = true;
            component.ordenarLibros();

            expect(component.librosFiltrados[0].anioPublicacion).toBe(2020);
            expect(component.librosFiltrados[1].anioPublicacion).toBe(2024);
        });

        describe('pruebas de cambio de orden', () => {
            it('deberia invertir el orden cuando se selecciona el mismo campo', () => {
                // Estado inicial
                component.ordenarPor = 'titulo';
                component.ordenAscendente = true;

                // Cambiar orden del mismo campo
                component.cambiarOrden('titulo');

                expect(component.ordenarPor).toBe('titulo');
                expect(component.ordenAscendente).toBe(false);
            });

            it('deberia establecer orden ascendente cuando se cambia a un nuevo campo', () => {
                // Estado inicial
                component.ordenarPor = 'titulo';
                component.ordenAscendente = false;

                // Cambiar a un campo diferente
                component.cambiarOrden('autor');

                expect(component.ordenarPor).toBe('autor');
                expect(component.ordenAscendente).toBe(true);
            });

            it('deberia ordenar los libros despues de cambiar el orden', () => {
                spyOn(component, 'ordenarLibros');

                component.cambiarOrden('autor');

                expect(component.ordenarLibros).toHaveBeenCalled();
            });
        });
    });
});