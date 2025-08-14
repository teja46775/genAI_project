import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SubscriptionListComponent } from './components/subscription-list/subscription-list.component';
import { SubscriptionFormComponent } from './components/subscription-form/subscription-form.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'subscriptions', component: SubscriptionListComponent, canActivate: [AuthGuard] },
  { path: 'subscriptions/new', component: SubscriptionFormComponent, canActivate: [AuthGuard] },
  { path: 'subscriptions/edit/:id', component: SubscriptionFormComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }