import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ErrorGenerator } from "src/app/app.helpers";
import { Generics } from "src/app/models/generics";
import { BannerService } from "src/app/service/banner.service";

@Component({
    selector: "app-create-banner",
    templateUrl: "./create_banner.component.html",
    styleUrls: ["./banner_styles.component.scss"]
})
export class CreateBanner implements OnInit{
    formControlData: Generics = {}
    loading: boolean = false
    
    constructor(
        private bannerService: BannerService,
        private router: Router,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.setControlStates()
    }

    closeForm(): void {
        this.setControlStates()
    }

    create(eventPayload: {[key: string]: FormControl}): void {
        const payload: Generics = {
            title: eventPayload.title.value,
            article: eventPayload.article.value,
            expired_date: eventPayload.expired_date.value,
            tenant_id: eventPayload.tenant_id.value,
            is_default: eventPayload.is_default.value,
            image: eventPayload.image
        }

        console.log(payload)

        // this.loading = true
        // this.bannerService.doRegister(payload)
        //     .then(() => this.router.navigate(["user"]))
        //     .catch((error) => {
        //         const exception = new ErrorGenerator(error, this.dialog)
        //         exception.throwError()
        //     })
        //     .finally(() => this.loading = false)
    }

    setControlStates(): void {
        this.formControlData = {
            title: "",
            article: "",
            expired_date: "",
            tenant_id: "",
            is_default: "false",
        }
    }
}