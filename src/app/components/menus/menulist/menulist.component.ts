import { Component, ViewChild } from "@angular/core"
import { PageEvent } from "@angular/material/paginator";
import { Paginator } from "src/app/app.helpers";
import { MenuService } from "src/app/service/menu.service";
import { MatSort, Sort } from "@angular/material/sort"
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDeleteDialog } from "../../modal_dialog/modal_confirm.component";

@Component({
    selector: "app-menu-list",
    templateUrl: "./menulist.component.html",
    styleUrls: [
        "../../../app.component.scss"
    ]
})

export class Menulist extends Paginator {
    @ViewChild(MatSort) sort: MatSort =  new MatSort()
    loading: boolean = false

    displayedColumns: Array<string> = [
        "id", "name", "path_url", "action"
    ]

    constructor(
        protected menuService: MenuService,
        private dialog: MatDialog
    ) {
        super()
        this.ordering = "id"
        this.getPaginationData(this.menuService, this.dialog)
    }

    pageChange(event: PageEvent): void {
        const { pageSize, pageIndex } = event
        this.currentPage = pageIndex + 1
        this.limit = pageSize
        
        this.getPaginationData(this.menuService, this.dialog)
    }

    applyFilter(event: Event): void {
        this.search = (event.target as HTMLInputElement).value

        this.getPaginationData(this.menuService, this.dialog)
    }

    sortData({ active, direction }: Sort): void {
        const asc: string = (direction === "asc") ? "" : "-"
        this.ordering = `${asc}${active}`

        this.getPaginationData(this.menuService, this.dialog)
    }

    performDelete(id: number): void {
        const promise = new Promise<number | undefined>((resolve) => {
            this.dialog.open(ConfirmDeleteDialog, { data: { id }})
            .afterClosed()
            .subscribe((res: number) => {
                if (res) {
                    resolve(id)
                } else resolve(undefined)
            })
        })
        promise.then(async (id: number | undefined) => {
            if (id) {
                this.loading = true
                await this.menuService.doDestroy(id)

                this.getPaginationData(this.menuService, this.dialog)
            }
        })
            .catch((error) => this.errorPopUpGenerator(error, this.dialog))
            .finally(() => this.loading = false)
    }
}