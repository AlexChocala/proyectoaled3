import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-matdialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './matdialog.component.html',
  styleUrl: './matdialog.component.css'
})
export class MatdialogComponent {
  constructor(
    private dialogRef: MatDialogRef<MatdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      titulo: string;
      mensaje: string;
      textoConfirmar?: string;
      colorConfirmar?: string;
    }
  ) {}

  cancelar() {
    this.dialogRef.close(false);
  }

  confirmar() {
    this.dialogRef.close(true);
  }
}
