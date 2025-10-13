import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-matdialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './matdialog.component.html',
  styleUrl: './matdialog.component.css'
})
export class MatdialogComponent {
  constructor(private dialogRef: MatDialogRef<MatdialogComponent>) { }

  cancelar() {
    this.dialogRef.close(false);
  }

  confirmar() {
    this.dialogRef.close(true);
  }
}
