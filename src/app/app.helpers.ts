import { HttpErrorResponse } from "@angular/common/http"
import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from "@angular/forms"
import { MatDialog } from "@angular/material/dialog"
import { ErrorPopup } from "./components/modal_dialog/modal_confirm.component"
import { Generics, PaginatedListResult } from "./models/generics"
import { BannerService } from "./service/banner.service"
import { MenuService } from "./service/menu.service"
import { RoleService } from "./service/role.service"
import { TenantService } from "./service/tenant.service"
import { UserService } from "./service/user.service"

export class Helpers{
    private static months: Array<string> = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ]

    static dateFormatConstraints: Generics = {
        DEFAULT_FORMAT: "M, dd yy",
        REVERSE_ORDINARY: "dd/mm/yyyy",
        INPUT_TYPE_DATE: "yyyy/mm/dd"
    }

    static parseDate(
        datestring: string,
        format: string = Helpers.dateFormatConstraints.DEFAULT_FORMAT,
        includeTime: boolean = false
    ): string
    {
        const instance = new Date(datestring)

        const year: number = instance.getFullYear()
        const monthName: string = this.months[instance.getMonth() + 1]
        const month: string = instance.getMonth() + 1 < 10 ? `0${instance.getMonth() + 1}` : String(instance.getMonth() + 1)
        
        let date: string = instance.getDate().toLocaleString()
        let hour: string = instance.getHours().toLocaleString()
        let minute: string = instance.getMinutes().toLocaleString()

        if (+date < 10) date = `0${date}`
        if (+hour < 10) hour = `0${hour}`
        if (+minute < 10) minute = `0${minute}`

        let time: string = ""
        if (includeTime) time = ` (${hour} : ${minute})`

        switch (format) {
            case Helpers.dateFormatConstraints.REVERSE_ORDINARY:
                return `${date}/${month}/${year}${time}`
            case Helpers.dateFormatConstraints.INPUT_TYPE_DATE:
                    return `${year}-${month}-${date}`
            default:
                return `${monthName}, ${date} ${year}${time}`
        }
    }

    static validateDate(datestring: string): boolean {
        const currentDate = new Date().getDate()
        const targetDate = new Date(datestring).getDate()
        return currentDate < targetDate
    }
}


export class Paginator{
    dataSource: Array<{[key: string]: any}> = []
    totalPages: number = 0

    loading: boolean = false

    limit: number = 10
    currentPage: number = 1
    ordering: string = "id"
    search: string = ""

    constructor (
        protected userService?: UserService,
        protected menuService?: MenuService,
    ) {}

    getPaginationData(
        service: UserService | MenuService | RoleService | TenantService | BannerService,
        dialog: MatDialog
    ): void {
        this.loading = true

        service.getList(this.getUrlParams())
            .then((data: PaginatedListResult) => {
                this.dataSource = data.results
                this.totalPages = data.total_pages
                this.dateParser()
            })
            .catch((error) => {
                const exception = new ErrorGenerator(error, dialog)
                exception.throwError()
            })
            .finally(() => this.loading = false)
    }

    dateParser(): void {
        const dateKeys = ["expired_date", "date_joined", "created_date", "modified_date"]

        this.dataSource = this.dataSource.map(data => {
            let output = data
            Object.keys(data).forEach(key => {
                if (dateKeys.includes(key)) output[key] = Helpers.parseDate(output[key])
            })

            return output
        })
    }

    getUrlParams(): string {
        return [
            `limit=${this.limit}`,
            `page=${this.currentPage}`,
            `ordering=${this.ordering}`,
            (this.search !== "") ? `search=${this.search}` : ""
        ].filter(param => param !== "").join("&")
    }
}

export class ErrorGenerator{
    message: string = ""

    constructor(
        private exception: HttpErrorResponse,
        private dialog: MatDialog
    ){}

    throwError() {
        const { error }: HttpErrorResponse = this.exception

        this.message = error.detail
        this.dialog.open(ErrorPopup, { data: { message: this.message }})
    }
}

export class CustomValidator extends Validators{
    static mobilepattern(): ValidatorFn {
        return CustomValidator.generateMobilePatternError
    }

    static generateMobilePatternError(control: AbstractControl): ValidationErrors | null {
        const pattern = /[^0-9]/ig

        if (control.value) {
            const mobilephoneValid: boolean = (control.value.search(pattern) === -1)
    
            if (mobilephoneValid) return null
        }
        return {mobilepattern: true}
    }

    static expirationdate(): ValidatorFn {
        return CustomValidator.expirationDateValidator
    }

    static expirationDateValidator(control: AbstractControl): ValidationErrors | null {
        if (control.value) {
            if (Helpers.validateDate(control.value)) return null
        }
        return { expirationdate: true }
    }
}