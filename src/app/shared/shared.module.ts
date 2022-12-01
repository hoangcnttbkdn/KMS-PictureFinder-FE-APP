import { FinderComponent } from './../modules/finder/finder.component';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// components
import { UploadImageComponent } from './components/upload-image/upload-image.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { SelectBoxComponent } from './components/select-box/select-box.component';
import { CardImageComponent } from './components/card-image/card-image.component';
import { FooterComponent } from './components/footer/footer.component';
import { SkeletonComponent } from './components/skeleton/skeleton.component';
import { ToastComponent } from './components/toast/toast.component';

const COMPONENTS: any[] = [
  SearchBarComponent,
  SelectBoxComponent,
  CardImageComponent,
  FooterComponent,
  SkeletonComponent,
  FinderComponent,
  FooterComponent,
  UploadImageComponent,
  ToastComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([])
  ],
  declarations: [
    ...COMPONENTS
  ],
  exports: [
    ...COMPONENTS
  ]
})
export class SharedModule { }