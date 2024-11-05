import { Routes } from '@angular/router';
import { LibroListComponent } from './components/libros/libro-list/libro-list.component';
import { LibroCreateComponent } from './components/libros/libro-create/libro-create.component';
import { LibroDetailComponent } from './components/libros/libro-detail/libro-detail.component';
import { LibroEditComponent } from './components/libros/libro-edit/libro-edit.component';

export const routes: Routes = [
  { path: '', redirectTo: '/libros', pathMatch: 'full' },
  { path: 'libros', component: LibroListComponent },
  { path: 'libros/create', component: LibroCreateComponent },
  { path: 'libros/:id', component: LibroDetailComponent },
  { path: 'libros/edit/:id', component: LibroEditComponent }
];