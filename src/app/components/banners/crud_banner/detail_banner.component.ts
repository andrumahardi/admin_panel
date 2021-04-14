import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { ErrorGenerator, Helpers } from "src/app/app.helpers";
import { Generics } from "src/app/models/generics";
import { BannerService } from "src/app/service/banner.service";
import { ConfirmUpdateDialog } from "../../modal_dialog/modal_confirm.component";

@Component({
    selector: "app-detail-banner",
    templateUrl: "./detail_banner.component.html",
    styleUrls: ["banner_styles.component.scss"]
})
export class DetailBanner implements OnInit {
    editMode: boolean = false
    loading: boolean = false
    clearImage: boolean = false

    detailBanner: Generics = {}
    formControlData: Generics = {}
    
    constructor(
        private bannerService: BannerService, 
        private route: ActivatedRoute,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
        const promise = new Promise<number>((resolve) => {
            this.route.paramMap
                .subscribe(({ params }: Generics) => resolve(params.id))
        })
        promise.then(async (id: number) => {
            const data = await this.bannerService.getBanner(id)
            this.detailBanner = data
            this.setControlStates(data)
        })
        .catch((error) => {
            const exception = new ErrorGenerator(error, this.dialog)
            exception.throwError()
        })
    }

    update(eventPayload: Generics): void {
        this.clearImage = false
        
        const promise = new Promise<boolean>((resolve) => {
            this.dialog.open(ConfirmUpdateDialog, { data: { confirmed: true } })
            .afterClosed()
            .subscribe(async (confirmed: boolean): Promise<void> => resolve(confirmed))
        })
        promise.then(async (isConfirmed: boolean) => {
            if (isConfirmed) {
                this.loading = true
                
                const payload: FormData = new FormData()
                payload.append("title", eventPayload.title.value)
                payload.append("article", eventPayload.article.value)
                payload.append("expired_date", `${eventPayload.expired_date.value}T23:59:59`)
                payload.append("tenant_id", eventPayload.tenant_id.value)
                payload.append("is_default", eventPayload.is_default.value)
                payload.append("image", eventPayload.image)
        
                const data = await this.bannerService.doUpdate(payload, this.detailBanner.id)
                this.detailBanner = data.body

                this.closeForm()
                this.clearImage = true
            }
        })
            .catch((error) => {
                const exception = new ErrorGenerator(error, this.dialog)
                exception.throwError()
            })
            .finally(() => {
                this.loading = false
            })
    }

    closeForm(): void {
        this.editMode = false
        this.setControlStates(this.detailBanner)
    }

    setControlStates(data: Generics): void {
        this.formControlData = {
            title: data.title,
            article: data.article,
            expired_date: Helpers.parseDate(data.expired_date, Helpers.dateFormatConstraints.INPUT_TYPE_DATE),
            tenant_id: String(data.tenant),
            is_default: data.is_default ? "true" : "false",
            image_url: data.image_url
        }
    }
}