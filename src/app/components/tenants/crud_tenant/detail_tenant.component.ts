import { Component } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { ErrorGenerator } from "src/app/app.helpers";
import { Generics } from "src/app/models/generics";
import { TenantService } from "src/app/service/tenant.service";
import { ConfirmUpdateDialog } from "../../modal_dialog/modal_confirm.component";

@Component({
    selector: "app-detail-tenant",
    templateUrl: "./detail_tenant.component.html",
    styleUrls: [ "./tenant_styles.component.scss" ]
})

export class DetailTenant{
    formControlData: Generics = {}
    loading: boolean = false

    detailTenant: Generics = {}

    editMode: boolean = false

    constructor(
        private tenantService: TenantService,
        private dialog: MatDialog,
        private route: ActivatedRoute
    ) {
        this.getDetailTenant()
    }

    closeForm(): void {
        this.editMode = false
        this.setControlStates(this.detailTenant)
    }

    private getDetailTenant() {
        const promise = new Promise<number>((resolve) => {
            this.route.paramMap
                .subscribe(({ params }: Generics) => resolve(params.id))
        })
        promise.then(async (id: number) => {
            const data = await this.tenantService.getTenant(id)
            this.detailTenant = data
            this.setControlStates(data)
        })
        .catch((error) => {
            const exception = new ErrorGenerator(error, this.dialog)
            exception.throwError()
        })
    }

    performUpdate(eventPayload: {[key: string]: FormControl}): void {
        const payload: Generics = {
            website: eventPayload.website.value,
            tenant_name: eventPayload.tenant_name.value,
            remark: eventPayload.remark.value,
            phone_1st: eventPayload.phone_1st.value,
            phone_2nd: eventPayload.phone_2nd.value,
            address: eventPayload.address.value,
            second_address: eventPayload.second_address.value,
            fax: eventPayload.fax.value,
            province_id: eventPayload.province_id.value,
            city_id: eventPayload.city_id.value
        }
        const promise = new Promise<boolean>((resolve) => {
            this.dialog.open(ConfirmUpdateDialog, { data: { confirmed: true }})
                .afterClosed()
                .subscribe(async (confirmed: boolean) => {
                    if (confirmed) resolve(true)
                    else resolve(false)
                })
        })
        promise.then(async (isConfirmed: boolean) => {
            if (isConfirmed) {
                this.loading = true

                const data = await this.tenantService.doUpdate(payload, this.detailTenant.id)
                this.setControlStates(data)
            }
        })
            .catch((error) => {
                const exception = new ErrorGenerator(error, this.dialog)
                exception.throwError()
            })
            .finally(() => this.loading = false)
    }

    setControlStates(data: Generics): void {
        this.formControlData = {
            website: data.website,
            tenant_name: data.tenant_name,
            remark: data.remark,
            phone_1st: data.phone_1st,
            phone_2nd: data.phone_2nd,
            address: data.address,
            second_address: data.second_address,
            fax: data.fax,
            province_id: data.province ? String(data.province) : "",
            city_id: data.city ? String(data.city) : "",
            is_active: data.is_active ? "active" : "inactive"
        }
    }
}