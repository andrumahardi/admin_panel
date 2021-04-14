import { AfterContentInit, AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { CustomValidator, ErrorGenerator } from "src/app/app.helpers";
import { AppState } from "src/app/app.states";
import { ArraysInObject, Generics } from "src/app/models/generics";
import { TenantService } from "src/app/service/tenant.service";
import * as DropdownListActions from "src/app/actions/dropdown_items.actions"
import { ErrorPopup } from "../../modal_dialog/modal_confirm.component";

@Component({
    selector: "app-banner-form",
    templateUrl: "./banner_form.component.html",
    styleUrls: ["./banner_styles.component.scss"]
})
export class BannerForm implements OnChanges, OnInit{
    @Input() disableState: boolean = false
    @Input() data: Generics = {}
    @Input() forEdit: boolean = false
    @Input() clearImage: boolean = false

    @Output() submitEvent = new EventEmitter<Generics>()
    @Output() cancelEvent = new EventEmitter<void>()

    @ViewChild("inputIcon") inputIcon: ElementRef | null = null

    listTenants: Array<Generics> = []
    bannerImageUrl: string = "unset"
    imageLabel: string = "Select image"
    image: File | null = null

    readonly errorMessages = {
        required: "This field is required",
        maxlength: "Characters too long",
        minlength: "Characters too short",
        expireddate: "Date should be at least tomorrow"
    }

    constructor(
        private store: Store<AppState>,
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
            Validators.required,
            CustomValidator.expirationdate()
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
        if (event.clearImage) {
            if (event.clearImage.currentValue) {
                (this.inputIcon?.nativeElement as HTMLInputElement).value = ""
                this.resetInputFilesValue()
            }
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

    readImage(event: Event): void {
        const acceptedFileTypes: Array<string> = [
            "image/jpg", "image/png", "image/svg+xml", "image/jpeg"
        ]

        const inputFile: HTMLInputElement = (event.target as HTMLInputElement)
        this.resetInputFilesValue()

        if (inputFile.files?.length) {
            const file: File = inputFile.files[0]
            
            const blobUrl: string = URL.createObjectURL(inputFile.files[0])
            const img = new Image
    
            img.onload = (): boolean | void => {
                if (img.width > 1366 || img.height > 768) {
                    this.dialog.open(ErrorPopup, { data: {
                        message: "Resolution of the image is max 1366px (height) : 768px (width)"
                    }})
                    return false
                }
                if (file.size > 1e6) {
                    this.dialog.open(ErrorPopup, { data: {
                        message: "Image should not exceed 1MB"
                    }})
                    return false
                }
                if (!acceptedFileTypes.includes(file.type)) {
                    this.dialog.open(ErrorPopup, { data: {
                        message: `Accepted image formats are ${acceptedFileTypes.join(", ")}`
                    }})
                    return false
                }
                this.imageLabel = file.name
                this.image = file
                this.bannerImageUrl = `url(${blobUrl})`
            }
            img.src = blobUrl
        }
    }

    resetInputFilesValue(): void {
        this.image = null
        this.imageLabel = "Select image"
        this.bannerImageUrl = "unset"

        if (this.data.image_url) {
            this.bannerImageUrl = `url(${this.data.image_url})`
        }
        else this.bannerImageUrl = "unset"
    }

    onSubmit(): void {
        const formValid: boolean = Object.values(this.formControl)
            .every((control) => !control.errors)
        
        if(formValid) {
            this.submitEvent.emit({ ...this.formControl, image: this.image })
        }

    }
    
    onCancel: () => void = (): void => {
        (this.inputIcon?.nativeElement as HTMLInputElement).value = ""

        this.resetInputFilesValue()
        this.cancelEvent.emit()
    }

    setControlStates(data: Generics): void {
        if (data.image_url) {
            this.bannerImageUrl = `url(${data.image_url})`
        }

        for (const key in this.formControl) {
            this.formControl[key].reset({ value: data[key], disabled: this.disableState })
        }
    }
} 