import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import {
    FormControl,
    Validators 
} from "@angular/forms";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/app.states";
import { ArraysInObject, Generics } from "src/app/models/generics";
import { MatDialog } from "@angular/material/dialog";
import { CustomValidator, ErrorGenerator } from "src/app/app.helpers";
import * as DropdownListActions from "src/app/actions/dropdown_items.actions"
import { ProvinceService } from "src/app/service/province.service";
import { CityService } from "src/app/service/city.service";


@Component({
    selector: "app-tenant-form",
    templateUrl: "./tenant_form.component.html",
    styleUrls: [ "./tenant_styles.component.scss" ]
})

export class TenantForm implements OnChanges{
    @Input() data: Generics = {}
    @Input() forEdit: boolean = false
    @Input() disableState: boolean = false

    @Output() submitEvent = new EventEmitter<{[key: string]: FormControl}>()
    @Output() cancelEvent = new EventEmitter<void>()

    listProvinces: Array<Generics> = []
    listCities: Array<Generics> = []

    readonly errorMessages = {
        required: "This field is required!",
        maxlength: "Characters too long",
        minlength: "Characters too short",
        mobilePatternInvalid: "Example 08761231231",
        maxPhoneNum: "Phone number too long",
        minPhoneNum: "Phone number too short"
    }

    constructor(
        private store: Store<AppState>,
        private provinceService: ProvinceService,
        private cityService: CityService,
        private dialog: MatDialog
    ) {
        this.getLists()
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

    private getLists(): void {
        const promise = new Promise<ArraysInObject>((resolve, _) => {
            this.store.select("dropdownItems")
                .subscribe((data: ArraysInObject): void => resolve(data))
        })
        promise
            .then((data: ArraysInObject) => {
                this.getProvinceList(data.provinceList)
                this.getCityList(data.cityList)
            })
            .catch((error) => {
                const exception = new ErrorGenerator(error, this.dialog)
                exception.throwError()
            })
    }

    private async getProvinceList(provinceList: Array<Generics>): Promise<void> {
        this.listProvinces = provinceList
        
        if (!provinceList[0]) {
            const { results }: Generics = await this.provinceService.getAll()
            this.store.dispatch(DropdownListActions.setProvinceList({ payload: results }))
            
            this.listProvinces = results
        }
    }

    private async getCityList(cityList: Array<Generics>): Promise<void> {
        this.listCities = cityList
        
        if (!cityList[0]) {
            const { results }: Generics = await this.cityService.getAll()
            this.store.dispatch(DropdownListActions.setCityList({ payload: results }))
            
            this.listCities = results
        }
    }

    readonly formControl: {[key: string]: FormControl} = {
        tenant_name: new FormControl({ value: "", disabled: this.disableState }, [
            Validators.required,
            Validators.minLength(5)
        ]),
        phone_1st: new FormControl({ value: "", disabled: this.disableState }, [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(12),
            CustomValidator.mobilepattern()
        ]),
        phone_2nd: new FormControl({ value: "", disabled: this.disableState }, [
            Validators.minLength(10),
            Validators.maxLength(12),
            CustomValidator.mobilepattern()
        ]),
        fax: new FormControl({ value: "", disabled: this.disableState }, [
            Validators.minLength(10),
            Validators.maxLength(12),
            CustomValidator.mobilepattern()
        ]),
        address: new FormControl({ value: "", disabled: this.disableState }),
        second_address: new FormControl({ value: "", disabled: this.disableState }),
        website: new FormControl({ value: "", disabled: this.disableState }),
        province_id: new FormControl({ value: "", disabled: this.disableState }),
        city_id: new FormControl({ value: "", disabled: this.disableState }),
        remark: new FormControl({ value: "", disabled: this.disableState }),
        is_active: new FormControl({ value: "", disabled: this.disableState })
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
}