import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// components
import { UploadImageComponent } from './components/upload-image/upload-image.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { CardImageComponent } from './components/card-image/card-image.component';
import { FooterComponent } from './components/footer/footer.component';
import { SkeletonComponent } from './components/skeleton/skeleton.component';
import { ToastComponent } from './components/toast/toast.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeaderComponent } from './components/header/header.component';
import { FullscreenViewerComponent } from './components/fullscreen-viewer/fullscreen-viewer.component';
import { ImageGalleryComponent } from './components/image-gallery/image-gallery.component';
import { DownloadImageButtonComponent } from './components/download-image-button/download-image-button.component';

const COMPONENTS: any[] = [
  SearchBarComponent,
  CardImageComponent,
  FooterComponent,
  SkeletonComponent,
  FooterComponent,
  UploadImageComponent,
  ToastComponent,
  NavbarComponent,
  HeaderComponent,
  FullscreenViewerComponent,
  ImageGalleryComponent,
  DownloadImageButtonComponent
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