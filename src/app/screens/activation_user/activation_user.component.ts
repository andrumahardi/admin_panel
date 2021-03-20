import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Generics } from "src/app/models/generics";
import { UserService } from "src/app/service/user.service";

@Component({
    selector: "app-activation-user",
    template: `
        <div
            *ngIf="confirmationSuccess"
            style="width: 100%; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center;">
            <h3 style="font-size: 20pt;">
                Welcome aboard!
            </h3>
            <p style="font-size: 12pt;">
                Since you have been confirmed, please login to your ebesha account
            </p>
        </div>
        <div
            *ngIf="confirmationFailed"
            style="width: 100%; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center;">
            <h3 style="font-size: 20pt;">
                Confirmation Failed ;(
            </h3>
            <p style="font-size: 12pt;">
                You may have been activated earlier.
                Please tell our support center. 
                We will be happy to help you
            </p>
        </div>
        <div 
            *ngIf="!confirmationSuccess && !confirmationFailed"
            style="width: 100%; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center;">
            <h3 style="font-size: 20pt;">
                Please wait...
            </h3>
            <p style="font-size: 12pt;">
                We are still processing your confirmation.
            </p>
        </div>`
})

export class ActivationUser implements OnInit{
    confirmationSuccess: boolean = false
    confirmationFailed: boolean = false

    constructor(
        private route: ActivatedRoute,
        private userService: UserService
    ){}

    ngOnInit(): void {
        this.route.params
            .subscribe(({ id, token }: Generics): void => {
                this.activationProcess(id, token)
            })
    }

    private async activationProcess(id: number, token: string): Promise<void> {
        this.userService.doActivate(id, `Token ${token}`)
            .then(() => this.confirmationSuccess = true)
            .catch(() => this.confirmationFailed = true)
    }
}