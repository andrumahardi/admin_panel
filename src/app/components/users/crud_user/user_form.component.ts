import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import { 
    AbstractControl, 
    FormControl, 
    ValidationErrors, 
    ValidatorFn, 
    Validators 
} from "@angular/forms";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/app.states";
import { ArrayOfObjects, Generics } from "src/app/models/generics";
import { RoleService } from "src/app/service/role.service";
import * as DropdownListActions from "src/app/actions/dropdown_items.actions"
import { TenantService } from "src/app/service/tenant.service";
import { HttpErrorResponse } from "@angular/common/http";
import { ErrorPopup } from "../../modal_dialog/modal_confirm.component";
import { MatDialog } from "@angular/material/dialog";


@Component({
    selector: "app-user-form",
    templateUrl: "./user_form.component.html",
    styleUrls: [ "./user_styles.component.scss" ]
})

export class UserForm implements OnChanges{
    @Input() data: Generics = {}
    @Input() disableState: boolean = false
    @Input() forEdit: boolean = false

    @Output() submitEvent = new EventEmitter<{[key: string]: FormControl}>()
    @Output() cancelEvent = new EventEmitter<void>()

    listTenants: Array<Generics> = []
    listRoles: Array<Generics> = []

    readonly errorMessages = {
        required: "This field is required!",
        email: "Please enter valid email",
        maxlength: "Characters should not exceed 20 letters",
        maxPhoneNum: "Phone number should not exceed 12 numbers",
        mobilePatternInvalid: "Valid phone is for example 628765400543232",
        minlength: "Characters too short ( < 5 letters )",
        minPhoneNum: "Phone number is too short ( < 10 numbers )"
    }

    constructor(
        private store: Store<AppState>,
        private roleService: RoleService,
        private tenantService: TenantService,
        private dialog: MatDialog
    ) {
        this.fetchRequiredData()
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

    private fetchRequiredData(): void {
        this.getListRoles()
        this.getListTenants()
    }

    readonly formControl: {[key: string]: FormControl} = {
        first_name: new FormControl({ value: "", disabled: this.disableState }),
        last_name: new FormControl({ value: "", disabled: this.disableState }),
        username: new FormControl({ value: "", disabled: this.disableState }, [
            Validators.maxLength(20),
            Validators.minLength(5),
            Validators.required
        ]),
        email: new FormControl({ value: "", disabled: this.disableState }, [
            Validators.required,
            Validators.minLength(5),
            Validators.email
        ]),
        mobile: new FormControl({ value: "", disabled: this.disableState }, [
            Validators.required,
            Validators.maxLength(12),
            Validators.minLength(10),
            CustomValidator.mobilepattern()
        ]),
        tenant: new FormControl({ value: "", disabled: this.disableState }, [
            Validators.required
        ]),
        role: new FormControl({ value: "", disabled: this.disableState }),
        date_joined: new FormControl({ value: "", disabled: true }),
        is_confirmed: new FormControl({ value: "", disabled: true }),
        password: new FormControl({ value: "", disabled: this.disableState }, [
            Validators.required
        ])
    }

    private getListRoles(): void {
        const promise = new Promise<ArrayOfObjects>((resolve, _) => {
            this.store.select("dropdownItems")
                .subscribe((data: ArrayOfObjects): void => resolve(data))
        })
        promise
            .then(async (data: ArrayOfObjects) => {
                if (!data.roleList[0]) {
                    const { results }: Generics = await this.roleService.getAll()
                    this.store.dispatch(DropdownListActions.setRoleList({ payload: results }))
                    this.listRoles = results
                }
                else this.listRoles = data.roleList
            })
            .catch((error) => this.errorPopUpGenerator(error))
    }

    private getListTenants(): void {
        const promise = new Promise<ArrayOfObjects>((resolve, _) => {
            this.store.select("dropdownItems")
                .subscribe((data: ArrayOfObjects): void => resolve(data))
        })
        promise
            .then(async (data: ArrayOfObjects) => {
                if (!data.tenantList[0]) {
                    const { results }: Generics = await this.tenantService.getAll()
                    this.store.dispatch(DropdownListActions.setTenantList({ payload: results }))
                    this.listTenants = results
                }
                else this.listTenants = data.tenantList
            })
            .catch((error) => this.errorPopUpGenerator(error))
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

    errorPopUpGenerator({ error, status }: HttpErrorResponse): void {
        let message: string = ""
        switch (status) {
            case 400:
                for (const key in error.detail) {
                    message = error.detail[key][0]
                    break
                }
                break
            case 500:
                message = "Server could not process data"
                break
            default:
                message = error.detail
        }
        this.dialog.open(ErrorPopup, { data: { message }})
    }
}

class CustomValidator extends Validators{
    static mobilepattern(): ValidatorFn {
        return CustomValidator.generateMobilePatternError
    }

    static generateMobilePatternError(control: AbstractControl): ValidationErrors | null {
        const pattern = /[^0-9]/ig
        const mobilephoneValid: boolean = (control.value.search(pattern) === -1)

        if (mobilephoneValid) return null
        return {mobilepattern: true}
    }
}