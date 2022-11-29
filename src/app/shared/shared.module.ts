import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SwiperModule } from 'swiper/angular';
import { RouterModule } from '@angular/router';
// components
import { SwiperTemplateComponent } from './components/swiper-template/swiper-template.component';
import { SvgIconComponent } from './components/svg-icon/svg-icon.component';
import { SvgIconsRegistryService } from './services/svg-icon-registry.service';
import { completeIconSet } from 'src/assets/images/svg-icons.constants';
import { UploadImageComponent } from './components/upload-image/upload-image.component';

const COMPONENTS: any[] = [
  SvgIconComponent,
  SwiperTemplateComponent,
  UploadImageComponent
];

const SVG_ICONS = completeIconSet;

@NgModule({
  imports: [
    CommonModule,
    SwiperModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([])
  ],
  exports: [...COMPONENTS],
  declarations: [...COMPONENTS],
  providers: [
    SvgIconsRegistryService,
  ]
})
export class SharedModule {
  constructor(private svgIconRegistry: SvgIconsRegistryService) {
    svgIconRegistry.registerIcons(SVG_ICONS);
  }
}
