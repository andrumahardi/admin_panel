import { HttpErrorResponse } from "@angular/common/http";
import { 
    Component, 
    EventEmitter, 
    Input, 
    OnChanges, 
    Output, 
    SimpleChanges 
} from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/app.states";
import { ArraysInObject, Generics } from "src/app/models/generics";
import { MenuService } from "src/app/service/menu.service";
import { ErrorPopup } from "../../modal_dialog/modal_confirm.component";
import * as DropdownListActions from "src/app/actions/dropdown_items.actions";

@Component({
    selector: "app-menu-form",
    templateUrl: "./menu_form.component.html",
    styleUrls: [ "./menu_styles.component.scss" ]
})

export class MenuForm implements OnChanges{
    @Input() data: Generics = {}
    @Input() disableState: boolean = false
    @Input() forEdit: boolean = false

    @Output() submitEvent = new EventEmitter<{[key: string]: FormControl}>()
    @Output() cancelEvent = new EventEmitter<void>()

    menuList: Array<Generics> = []

    readonly errorMessages = {
        required: "This field is required!",
        maxlength: "Characters too long",
        minlength: "Characters too short",
        min: "Value should be >= 1"
    }

    constructor(
        private store: Store<AppState>,
        private dialog: MatDialog,
        private menuService: MenuService
    ) {
        this.getMenuLis()
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

    private getMenuLis(): void {
        const promise = new Promise<ArraysInObject>((resolve) => {
            this.store.select("dropdownItems").subscribe((data: ArraysInObject) => resolve(data))
        })
        promise.then(async (data: ArraysInObject) => {
            if (!data.menuList[0]) {
                const menus: Array<Generics> = await this.menuService.getAll()
                
                this.menuList = menus
                this.store.dispatch(DropdownListActions.setMenuList({ payload: menus }))

            }
            else this.menuList = data.menuList
        }).catch((error) => this.errorPopUpGenerator(error))
    }

    readonly formControl: {[key: string]: FormControl} = {
        menu_name: new FormControl({ value: "", disabled: this.disableState }, [
            Validators.required,
            Validators.maxLength(36),
            Validators.minLength(5)
        ]),
        menu_path_url: new FormControl({ value: "", disabled: this.disableState }),
        menu_seq: new FormControl({ value: "", disabled: this.disableState }, [
            Validators.required,
            Validators.min(1)
        ]),
        parent: new FormControl({ value: "", disabled: this.disableState }),
        description: new FormControl({ value: "", disabled: this.disableState })
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
        for (const key in this.formControl) {
            this.formControl[key].reset({ value: data[key], disabled: this.disableState })
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