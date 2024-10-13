import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarUsuariorolComponent } from './registrar-usuariorol.component';

describe('RegistrarUsuariorolComponent', () => {
  let component: RegistrarUsuariorolComponent;
  let fixture: ComponentFixture<RegistrarUsuariorolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarUsuariorolComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarUsuariorolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
