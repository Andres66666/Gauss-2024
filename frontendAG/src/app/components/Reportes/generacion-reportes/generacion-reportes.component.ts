import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsuarioComponent } from '../../MadreUsuario/usuario/usuario.component';
import { ListarEquiposComponent } from '../../MadreEquipo/listar-equipos/listar-equipos.component';
import { ListarMantenimientoComponent } from '../../MadreManteniminiento/listar-mantenimiento/listar-mantenimiento.component';
import { ListarObraComponent } from '../../MadreObra/listar-obra/listar-obra.component';
import { GeneracionReportesUsuariosComponent } from '../generacion-reportes-usuarios/generacion-reportes-usuarios.component';
import { GeneracionReportesEquiposComponent } from '../generacion-reportes-equipos/generacion-reportes-equipos.component';
import { GeneracionReportesMantenimientosComponent } from '../generacion-reportes-mantenimientos/generacion-reportes-mantenimientos.component';
import { GeneracionReportesObrasComponent } from '../generacion-reportes-obras/generacion-reportes-obras.component';

@Component({
  selector: 'app-generacion-reportes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UsuarioComponent,
    ListarEquiposComponent,
    ListarMantenimientoComponent,
    ListarObraComponent,
    GeneracionReportesUsuariosComponent,
    GeneracionReportesEquiposComponent,
    GeneracionReportesMantenimientosComponent,
    GeneracionReportesObrasComponent,
  ],
  templateUrl: './generacion-reportes.component.html',
  styleUrls: ['./generacion-reportes.component.css'],
})
export class GeneracionReportesComponent {
  selectedReportType: string = '';

  // This method will be called when the report type is changed
  onReportTypeChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedReportType = selectElement.value;
  }
}
