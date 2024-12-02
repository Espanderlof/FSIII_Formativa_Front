import { TestBed } from '@angular/core/testing';
import { AlertService, Alert } from './alert.service';

describe('pruebas del servicio de alertas', () => {
  let service: AlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AlertService]
    });
    service = TestBed.inject(AlertService);
  });

  it('deberia crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('deberia emitir una alerta cuando se llama a showAlert', (done) => {
    const mockAlert: Alert = {
      type: 'success',
      message: 'test mensaje'
    };

    service.alert$.subscribe(alert => {
      expect(alert).toEqual(mockAlert);
      done();
    });

    service.showAlert(mockAlert);
  });
});