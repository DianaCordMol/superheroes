import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [LayoutComponent, NavbarComponent, FooterComponent],
  imports: [
    CommonModule,
    RouterModule,
  ],
})
export class LayoutModule { }
