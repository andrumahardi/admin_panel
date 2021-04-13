import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { ErrorGenerator } from "src/app/app.helpers";
import { AppState } from "src/app/app.states";
import { ArraysInObject, Generics } from "src/app/models/generics";
import { BannerService } from "src/app/service/banner.service";
import { TenantService } from "src/app/service/tenant.service";
import * as DropdownListActions from "src/app/actions/dropdown_items.actions"

@Component({
    selector: "app-banner-form",
    templateUrl: "./banner_form.component.html",
    styleUrls: ["./banner_styles.component.scss"]
})
export class BannerForm implements OnChanges, OnInit{
    @Input() disableState: boolean = false
    @Input() data: Generics = {}
    @Input() forEdit: boolean = false

    @Output() submitEvent = new EventEmitter<{[key: string]: FormControl}>()
    @Output() cancelEvent = new EventEmitter<void>()

    listTenants: Array<Generics> = []

    readonly errorMessages = {
        required: "This field is required",
        maxlength: "Characters too long",
        minlength: "Characters too short",
    }

    constructor(
        private store: Store<AppState>,
        private bannerService: BannerService,
        private tenantService: TenantService,
        private dialog: MatDialog
    ) {}

    readonly formControl: {[key: string]: FormControl} = {
        title: new FormControl({ value: "", disabled: this.disableState }, [
            Validators.maxLength(20),
            Validators.minLength(5),
            Validators.required
        ]),
        article: new FormControl({ value: "", disabled: this.disableState }),
        tenant_id: new FormControl({ value: "", disabled: this.disableState }, [
            Validators.required
        ]),
        expired_date: new FormControl({ value: "", disabled: this.disableState }, [
            Validators.required
        ]),
        is_default: new FormControl({ value: "", disabled: this.disableState }),
    }

    ngOnChanges(event: SimpleChanges) {
        if (event.disableState) {
            this.disableState = event.disableState.currentValue

            this.setControlStates(this.data)
        }

        if (event.data) {
            this.setControlStates(event.data.currentValue)
        }
    }

    ngOnInit(): void {
        const promise = new Promise<ArraysInObject>((resolve, _) => {
            this.store.select("dropdownItems")
                .subscribe((data: ArraysInObject): void => resolve(data))
        })
        promise
            .then(async (data: ArraysInObject) => {
                if (!data.tenantList[0]) {
                    const { results }: Generics = await this.tenantService.getAll()
                    this.store.dispatch(DropdownListActions.setTenantList({ payload: results }))
                    this.listTenants = results
                }
                else this.listTenants = data.tenantList
            })
            .catch((error) => {
                const exception = new ErrorGenerator(error, this.dialog)
                exception.throwError()
            })
    }

    onSubmit(): void {
        const formValid: boolean = Object.values(this.formControl)
            .every((control) => !control.errors)
        
        if(formValid) {
            this.submitEvent.emit(this.formControl) 
        }
    }
    
    onCancel: () => void = (): void => this.cancelEvent.emit()

    setControlStates(data: Generics): void {
        const readOnlyFields: Array<string> = [ "is_confirmed", "date_joined" ]
        for (const key in this.formControl) {
            if (!readOnlyFields.includes(key)) {
                this.formControl[key].reset({ value: data[key], disabled: this.disableState })
            }
            else {
                this.formControl[key].setValue(data[key])
            }
        }
    }
} 