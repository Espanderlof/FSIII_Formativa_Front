import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LibroCreateComponent } from './libro-create.component';
import { LibroService } from '../../../services/libro.service';
import { AlertService } from '../../../services/alert.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Libro } from '../../../models/libro.model';

describe('pruebas del componente de creacion de libros', () => {
  let component: LibroCreateComponent;
  let fixture: ComponentFixture<LibroCreateComponent>;
  let libroServiceSpy: jasmine.SpyObj<LibroService>;
  let alertServiceSpy: jasmine.SpyObj<AlertService>;
  let routerSpy: jasmine.SpyObj<Router>;

  // configuracion inicial antes de cada prueba
  beforeEach(async () => {
    // creamos espias para los servicios que necesitamos simular
    libroServiceSpy = jasmine.createSpyObj('LibroService', ['createLibro']);
    alertServiceSpy = jasmine.createSpyObj('AlertService', ['showAlert']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    
    // creamos un mock completo de ParamMap
    const mockParamMap: ParamMap = {
      get: (name: string) => null,
      has: (name: string) => false,
      getAll: (name: string) => [],
      keys: [] as string[]
    };

    const mockActivatedRoute = {
      snapshot: {
        paramMap: mockParamMap
      }
    };

    await TestBed.configureTestingModule({
      imports: [LibroCreateComponent, FormsModule],
      providers: [
        { provide: LibroService, useValue: libroServiceSpy },
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LibroCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deberia crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('deberia inicializar con un objeto libro vacio', () => {
    expect(component.libro).toBeDefined();
    expect(component.libro.titulo).toBe('');
    expect(component.libro.autor).toBe('');
    expect(component.libro.anioPublicacion).toBe(0);
    expect(component.libro.genero).toBe('');
  });

  it('deberia crear un libro y navegar a la lista cuando el envio es exitoso', () => {
    // preparamos los datos de prueba
    const mockLibro: Libro = {
      titulo: 'Test Libro',
      autor: 'Test Autor',
      anioPublicacion: 2024,
      genero: 'Test Genero'
    };
    
    // creamos un libro de respuesta que simula la respuesta del servidor
    const mockLibroResponse: Libro = {
      ...mockLibro,
      id: 1
    };
    
    // configuramos el componente con los datos de prueba
    component.libro = mockLibro;
    libroServiceSpy.createLibro.and.returnValue(of(mockLibroResponse));

    // ejecutamos la accion a probar
    component.onSubmit();

    // verificamos que se llamaron los metodos esperados con los parametros correctos
    expect(libroServiceSpy.createLibro).toHaveBeenCalledWith(mockLibro);
    expect(alertServiceSpy.showAlert).toHaveBeenCalledWith({
      type: 'success',
      message: 'Libro creado exitosamente'
    });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/libros']);
  });
});