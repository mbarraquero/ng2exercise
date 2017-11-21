import { Routes } from '@angular/router';
import { AuthGuard } from './guards';
import { LoginComponent, SessionComponent, FeedsComponent, ProfileComponent } from './components';

export const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: '', component: SessionComponent,
        canActivate: [AuthGuard],
        children: [
            { path: 'feed', component: FeedsComponent },
            { path: 'profile/:id', component: ProfileComponent },
            { path: '**', redirectTo: '/login', pathMatch: 'full' }
        ]
    },
    { path: 'error', component: LoginComponent }
];