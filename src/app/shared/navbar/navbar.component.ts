import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; //para el ruterlink
// importacion submenu
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
// fin

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, MatButtonModule, MatMenuModule, MatIconModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  email: string = "mailREGISTRADO@gmail.com";


}
