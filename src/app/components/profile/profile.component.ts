import { Component } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { CustomValidator, ErrorGenerator, Helpers } from "src/app/app.helpers";
import { Generics } from "src/app/models/generics";
import { UserService } from "src/app/service/user.service";
import { ConfirmUpdateDialog, ErrorPopup } from "../modal_dialog/modal_confirm.component";

@Component({
    selector: "app-profile-component",
    templateUrl: "./profile.component.html",
    styleUrls: ["./profile.component.scss"]
})
export class Profile{
    editMode: boolean = false
    loading: boolean = false

    listTenants: Array<Generics> = []
    listRoles: Array<Generics> = []
    profile: Generics = {}

    backgroundImage: string = "url(assets/img/user_nopp.svg)"
    imageFile: File | string = ""

    constructor(
        private userService: UserService,
        private dialog: MatDialog,
        private route: ActivatedRoute
    ){
        this.fetchRequiredData()
    }

    readonly errorMessages = {
        required: "This field is required",
        email: "Please enter valid email",
        maxlength: "Characters too long",
        maxPhoneNum: "Phone numbers too long",
        mobilePatternInvalid: "Example 628765400543232",
        minlength: "Characters too short",
        minPhoneNum: "Phone numbers too short"
    }

    formControl: {[key: string]: FormControl} = {
        first_name: new FormControl({ value: "", disabled: false }),
        last_name: new FormControl({ value: "", disabled: false }),
        username: new FormControl({ value: "", disabled: false }, [
            Validators.maxLength(20),
            Validators.minLength(5),
            Validators.required
        ]),
        mobile: new FormControl({ value: "", disabled: false }, [
            Validators.required,
            Validators.maxLength(12),
            Validators.minLength(10),
            CustomValidator.mobilepattern()
        ]),
        email: new FormControl({ value: "", disabled: true }),
        tenant: new FormControl({ value: "", disabled: true }),
        role: new FormControl({ value: "", disabled: true }),
        date_joined: new FormControl({ value: "", disabled: true }),
        is_confirmed: new FormControl({ value: "", disabled: true }),
    }

    private fetchRequiredData() {
        this.getUserProfile()
    }

    private getUserProfile() {
        const promise = new Promise<number>((resolve) => {
            this.route.paramMap
                .subscribe(({ params }: Generics) => resolve(params.id))
        })
        promise.then(async (id: number) => {
            const data = await this.userService.getUser(id)
            this.profile = data
            this.setControlStates(this.setDataValues(data))
        })
        .catch((error) => {
            const exception = new ErrorGenerator(error, this.dialog)
            exception.throwError()
        })
    }

    setDataValues(data: Generics): Generics {
        if (data.profile_image) {
            this.backgroundImage = `url(${data.profile_image})`
        }
        
        return {
            first_name: data.first_name,
            last_name: data.last_name,
            username: data.username,
            mobile: data.mobile,
            email: data.email,
            profile_image: data.profile_image,
            tenant: data.tenant ? data.tenant.tenant_name : "",
            role: data.role ? data.role.role_name : "",
            date_joined: Helpers.parseDate(data.date_joined),
            is_confirmed: data.is_confirmed ? "Confirmed" : "Not Confirmed"
        }
    }

    setControlStates(data: Generics): void {
        const readOnlyFields: Array<string> = [ "is_confirmed", "date_joined", "email", "tenant", "role" ]
        for (const key in this.formControl) {
            if (!readOnlyFields.includes(key)) {
                this.formControl[key].reset({ value: data[key], disabled: !this.editMode })
            }
            else {
                this.formControl[key].setValue(data[key])
            }
        }
    }
    
    onSubmit() {
        const formValid: boolean = Object.values(this.formControl)
            .every((control) => !control.errors)
        
        if (formValid) {
            const payload = new FormData()
            payload.append("first_name", this.formControl.first_name.value)
            payload.append("last_name", this.formControl.last_name.value)
            payload.append("username", this.formControl.username.value)
            payload.append("mobile", this.formControl.mobile.value)
            payload.append("profile_pic", this.imageFile)
            
            const promise = new Promise<boolean>((resolve) => {
                this.dialog.open(ConfirmUpdateDialog, { data: { confirmed: true } })
                    .afterClosed()
                    .subscribe(async (confirmed: boolean) => {
                        resolve(confirmed)
                    })
            })
            promise.then(async (confirmed: boolean) => {
                if (confirmed) {
                    this.loading = true
                    
                    const result = await this.userService.doUpdateProfile(payload, this.profile.id)
                    this.editMode = false
                    this.setControlStates(this.setDataValues(result))
                }
            })
            .catch((error) => {
                const exception = new ErrorGenerator(error, this.dialog)
                exception.throwError()
            })
            .finally(() => this.loading = false)           
        }
    }

    processingImage(event: Event): void {
        const acceptedImageTypes = [ "image/png", "image/jpg", "image/jpeg" ]
        const images: FileList | any = (event.target as HTMLInputElement).files || {}

        if (images.length === 0) {
            this.imageFile = ""
            this.backgroundImage = `url(${this.profile.profile_image})`
            return
        }
        if (images[0].size > 5e5) {
            this.dialog.open(ErrorPopup, { data: { 
                message: "Image should not exceed 500kb"
            }})
            return
        }
        if (!acceptedImageTypes.includes(images[0].type)) {
            this.dialog.open(ErrorPopup, { data: { 
                message: `Accepted image formats are ${acceptedImageTypes.join(", ")}`
            }})
            return
        }

        this.backgroundImage =`url(${URL.createObjectURL(images[0])})`
        this.imageFile = images[0]
    }

    toggleEditMode(): void {
        this.editMode = !this.editMode
        this.setControlStates(this.setDataValues(this.profile))
    }
}