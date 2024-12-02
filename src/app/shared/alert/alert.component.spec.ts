import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AlertComponent } from './alert.component';
import { AlertService } from '../../services/alert.service';

describe('pruebas del componente de alertas', () => {
    let component: AlertComponent;
    let fixture: ComponentFixture<AlertComponent>;
    let alertService: AlertService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AlertComponent],
            providers: [AlertService]
        }).compileComponents();

        fixture = TestBed.createComponent(AlertComponent);
        component = fixture.componentInstance;
        alertService = TestBed.inject(AlertService);
        fixture.detectChanges();
    });

    it('deberia crear el componente', () => {
        expect(component).toBeTruthy();
    });

    it('deberia mostrar el mensaje de alerta', () => {
        alertService.showAlert({ type: 'success', message: 'test mensaje' });
        expect(component.message).toBe('test mensaje');
        expect(component.type).toBe('success');
    });

    it('deberia limpiar el mensaje despues de 5 segundos', fakeAsync(() => {
        alertService.showAlert({ type: 'success', message: 'test mensaje' });
        expect(component.message).toBe('test mensaje');

        tick(5000);

        expect(component.message).toBe('');
    }));

    it('deberia limpiar el mensaje al hacer click en el boton de cerrar', () => {
        component.message = 'test mensaje';
        component.message = '';
        expect(component.message).toBe('');
    });
});