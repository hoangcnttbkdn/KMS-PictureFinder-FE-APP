import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { FinderComponent } from './modules/finder/finder.component';

const routes: Routes = [
  {
    path: '',
    component: FinderComponent,
  },
  // { path: '**', component: PageNotFoundComponent }
];

const config: ExtraOptions = {
  useHash: false,
  enableTracing: false
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
