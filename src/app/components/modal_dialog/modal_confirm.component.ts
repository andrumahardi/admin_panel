import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Generics } from "src/app/models/generics";

@Component({
    template: `
    <h3 mat-dialog-title>Delete Confirmation</h3>
    <div mat-dialog-content class="content">
      <p>Are you sure want to delete this?</p>
    </div>
    <div mat-dialog-actions class="btn-group">
      <button 
        mat-button 
        class="outline-cancel-btn"
        (click)="close()"> No </button>
      <button 
        mat-button 
        class="full-primary-btn"
        [mat-dialog-close]="data.id"> Sure </button>
    </div>
    `,
    styleUrls: ["./modal_confirm.component.scss"]
})
export class ConfirmDeleteDialog{
    constructor(
        public dialogRef: MatDialogRef<ConfirmDeleteDialog>,
        @Inject(MAT_DIALOG_DATA) public data: Generics
    ) {}

    close() {
        this.dialogRef.close()
    }
}

@Component({
  template: `
  <h3 mat-dialog-title>Action failed</h3>
  <div mat-dialog-content class="content">
    <p>{{data.message}}</p>
  </div>
  <div mat-dialog-actions class="btn-group">
    <button 
      mat-button 
      class="outline-primary-btn"
      (click)="close()">
      Ok
    </button>
  </div>
  `,
  styleUrls: ["./modal_confirm.component.scss"]
})
export class ErrorPopup{
  constructor(
      public dialogRef: MatDialogRef<ErrorPopup>,
      @Inject(MAT_DIALOG_DATA) public data: Generics
  ) {}

  close() {
      this.dialogRef.close()
  }
}

@Component({
  template: `
  <h3 mat-dialog-title>Change Confirmation</h3>
  <div mat-dialog-content class="content">
    <p>Are you sure want to commit change for this record?</p>
  </div>
  <div mat-dialog-actions class="btn-group">
    <button 
      mat-button 
      class="outline-cancel-btn"
      [mat-dialog-close]="!data.confirmed"> No </button>
    <button 
      mat-button 
      class="full-primary-btn"
      [mat-dialog-close]="data.confirmed"> Sure </button>
  </div>
  `,
  styleUrls: ["./modal_confirm.component.scss"]
})
export class ConfirmUpdateDialog{
  constructor(
      public dialogRef: MatDialogRef<ConfirmUpdateDialog>,
      @Inject(MAT_DIALOG_DATA) public data: Generics
  ) {}
}

@Component({
  template: `
  <h3 mat-dialog-title>Action Result</h3>
  <div mat-dialog-content class="content">
    <p>Email verification has been sent to {{data.email}}</p>
  </div>
  <div mat-dialog-actions class="btn-group">
    <button 
      mat-button
      (click)="close()"
      class="full-primary-btn">
      Ok 
    </button>
  </div>
  `,
  styleUrls: ["./modal_confirm.component.scss"]
})
export class EmailVerificationSent{
  constructor(
    public dialogRef: MatDialogRef<ConfirmUpdateDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Generics
  ) {}

  close(): void {
    this.dialogRef.close()
  }
}