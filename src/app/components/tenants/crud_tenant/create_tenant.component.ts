import { Component } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ErrorGenerator } from "src/app/app.helpers";
import { Generics } from "src/app/models/generics";
import { TenantService } from "src/app/service/tenant.service";

@Component({
    selector: "app-create-tenant",
    templateUrl: "./create_tenant.component.html",
    styleUrls: [ "./tenant_styles.component.scss" ]
})

export class CreateTenant{
    formControlData: Generics = {}
    loading: boolean = false

    constructor(
        private tenantService: TenantService,
        private dialog: MatDialog,
        private router: Router
    ) {
        this.setControlStates()
    }

    closeForm(): void {
        this.setControlStates()
    }

    performCreate(eventPayload: {[key: string]: FormControl}): void {
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

        this.loading = true
        this.tenantService.doCreate(payload)
            .then(() => {
                this.router.navigate(["tenant"])
            })
            .catch((error) => {
                const exception = new ErrorGenerator(error, this.dialog)
                exception.throwError()
            })
            .finally(() => this.loading = false)
    }

    setControlStates(): void {
        this.formControlData = {
            website: "",
            tenant_name: "",
            remark: "",
            phone_1st: "",
            phone_2nd: "",
            address: "",
            second_address: "",
            fax: "",
            province_id: "",
            city_id: "",
            is_active: "active"
        }
    }
}