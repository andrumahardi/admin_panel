import { 
    Component, 
    ElementRef, 
    EventEmitter, 
    Input, 
    OnChanges, 
    OnInit, 
    Output, 
    SimpleChanges, 
    ViewChild
} from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/app.states";
import { ArraysInObject, Generics } from "src/app/models/generics";
import { MenuService } from "src/app/service/menu.service";
import * as DropdownListActions from "src/app/actions/dropdown_items.actions";
import { ErrorGenerator } from "src/app/app.helpers";
import { ErrorPopup } from "../../modal_dialog/modal_confirm.component";

@Component({
    selector: "app-menu-form",
    templateUrl: "./menu_form.component.html",
    styleUrls: [ "./menu_styles.component.scss" ]
})

export class MenuForm implements OnChanges, OnInit{
    @Input() data: Generics = {}
    @Input() disableState: boolean = false
    @Input() forEdit: boolean = false
    @Input() clearImage: boolean = false

    @Output() submitEvent: EventEmitter<Generics> = new EventEmitter<Generics>()
    @Output() cancelEvent: EventEmitter<void> = new EventEmitter<void>()

    @ViewChild("inputIcon") inputIcon: ElementRef | null = null

    menuIcon: string = "unset"
    iconFileLabel: string = "Select icon"
    iconImage: File | null = null

    menuList: Array<Generics> = []

    readonly errorMessages = {
        required: "This field is required!",
        maxlength: "Characters too long",
        minlength: "Characters too short",
        min: "Value should be >= 1"
    }

    readonly formControl: {[key: string]: FormControl} = {
        menu_name: new FormControl({ value: "", disabled: this.disableState }, [
            Validators.required,
            Validators.maxLength(36),
            Validators.minLength(3)
        ]),
        menu_path_url: new FormControl({ value: "", disabled: this.disableState }),
        menu_seq: new FormControl({ value: "", disabled: this.disableState }, [
            Validators.required,
            Validators.min(1)
        ]),
        parent: new FormControl({ value: "", disabled: this.disableState }),
        description: new FormControl({ value: "", disabled: this.disableState })
    }

    constructor(
        private store: Store<AppState>,
        private dialog: MatDialog,
        private menuService: MenuService
    ) {}

    ngOnChanges(event: SimpleChanges) {
        if (event.disableState) {
            this.disableState = event.disableState.currentValue

            this.setControlStates(this.data)
        }

        if (event.data) {
            this.setControlStates(event.data.currentValue)
        }

        if (event.clearImage) {
            if (event.clearImage.currentValue) {
                (this.inputIcon?.nativeElement as HTMLInputElement).value = ""
                this.resetInputFilesValue()
            }
        }
    }

    ngOnInit(): void {
        const promise = new Promise<ArraysInObject>((resolve) => {
            this.store.select("dropdownItems").subscribe((data: ArraysInObject) => resolve(data))
        })
        promise.then(async (data: ArraysInObject) => {
            if (!data.menuList[0]) {
                const menus: Array<Generics> = await this.menuService.getAll()
                
                this.menuList = menus.filter(menu => !menu.parent)
                this.store.dispatch(DropdownListActions.setMenuList({ payload: menus }))

            }
            else this.menuList = data.menuList.filter(menu => !menu.parent)
        }).catch((error) => {
            const exception = new ErrorGenerator(error, this.dialog)
            exception.throwError()
        })
    }

    readImage(event: Event): void {
        const acceptedFileTypes: Array<string> = [
            "image/ico", "image/png", "image/svg+xml"
        ]

        const inputFile: HTMLInputElement = (event.target as HTMLInputElement)
        this.resetInputFilesValue()
        
        if (inputFile.files?.length) {
            if (inputFile.files[0].size > 1e5) {
                this.dialog.open(ErrorPopup, { data: {
                    message: "Icon should not exceed 100kb"
                }})
                return
            }
            if (!acceptedFileTypes.includes(inputFile.files[0].type)) {
                this.dialog.open(ErrorPopup, { data: {
                    message: `Accepted image formats are ${acceptedFileTypes.join(", ")}`
                }})
                return
            }

            this.iconFileLabel = inputFile.files[0].name
            this.iconImage = inputFile.files[0]
            this.menuIcon = `url(${URL.createObjectURL(inputFile.files[0])})`
        }
    }

    onSubmit(): void {
        const formValid: boolean = Object.values(this.formControl)
            .every((control) => !control.errors)
        
        if(formValid) {
            this.submitEvent.emit({ data: this.formControl, file: this.iconImage})
        }
    }

    onCancel: () => void = (): void => {
        (this.inputIcon?.nativeElement as HTMLInputElement).value = ""        
        
        this.resetInputFilesValue()
        this.cancelEvent.emit()
    }

    resetInputFilesValue(): void {
        this.iconImage = null
        this.iconFileLabel = "Select icon"

        if (this.data.menu_icon_url) {
            this.menuIcon = `url(${this.data.menu_icon_url})`
        }
        else this.menuIcon = ""
    }

    setControlStates(data: Generics): void {
        if (data.menu_icon_url) {
            this.menuIcon = `url(${data.menu_icon_url})`
        }

        for (const key in this.formControl) {
            this.formControl[key].reset({ value: data[key], disabled: this.disableState })
        }
    }
}