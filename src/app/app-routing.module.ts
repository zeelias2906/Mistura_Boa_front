import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicLayoutComponent } from './core/components/public-layout/public-layout.component';
import { AdminLayoutComponent } from './core/components/admin-layout/admin-layout.component';
import { AuthGuard } from './core/interceptor/auth.guard';
import { SessionExpiredComponent } from './shared/components/session-expired/session-expired.component';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    component: AdminLayoutComponent,
    path: 'administrador',
    canActivate:[AuthGuard],
    loadChildren: () => import('./modules/admin/admin.module').then((m) => m.AdminModule),
  },
  {
    component: PublicLayoutComponent,
    path: '',
    loadChildren: () => import('./modules/public/public.module').then((m) => m.PublicModule),
  },
  {
    component: SessionExpiredComponent,
    path: 'session-expired',
    loadChildren: () => import('./modules/public/public.module').then((m) => m.PublicModule),
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '',
 },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
