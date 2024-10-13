import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarSolicitudesComponent } from './listar-solicitudes.component';

describe('ListarSolicitudesComponent', () => {
  let component: ListarSolicitudesComponent;
  let fixture: ComponentFixture<ListarSolicitudesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarSolicitudesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarSolicitudesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
