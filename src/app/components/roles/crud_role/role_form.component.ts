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


@Component({
    selector: "app-role-form",
    templateUrl: "./role_form.component.html",
    styleUrls: [ "./role_styles.component.scss" ]
})

export class RoleForm implements OnChanges{
    @Input() data: Generics = {}
    @Input() disableState: boolean = false
    @Input() forEdit: boolean = false

    @Output() submitEvent = new EventEmitter<{[key: string]: FormControl}>()
    @Output() cancelEvent = new EventEmitter<void>()

    // listTenants: Array<Generics> = []
    // listRoles: Array<Generics> = []

    readonly errorMessages = {
        required: "This field is required!",
        maxlength: "Characters should not exceed 20 letters",
        minlength: "Characters too short ( < 5 letters )"
    }

    constructor(
        private store: Store<AppState>,
        private roleService: RoleService
    ) {
        // this.fetchRequiredData()
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

    // private fetchRequiredData(): void {
    //     this.getListRoles()
    //     Promise.all([
    //         this.getListTenants(),
    //     ])
    // }

    readonly formControl: {[key: string]: FormControl} = {
        is_active: new FormControl({ value: "", disabled: true }),
        role_name: new FormControl({ value: "", disabled: true }, [
            Validators.required
        ]),
    }

    // private getListTenants(): Promise<boolean> {
    //     return new Promise((resolve, _) => {
    //         this.store.select("dropdownItems")
    //             .subscribe((data: ArrayOfObjects): void => {
    //                 this.listTenants = data.tenantList
    //                 resolve(true)
    //             })
    //     })
    // }

    // private getListRoles(): void {
    //     const promise = new Promise<ArrayOfObjects>((resolve, _) => {
    //         this.store.select("dropdownItems")
    //             .subscribe((data: ArrayOfObjects): void => resolve(data))
    //     })
    //     promise.then(async (data: ArrayOfObjects) => {
    //         if (!data.roleList[0]) {
    //             const { results }: Generics = await this.roleService.getList("purpose=dropdown")
    //             this.store.dispatch(DropdownListActions.setRoleList({ payload: results }))
    //             this.listRoles = results
    //         }
    //         else this.listRoles = data.roleList
    //     })
    //     .catch((err) => console.log(err))
    // }

    onSubmit(): void {
        const formValid: boolean = Object.values(this.formControl)
            .every((control) => !control.errors)
        
        if(formValid) {
            this.submitEvent.emit(this.formControl) 
        }
    }

    onCancel: () => void = (): void => this.cancelEvent.emit()

    setControlStates(data: Generics): void {
        for (const key in this.formControl) {
            this.formControl[key].reset({ value: data[key], disabled: this.disableState })
        }
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