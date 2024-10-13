import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarUsuariorolComponent } from './editar-usuariorol.component';

describe('EditarUsuariorolComponent', () => {
  let component: EditarUsuariorolComponent;
  let fixture: ComponentFixture<EditarUsuariorolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarUsuariorolComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarUsuariorolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
