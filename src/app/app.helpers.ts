import { HttpErrorResponse } from "@angular/common/http"
import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from "@angular/forms"
import { MatDialog } from "@angular/material/dialog"
import { ErrorPopup } from "./components/modal_dialog/modal_confirm.component"
import { PaginatedListResult } from "./models/generics"
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

    static parseDate(datestring: string, format: string = "M, dd yy", includeTime: boolean = false): string {
        const instance = new Date(datestring)

        const year: number = instance.getFullYear()
        const monthName: string = this.months[instance.getMonth() + 1]
        const month: number = instance.getMonth() + 1
        
        let date: string = instance.getDate().toLocaleString()
        let hour: string = instance.getHours().toLocaleString()
        let minute: string = instance.getMinutes().toLocaleString()

        if (+date < 10) date = `0${date}`
        if (+hour < 10) hour = `0${hour}`
        if (+minute < 10) minute = `0${minute}`

        let time: string = ""
        if (includeTime) time = ` (${hour} : ${minute})`

        switch (format) {
            case "M, dd yy":
                return `${monthName}, ${date} ${year}${time}`
            case "dd/mm/yy":
                return `${date}/${month}/${year}${time}`
            default:
                return `${monthName}, ${date} ${year}${time}`
        }
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
        service: UserService | MenuService | RoleService | TenantService,
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
        this.dataSource = this.dataSource.map(data => {
            return {
                ...data,
                date_joined: Helpers.parseDate(data.date_joined)
            }
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
        const { error, status }: HttpErrorResponse = this.exception

        switch (status) {
            case 400:
                for (const key in error.detail) {
                    this.message = error.detail[key][0]
                    break
                }
                break
            case 500:
                this.message = "Server could not process data"
                break
            default:
                this.message = error.detail
        }
        this.dialog.open(ErrorPopup, { data: { message: this.message }})
    }
}

export class CustomValidator extends Validators{
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