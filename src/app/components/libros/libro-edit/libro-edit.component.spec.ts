import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibroEditComponent } from './libro-edit.component';

describe('LibroEditComponent', () => {
  let component: LibroEditComponent;
  let fixture: ComponentFixture<LibroEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibroEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibroEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
