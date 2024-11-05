import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Libro } from '../../../models/libro.model';
import { LibroService } from '../../../services/libro.service';
import { AlertService } from '../../../services/alert.service';

@Component({
    selector: 'app-libro-create',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './libro-create.component.html',
    styleUrl: './libro-create.component.scss'
})
export class LibroCreateComponent {
    libro: Libro = {
        titulo: '',
        autor: '',
        anioPublicacion: 0,
        genero: ''
    };

    constructor(
        private libroService: LibroService,
        private router: Router,
        private alertService: AlertService
    ) { }

    onSubmit(): void {
        this.libroService.createLibro(this.libro)
            .subscribe({
                next: () => {
                    this.alertService.showAlert({
                        type: 'success',
                        message: 'Libro creado exitosamente'
                    });
                    this.router.navigate(['/libros']);
                }
            });
    }
}