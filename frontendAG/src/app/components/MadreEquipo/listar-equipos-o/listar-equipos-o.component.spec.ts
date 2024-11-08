import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarEquiposOComponent } from './listar-equipos-o.component';

describe('ListarEquiposOComponent', () => {
  let component: ListarEquiposOComponent;
  let fixture: ComponentFixture<ListarEquiposOComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarEquiposOComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarEquiposOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
