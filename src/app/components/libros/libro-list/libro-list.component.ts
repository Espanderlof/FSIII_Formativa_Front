import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Libro } from '../../../models/libro.model';
import { LibroService } from '../../../services/libro.service';
import { AlertService } from '../../../services/alert.service';

@Component({
    selector: 'app-libro-list',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './libro-list.component.html',
    styleUrl: './libro-list.component.scss'
})
export class LibroListComponent implements OnInit {
    libros: Libro[] = [];
    librosFiltrados: Libro[] = [];
    busqueda: string = '';
    filtroGenero: string = '';
    generos: string[] = [];
    ordenarPor: string = 'titulo';
    ordenAscendente: boolean = true;

    constructor(
        private libroService: LibroService,
        private alertService: AlertService
    ) { }

    ngOnInit(): void {
        this.loadLibros();
    }

    loadLibros(): void {
        this.libroService.getLibros()
            .subscribe(data => {
                this.libros = data;
                this.librosFiltrados = data;
                this.extraerGeneros();
                this.aplicarFiltros();
            });
    }

    extraerGeneros(): void {
        this.generos = [...new Set(this.libros.map(libro => libro.genero))];
    }

    aplicarFiltros(): void {
        this.librosFiltrados = this.libros
            .filter(libro => {
                const coincideBusqueda = libro.titulo.toLowerCase().includes(this.busqueda.toLowerCase()) ||
                    libro.autor.toLowerCase().includes(this.busqueda.toLowerCase());
                const coincideGenero = !this.filtroGenero || libro.genero === this.filtroGenero;
                return coincideBusqueda && coincideGenero;
            });

        this.ordenarLibros();
    }

    ordenarLibros(): void {
        this.librosFiltrados.sort((a, b) => {
            let comparacion = 0;
            if (this.ordenarPor === 'titulo') {
                comparacion = a.titulo.localeCompare(b.titulo);
            } else if (this.ordenarPor === 'autor') {
                comparacion = a.autor.localeCompare(b.autor);
            } else if (this.ordenarPor === 'anio') {
                comparacion = a.anioPublicacion - b.anioPublicacion;
            }
            return this.ordenAscendente ? comparacion : -comparacion;
        });
    }

    cambiarOrden(campo: string): void {
        if (this.ordenarPor === campo) {
            this.ordenAscendente = !this.ordenAscendente;
        } else {
            this.ordenarPor = campo;
            this.ordenAscendente = true;
        }
        this.ordenarLibros();
    }

    deleteLibro(id: number): void {
        if (confirm('¿Está seguro de eliminar este libro?')) {
            this.libroService.deleteLibro(id)
                .subscribe({
                    next: () => {
                        this.alertService.showAlert({
                            type: 'success',
                            message: 'Libro eliminado exitosamente'
                        });
                        this.loadLibros();
                    }
                });
        }
    }
}