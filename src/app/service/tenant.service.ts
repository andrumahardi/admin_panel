import { HttpClient, HttpErrorResponse } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { CookieService } from "ngx-cookie-service"
import { Observable } from "rxjs"
import { PaginatedListResult } from "../models/generics"
import { ConfigService } from "./config.service"

@Injectable({
    providedIn: "root"
})
export class TenantService {
    constructor(
        private http: HttpClient, 
        private configService: ConfigService,
        private cookieService: CookieService,
    ) {}

    private baseEndpoint = `${this.configService.getUrl("tenants")}/`

    getList(params: string = ""): Observable<PaginatedListResult> {
        if (params) params = `?${params}`

        const url = `${this.baseEndpoint}${params}`
        const token = this.cookieService.get("token")

        return new Observable<PaginatedListResult>(observer => {
            return this.http.get(url, { observe: "response", headers: { 
                authorization: `Token ${token}`
            }})
                .subscribe((data: {[key: string]: any}): void => {
                    const { body } = data
                    observer.next(body)
                }, ({ error }: HttpErrorResponse): void => {
                    observer.error(error)
                })
        })
    }
}