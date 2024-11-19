
<h1 align="center">T i e n d a - O n l i n e</h1>

<p align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/c/cf/Angular_full_color_logo.svg" alt="Angular Logo" width="100"/>
  <img src="https://www.opengis.ch/wp-content/uploads/2020/04/django-python-logo.png" alt="Django Logo" width="100"/>
  <img src="https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg" alt="PostgreSQL Logo" width="100"/>
</p>



<table>
  <tr>
    <td><h1>Framework Django</h1></td>
    <td><img src="https://www.opengis.ch/wp-content/uploads/2020/04/django-python-logo.png" alt="Django Logo" width="100"/></td>
  </tr>
</table>


## Instalaciones

Para comenzar a usar este proyecto, necesitarás instalar las siguientes dependencias:

```bash
# Instalar virtualenv, que te permitirá crear un entorno aislado
pip install virtualenv

# Crear un entorno virtual
virtualenv venv

# O para activar en Windows
env\Scripts\activate
./venv/Scripts/activate   

# Instalar Django, el framework principal para el backend
pip install django

# Crear un nuevo proyecto Django
django-admin startproject tienda_online

```
## Otras dependencias importantes
Aquí se listan más paquetes que puedes necesitar para tu proyecto Django:
```bash
# Instalar Django REST Framework, necesario si planeas crear APIs
pip install djangorestframework
pip install djangorestframework-simplejwt

# Instalar django-cors-headers, útil para manejar las solicitudes entre el frontend (Angular) y el backend (Django)
pip install django-cors-headers

# Instalar psycopg2, necesario para conectarse a bases de datos PostgreSQL
pip install psycopg2

```

## Creación de archivos
```bash
# Crear un nuevo proyecto Django llamado 'main'
django-admin startproject main .

# Crear una nueva aplicación dentro del proyecto llamada 'users'
django-admin startapp users

```
## Migraciones
Las migraciones en Django permiten que los cambios en los modelos de la base de datos se reflejen de manera automática. Aquí están los comandos para hacer migraciones y aplicar los cambios:
```bash
# Crear migraciones para la app 'users'
python manage.py makemigrations users

# Aplicar las migraciones
python manage.py migrate

# Crear un superusuario para acceder al panel de administración de Django
python manage.py createsuperuser

# Iniciar el servidor local para probar la aplicación
python manage.py runserver

```

## Configuración avanzada
Si necesitas almacenamiento en la nube o configuraciones adicionales, aquí hay algunos paquetes adicionales que podrías necesitar:
```bash
pip install boto3
pip install botocore
pip install django-storages[azure]     
pip install azure-identity                                   
pip install django-environ                                                                                
```

<table>
  <tr>
    <td><h1>Framework Angular</h1></td>
    <td> <img src="https://upload.wikimedia.org/wikipedia/commons/c/cf/Angular_full_color_logo.svg" alt="Angular Logo" width="100"/></td>
  </tr>
</table>

## Instalaciones
Aquí te indico los comandos necesarios para crear y configurar un proyecto en Angular. Angular es el framework que utilizaremos para el frontend.


```bash
# Crear un nuevo proyecto Angular llamado 'frontend'
ng new frontend

# Moverse al directorio del proyecto
cd frontend

# Instalar Angular Material, un conjunto de componentes UI de Angular
ng add @angular/material

# Instalar Bootstrap para estilos CSS y diseño responsivo
npm install bootstrap

# Instalar iconos adicionales
npm install bootstrap-icons
npm install @fortawesome/fontawesome-free

# Instalar Popper.js, que es una dependencia de Bootstrap para algunos componentes
npm install @popperjs/core

# Añadir soporte para HTTP, útil para hacer solicitudes al backend
ng add @angular/common/http
npm install @angular/common@latest
                                                                          
```
## Generación de servicios y componentes
En Angular, los servicios son útiles para manejar la lógica de negocio y los componentes son las piezas que construyen la interfaz. Aquí tienes comandos para generar diferentes servicios y componentes para tu proyecto:
```bash
# Generar un servicio para usuarios como ejemplo
ng generate service services/Usuario

# Generar componentes para la gestión de solicitudes
ng generate component components/MadreUsuario/registrar-Usuario
ng generate component components/MadreUsuario/listar-Usuario
ng generate component components/MadreUsuario/editar-Usuario

# para crear en las mismas carpetas usa estos comandos
# Generar un servicio para manejar solicitudes
ng generate service components/MadreUsuario/services/Usuario

# Generar una clase para el modelo de solicitudes
ng generate class components/MadreUsuario/models/Usuario
                                                                           
```

## Ejecutar el proyecto
Para iniciar el servidor de desarrollo y probar tu proyecto Angular, ejecuta:

```bash
# Ejecutar el proyecto en el servidor local
ng serve
```

<table>
  <tr>
    <td><h1>Base de datos PostgreSQL</h1></td>
    <td><img src="https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg" alt="PostgreSQL Logo" width="100"/></td>
  </tr>
</table>

## Creacion del servidor 

## Creacion y configuracion de la base datos



<table>
  <tr>
    <td><h1>Implementacion de PDF</h1></td>
    <td><img
        src="https://png.pngtree.com/png-vector/20231116/ourmid/pngtree-pdf-icon-doc-png-image_10541408.png"
        width="100"
        height="100"
        alt="PDF Icon"
      /></td>
  </tr>
</table>

## Instalar jspdf y html2canvas
```bash
# Ejecutar el proyecto en el Frontend
npm install html2canvas --save
npm install jspdf

```

## implementacion


```bash
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

 generarPDF() {
    const DATA: any = document.getElementById('tabla-detalle-venta');
    html2canvas(DATA).then(canvas => {
      const doc = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 190; // Ajustar al ancho de la página A4
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;

      doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      doc.save('DetalleVenta.pdf');
    });
  }
```

este comando es es para actualizar los cambios de git 
git pull


