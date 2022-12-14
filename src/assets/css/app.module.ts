import { FinderSessionComponent } from '../../app/modules/finder-session/finder-session.component';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//
import { AppRoutingModule } from '../../app/app-routing.module';
import { AppComponent } from '../../app/app.component';
import { FinderResultComponent } from '../../app/modules/finder-result/finder-result.component';
import { FinderComponent } from '../../app/modules/finder/finder.component';
import { SharedModule } from '../../app/shared/shared.module';

const COMPONENTS = [FinderComponent, FinderResultComponent, FinderSessionComponent];

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
