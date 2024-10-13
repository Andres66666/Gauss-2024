import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarRolpermisoComponent } from './editar-rolpermiso.component';

describe('EditarRolpermisoComponent', () => {
  let component: EditarRolpermisoComponent;
  let fixture: ComponentFixture<EditarRolpermisoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarRolpermisoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarRolpermisoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
