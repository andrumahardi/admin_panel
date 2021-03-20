import { 
    Component, 
    EventEmitter, 
    Input, 
    OnChanges, 
    Output, 
    SimpleChanges 
} from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/app.states";
import { Generics } from "src/app/models/generics";
import { MenuService } from "src/app/service/menu.service";
import { RoleService } from "src/app/service/role.service";


@Component({
    selector: "app-role-form",
    templateUrl: "./role_form.component.html",
    styleUrls: [ "./role_styles.component.scss" ]
})

export class RoleForm implements OnChanges{
    @Input() formControlData: Generics = {}
    @Input() disableState: boolean = false
    @Input() forEdit: boolean = false
    @Input() listMenus: Array<Generics> = []

    @Output() submitEvent: EventEmitter<Generics> = new EventEmitter<Generics>()
    @Output() cancelEvent: EventEmitter<void> = new EventEmitter<void>()


    readonly errorMessages = {
        required: "This field is required!",
        maxlength: "Characters too long"
    }

    ngOnChanges(event: SimpleChanges) {
        if (event.disableState) {
            this.disableState = event.disableState.currentValue

            this.setControlStates(this.formControlData)
        }
        if (event.formControlData) {
            this.setControlStates(event.formControlData.currentValue)
        }
        if (event.listMenus) {
            this.listMenus = event.listMenus.currentValue
        }
    }

    readonly formControl: {[key: string]: FormControl} = {
        is_active: new FormControl({ value: "", disabled: true }),
        role_name: new FormControl({ value: "", disabled: true }, [
            Validators.required,
            Validators.maxLength(20)
        ]),
    }
    
    setAllChecked(selected: boolean, index: number) {
        this.listMenus = this.listMenus.map((menu: Generics, i: number) => {
            if (i === index) {
                menu = {
                    ...menu,
                    selected,
                    children: menu["children"].map((child: Generics) => {
                        return {
                            ...child,
                            selected
                        }
                    })
                }
            }
            return menu
        })
    }

    toggleParentChecked(selected: boolean, parentPos: number, childPos: number) {
        // Define child menu
        this.listMenus = this.listMenus.map((menu: Generics, i) => {
            let parentMenu: Generics = menu
            if (i === parentPos) {
                parentMenu = {
                    ...menu,
                    children: menu.children.map((child: Generics, j: number) => {
                        let childMenu: Generics = child
                        if (j === childPos) {
                            childMenu = {
                                ...child,
                                selected
                            }
                        }
                        return childMenu
                    })
                }
            }
            return parentMenu
        })

        // Define parent menu
        this.listMenus = this.listMenus.map((menu: Generics, i: number) => {
            let parentMenu: Generics = menu
            if (i === parentPos) {
                const someChildChecked = menu.children.some((child: Generics) => child.selected)
                parentMenu = {
                    ...menu,
                    selected: someChildChecked
                }
            }
            return parentMenu
        })
    }

    onSubmit(): void {
        const formValid: boolean = Object.values(this.formControl)
            .every((control) => !control.errors)
        
        if (formValid) {
            let selectedMenuIDs: Array<number> = []
            this.listMenus.forEach((menu: Generics) => {
                if (menu.selected) selectedMenuIDs.push(menu.id)
                menu.children.forEach((child: Generics) => {
                    if (child.selected) selectedMenuIDs.push(child.id)
                })
            })

            this.submitEvent.emit({ formControlData: this.formControl, selectedMenus: selectedMenuIDs }) 
        }
    }

    onCancel: () => void = (): void => this.cancelEvent.emit()

    setControlStates(data: Generics): void {
        for (const key in this.formControl) {
            this.formControl[key].reset({ value: data[key], disabled: this.disableState })
        }
    }
}