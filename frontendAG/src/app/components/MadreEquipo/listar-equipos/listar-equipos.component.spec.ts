import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarEquiposComponent } from './listar-equipos.component';

describe('ListarEquiposComponent', () => {
  let component: ListarEquiposComponent;
  let fixture: ComponentFixture<ListarEquiposComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarEquiposComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarEquiposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
