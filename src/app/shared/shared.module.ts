import { FinderComponent } from './../modules/finder/finder.component';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SwiperModule } from 'swiper/angular';
import { RouterModule } from '@angular/router';
// components
import { SwiperTemplateComponent } from './components/swiper-template/swiper-template.component';
import { UploadImageComponent } from './components/upload-image/upload-image.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { SelectBoxComponent } from './components/select-box/select-box.component';
import { CardImageComponent } from './components/card-image/card-image.component';
import { FooterComponent } from './components/footer/footer.component';
import { SkeletonComponent } from './components/skeleton/skeleton.component';

const COMPONENTS: any[] = [
  SwiperTemplateComponent,
  UploadImageComponent,
  SearchBarComponent,
  SelectBoxComponent,
  CardImageComponent,
  FooterComponent,
  SkeletonComponent,
  FinderComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([])
  ],
  exports: [...COMPONENTS],
  declarations: [...COMPONENTS],
  providers: []
})
export class SharedModule {}
