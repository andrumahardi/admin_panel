import { Component, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { PageEvent } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { Paginator } from "src/app/app.helpers";
import { RoleService } from "src/app/service/role.service";
import { ConfirmDeleteDialog } from "../../modal_dialog/modal_confirm.component";

@Component({
    selector: "app-role-list",
    templateUrl: "./rolelist.component.html",
    styleUrls: [
        "../../../app.component.scss"
    ]
})

export class RoleList extends Paginator {
    @ViewChild(MatSort) sort: MatSort =  new MatSort()

    displayedColumns: Array<string> = [
        "no", 
        "role_name", 
        "is_active", 
        "action"
    ]
    constructor(
        protected roleService: RoleService,
        private dialog: MatDialog
    ) {
        super()

        this.ordering = "id"
        this.getPaginationData(roleService, dialog)
    }

    pageChange(event: PageEvent): void {
        const { pageSize, pageIndex } = event
        this.currentPage = pageIndex + 1
        this.limit = pageSize
        
        this.getPaginationData(this.roleService, this.dialog)
    }

    applyFilter(event: Event): void {
        this.search = (event.target as HTMLInputElement).value

        this.getPaginationData(this.roleService, this.dialog)
    }

    sortData({ active, direction }: Sort): void {
        const asc: string = (direction === "asc") ? "" : "-"
        this.ordering = `${asc}${active}`

        this.getPaginationData(this.roleService, this.dialog)
    }

    confirmOnDelete(id: number) {
        this.dialog.open(ConfirmDeleteDialog, { data: { id }})
            .afterClosed()
            .subscribe((res: number | undefined) => {
                if (res) {
                    // this.performDelete(id)
                }
            })
    }

    performDelete(id: number): void {
        // this.loading = true  
        // this.roleService.doDestroy(id)
        //     .then(() => {
        //         this.getPaginationData(this.roleService, this.dialog)
        //     })
        //     .catch((err) => this.errorPopUpGenerator(err, this.dialog))
        //     .finally(() => this.loading = false)
    }
}