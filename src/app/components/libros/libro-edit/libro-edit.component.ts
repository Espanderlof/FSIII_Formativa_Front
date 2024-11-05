import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Libro } from '../../../models/libro.model';
import { LibroService } from '../../../services/libro.service';
import { AlertService } from '../../../services/alert.service';

@Component({
    selector: 'app-libro-edit',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './libro-edit.component.html',
    styleUrl: './libro-edit.component.scss'
})
export class LibroEditComponent implements OnInit {
    libro: Libro = {
        titulo: '',
        autor: '',
        anioPublicacion: 0,
        genero: ''
    };

    constructor(
        private libroService: LibroService,
        private router: Router,
        private route: ActivatedRoute,
        private alertService: AlertService
    ) { }

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.loadLibro(id);
    }

    loadLibro(id: number): void {
        this.libroService.getLibro(id).subscribe({
            next: (data) => {
                this.libro = data;
            },
            error: () => {
                this.router.navigate(['/libros']);
            }
        });
    }

    onSubmit(): void {
        if (this.libro.id) {
            this.libroService.updateLibro(this.libro.id, this.libro)
                .subscribe({
                    next: () => {
                        this.alertService.showAlert({
                            type: 'success',
                            message: 'Libro actualizado exitosamente'
                        });
                        this.router.navigate(['/libros']);
                    }
                });
        }
    }
}