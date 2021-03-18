import { Component, ViewChild } from "@angular/core"
import { PageEvent } from "@angular/material/paginator";
import { Paginator } from "src/app/app.helpers";
import { MenuService } from "src/app/service/menu.service";
import { MatSort, Sort } from "@angular/material/sort"
import { MatDialog } from "@angular/material/dialog";

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
        "no", "name", "path_url", "action"
    ]

    constructor(
        protected menuService: MenuService,
        private dialog: MatDialog
    ) {
        super()
        this.ordering = "menu_name"
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

    delete(id: number): void {
        console.log(id)
    }
}