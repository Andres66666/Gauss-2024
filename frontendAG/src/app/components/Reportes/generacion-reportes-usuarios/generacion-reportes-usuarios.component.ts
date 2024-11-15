import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Usuario } from '../../MadreUsuario/models/usuario';
import { UsuarioService } from '../../MadreUsuario/services/usuario.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-generacion-reportes-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  templateUrl: './generacion-reportes-usuarios.component.html',
  styleUrls: ['./generacion-reportes-usuarios.component.css'],
})
export class GeneracionReportesUsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  filteredUsuarios: Usuario[] = []; // New property for filtered results

  searchnombreUsuario: string = ''; // Nuevo campo para el nombre
  searchapellido: string = ''; // Nuevo campo para el apellido
  searchdepartamento: string = ''; // Nuevo campo para el departamento

  searchFechaInicio: string = ''; // Nuevo campo para el apellido
  searchFechaFin: string = ''; // Nuevo campo para el departamento
  searchObra: string = ''; // Nuevo campo para el departamento

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.getUsuarios();
  }

  getUsuarios() {
    this.usuarioService.getUsuarios().subscribe((data) => {
      this.usuarios = data;
      this.filteredUsuarios = data; // Initialize filteredUsuarios with all users
      this.ordenarUsuariosPorId();
    });
  }

  filterUsuarios() {
    this.filteredUsuarios = this.usuarios.filter((usuario) => {
      const fechaCreacion = new Date(usuario.fecha_creacion);
      const fechaInicio = this.searchFechaInicio
        ? new Date(this.searchFechaInicio)
        : null;
      const fechaFin = this.searchFechaFin
        ? new Date(this.searchFechaFin)
        : null;

      return (
        (this.searchnombreUsuario
          ? usuario.nombreUsuario
              .toLowerCase()
              .includes(this.searchnombreUsuario.toLowerCase())
          : true) &&
        (this.searchapellido
          ? usuario.apellido
              .toLowerCase()
              .includes(this.searchapellido.toLowerCase())
          : true) &&
        (this.searchdepartamento
          ? usuario.departamento
              .toLowerCase()
              .includes(this.searchdepartamento.toLowerCase())
          : true) &&
        (this.searchObra
          ? this.getNombreObra(usuario)
              .toLowerCase()
              .includes(this.searchObra.toLowerCase())
          : true) && // Filtrar por obra
        (fechaInicio ? fechaCreacion >= fechaInicio : true) && // Filtrar por fecha de inicio
        (fechaFin ? fechaCreacion <= fechaFin : true) // Filtrar por fecha de fin
      );
    });
  }
  ordenarUsuariosPorId() {
    this.usuarios.sort((a, b) => a.id - b.id); // Ordenar por ID en orden ascendente
  }

  // Nueva función para obtener el nombre de la obra
  getNombreObra(usuario: Usuario): string {
    return usuario.obra && usuario.obra.nombreObra
      ? usuario.obra.nombreObra
      : 'Sin asignar';
  }

  // Método para generar el reporte
  generarReporte() {
    const reportData = this.filteredUsuarios.map((usuario) => ({
      'Fecha Creación': usuario.fecha_creacion,
      Nombre: usuario.nombreUsuario,
      Apellido: usuario.apellido,
      Correo: usuario.correo,
      Teléfono: usuario.telefono,
      'C.I.': usuario.ci,
      'D.P.': usuario.departamento,
      Obra: this.getNombreObra(usuario),
      Estado: usuario.activo ? 'Activo' : 'Inactivo',
    }));

    // Aquí puedes implementar la lógica para exportar reportData a un archivo
    console.log(reportData); // Para pruebas, muestra los datos en la consola

    // Ejemplo: Lógica para exportar a CSV
    this.exportToCSV(reportData);
  }

  // Método para exportar a CSV
  exportToCSV(data: any[]) {
    const csvRows = [];
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(','));

    for (const row of data) {
      csvRows.push(
        headers
          .map((header) =>
            JSON.stringify(row[header], (key, value) =>
              value === null ? '' : value
            )
          )
          .join(',')
      );
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'reporte_usuarios.csv');
    a.click();
  }
  generarPDF() {
    const data = document.getElementById('tabla-usuarios'); // Asegúrate de que el ID coincida con el de la tabla

    if (data) {
      // Ocultar temporalmente el botón "Generar Reporte"
      const pdfButton = document.getElementById('btn-generar-pdf');
      if (pdfButton) pdfButton.style.display = 'none';

      // Generar el PDF
      html2canvas(data).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgWidth = 190;
        const pageHeight = pdf.internal.pageSize.height;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        // Guardar el PDF
        pdf.save('reporte_usuarios.pdf');

        // Restaurar la visibilidad del botón "Generar Reporte"
        if (pdfButton) pdfButton.style.display = '';
      });
    }
  }
}
