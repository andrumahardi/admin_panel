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

    create(eventPayload: Generics): void {
        const payload: FormData = new FormData()
        payload.append("title", eventPayload.title.value)
        payload.append("article", eventPayload.article.value)
        payload.append("expired_date", `${eventPayload.expired_date.value}T23:59:59`)
        payload.append("tenant_id", eventPayload.tenant_id.value)
        payload.append("is_default", eventPayload.is_default.value)
        payload.append("image", eventPayload.image)

        this.loading = true
        this.bannerService.doCreate(payload)
            .then(() => this.router.navigate(["banner"]))
            .catch((error) => {
                const exception = new ErrorGenerator(error, this.dialog)
                exception.throwError()
            })
            .finally(() => this.loading = false)
    }

    setControlStates(): void {
        this.formControlData = {
            title: "",
            article: "",
            expired_date: "",
            tenant_id: "",
            is_default: "false",
            image_url: ""
        }
    }
}