import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FinderResultComponent } from './modules/finder-result/finder-result.component';
import { FinderComponent } from './modules/finder/finder.component';
import { SharedModule } from './shared/shared.module';

const COMPONENTS = [FinderComponent, FinderResultComponent];

@NgModule({
  declarations: [...COMPONENTS, AppComponent],
  exports: [...COMPONENTS],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    SharedModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
