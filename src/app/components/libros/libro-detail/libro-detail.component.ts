import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Libro } from '../../../models/libro.model';
import { LibroService } from '../../../services/libro.service';

@Component({
  selector: 'app-libro-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './libro-detail.component.html',
  styleUrl: './libro-detail.component.scss'
})
export class LibroDetailComponent implements OnInit {
  libro?: Libro;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private libroService: LibroService
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
}