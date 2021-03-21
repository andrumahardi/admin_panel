import { AfterViewInit, Component, ViewChild } from "@angular/core"
import { PageEvent } from "@angular/material/paginator"
import { ErrorGenerator, Paginator } from "src/app/app.helpers"
import { MatDialog } from "@angular/material/dialog"

import { UserService } from "src/app/service/user.service"
import { ConfirmDeleteDialog } from "../../modal_dialog/modal_confirm.component"
import { MatSort, Sort } from "@angular/material/sort"

@Component({
    selector: "app-user-list",
    templateUrl: "./userlist.component.html",
    styleUrls: [
        "../../../app.component.scss"
    ]
})

export class UserList extends Paginator{
    @ViewChild(MatSort) sort: MatSort =  new MatSort()

    displayedColumns: Array<string> = [
        "id", 
        "fname", 
        "lname", 
        "uname",
        "date_joined", 
        "action"
    ]

    constructor(
        protected userService: UserService,
        private dialog: MatDialog
    ) {
        super()

        this.ordering = "-id"
        this.getPaginationData(this.userService, this.dialog)
    }

    pageChange(event: PageEvent): void {
        const { pageSize, pageIndex } = event
        this.currentPage = pageIndex + 1
        this.limit = pageSize
        
        this.getPaginationData(this.userService, this.dialog)
    }

    applyFilter(event: Event): void {
        this.search = (event.target as HTMLInputElement).value

        this.getPaginationData(this.userService, this.dialog)
    }

    sortData({ active, direction }: Sort): void {
        const asc: string = (direction === "asc") ? "" : "-"
        this.ordering = `${asc}${active}`

        this.getPaginationData(this.userService, this.dialog)
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
        this.userService.doDestroy(id)
            .then(() => {
                this.getPaginationData(this.userService, this.dialog)
            })
            .catch((error) => {
                const exception = new ErrorGenerator(error, this.dialog)
                exception.throwError()
            })
            .finally(() => this.loading = false)
    }
}