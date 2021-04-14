import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { PageEvent } from "@angular/material/paginator";
import { Sort } from "@angular/material/sort";
import { ErrorGenerator, Paginator } from "src/app/app.helpers";
import { BannerService } from "src/app/service/banner.service";
import { ConfirmDeleteDialog } from "../../modal_dialog/modal_confirm.component";

@Component({
    selector: "app-banner-list",
    templateUrl: "./bannerlist.component.html",
    styleUrls: [
        "../../../app.component.scss"
    ]
})
export class BannerList extends Paginator{
    loading: boolean = false
    displayedColumns: Array<string> = [
        "id", 
        "title", 
        "expired date", 
        "default",
        "action"
    ]

    constructor(
        private bannerService: BannerService,
        private dialog: MatDialog
    ) {
        super()
        this.getPaginationData(this.bannerService, this.dialog)
    }

    pageChange(event: PageEvent): void {
        const { pageSize, pageIndex } = event
        this.currentPage = pageIndex + 1
        this.limit = pageSize
        
        this.getPaginationData(this.bannerService, this.dialog)
    }

    applyFilter(event: Event): void {
        this.search = (event.target as HTMLInputElement).value

        this.getPaginationData(this.bannerService, this.dialog)
    }

    sortData({ active, direction }: Sort): void {
        const asc: string = (direction === "asc") ? "" : "-"
        this.ordering = `${asc}${active}`

        this.getPaginationData(this.bannerService, this.dialog)
    }


    confirmOnDelete(id: number) {
        this.dialog.open(ConfirmDeleteDialog, { data: { id }})
            .afterClosed()
            .subscribe((res: number | undefined) => {
                if (res) {
                    this.performDelete(id)
                }
            })
    }

    performDelete(id: number): void {
        this.loading = true  
        this.bannerService.doDestroy(id)
            .then(() => {
                this.getPaginationData(this.bannerService, this.dialog)
            })
            .catch((error) => {
                const exception = new ErrorGenerator(error, this.dialog)
                exception.throwError()
            })
            .finally(() => this.loading = false)
    }
}