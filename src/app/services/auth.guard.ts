import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { tap } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  return inject(AuthService)
    .isAuth()
    .pipe(
      tap((estado) => {
        if (!estado) {
          router.navigate(['/login']);
        }
      })
    );
};

// @Inject({
//   providedIn: 'root',
// })
// export class authGuard implements CanActivate {
//   constructor(private authService: AuthService, private router: Router) {}
//   canActivate(): Observable<boolean> {
//     return this.authService.isAuth().pipe(
//       tap((estado) => {
//         if (!estado) {
//           this.router.navigate(['/login']);
//         }
//       })
//     );
//   }
// }
