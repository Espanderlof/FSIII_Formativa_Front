import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LibroDetailComponent } from './libro-detail.component';
import { LibroService } from '../../../services/libro.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('pruebas del componente de detalle de libros', () => {
  let component: LibroDetailComponent;
  let fixture: ComponentFixture<LibroDetailComponent>;
  let libroServiceSpy: jasmine.SpyObj<LibroService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;

  // configuracion inicial antes de cada prueba
  beforeEach(async () => {
    // creamos espias para los servicios que necesitamos simular
    libroServiceSpy = jasmine.createSpyObj('LibroService', ['getLibro']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: () => '1' // simula el id en la url
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [LibroDetailComponent],
      providers: [
        { provide: LibroService, useValue: libroServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LibroDetailComponent);
    component = fixture.componentInstance;
  });

  it('deberia crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('deberia cargar los detalles del libro al inicializar', () => {
    // preparamos los datos de prueba
    const mockLibro = {
      id: 1,
      titulo: 'Test Libro',
      autor: 'Test Autor',
      anioPublicacion: 2024,
      genero: 'Test Genero'
    };

    // configuramos el servicio mock para retornar nuestro libro de prueba
    libroServiceSpy.getLibro.and.returnValue(of(mockLibro));

    // ejecutamos la inicializacion del componente
    component.ngOnInit();

    // verificamos que se llamo al servicio con el id correcto y que se guardo el libro
    expect(libroServiceSpy.getLibro).toHaveBeenCalledWith(1);
    expect(component.libro).toEqual(mockLibro);
  });

  it('deberia redirigir a la lista de libros cuando hay un error al cargar', () => {
    // configuramos el servicio mock para simular un error
    libroServiceSpy.getLibro.and.returnValue(throwError(() => new Error('Error de carga')));

    // ejecutamos la inicializacion del componente
    component.ngOnInit();

    // verificamos que se redirige al usuario a la lista de libros
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/libros']);
  });
});