import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarEquiposComponent } from './registrar-equipos.component';

describe('RegistrarEquiposComponent', () => {
  let component: RegistrarEquiposComponent;
  let fixture: ComponentFixture<RegistrarEquiposComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarEquiposComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarEquiposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
