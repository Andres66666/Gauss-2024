import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarSolicitudesComponent } from './editar-solicitudes.component';

describe('EditarSolicitudesComponent', () => {
  let component: EditarSolicitudesComponent;
  let fixture: ComponentFixture<EditarSolicitudesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarSolicitudesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarSolicitudesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
