import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LibroEditComponent } from './libro-edit.component';
import { LibroService } from '../../../services/libro.service';
import { AlertService } from '../../../services/alert.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Libro } from '../../../models/libro.model';

describe('pruebas del componente de edicion de libros', () => {
  let component: LibroEditComponent;
  let fixture: ComponentFixture<LibroEditComponent>;
  let libroServiceSpy: jasmine.SpyObj<LibroService>;
  let alertServiceSpy: jasmine.SpyObj<AlertService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let mockParamMap: ParamMap;

  beforeEach(async () => {
    libroServiceSpy = jasmine.createSpyObj('LibroService', ['getLibro', 'updateLibro']);
    alertServiceSpy = jasmine.createSpyObj('AlertService', ['showAlert']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    
    mockParamMap = {
      get: (param: string) => '1',
      has: (name: string) => true,
      getAll: (name: string) => [],
      keys: [] as string[]
    };

    await TestBed.configureTestingModule({
      imports: [LibroEditComponent, FormsModule],
      providers: [
        { provide: LibroService, useValue: libroServiceSpy },
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: Router, useValue: routerSpy },
        { 
          provide: ActivatedRoute, 
          useValue: { snapshot: { paramMap: mockParamMap } }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LibroEditComponent);
    component = fixture.componentInstance;
  });

  it('deberia crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('deberia cargar el libro al inicializar', () => {
    const mockLibro: Libro = {
      id: 1,
      titulo: 'Test Libro',
      autor: 'Test Autor',
      anioPublicacion: 2024,
      genero: 'Test Genero'
    };

    libroServiceSpy.getLibro.and.returnValue(of(mockLibro));

    fixture.detectChanges();

    expect(libroServiceSpy.getLibro).toHaveBeenCalledWith(1);
    expect(component.libro).toEqual(mockLibro);
  });

  it('deberia navegar a libros cuando falla la carga del libro', () => {
    libroServiceSpy.getLibro.and.returnValue(throwError(() => new Error()));

    fixture.detectChanges();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/libros']);
  });

  it('deberia actualizar el libro y navegar cuando el envio es exitoso', () => {
    const mockLibro: Libro = {
      id: 1,
      titulo: 'Test Libro',
      autor: 'Test Autor',
      anioPublicacion: 2024,
      genero: 'Test Genero'
    };

    component.libro = mockLibro;
    // Corregimos el tipo de retorno aquí
    libroServiceSpy.updateLibro.and.returnValue(of(mockLibro));

    component.onSubmit();

    expect(libroServiceSpy.updateLibro).toHaveBeenCalledWith(1, mockLibro);
    expect(alertServiceSpy.showAlert).toHaveBeenCalledWith({
      type: 'success',
      message: 'Libro actualizado exitosamente'
    });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/libros']);
  });
});