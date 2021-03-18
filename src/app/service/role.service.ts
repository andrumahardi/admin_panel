import { HttpErrorResponse } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Generics, PaginatedListResult } from "../models/generics"
import { ConfigService } from "./config.service"

@Injectable({
    providedIn: "root"
})
export class RoleService extends ConfigService {
    private readonly baseEndpoint = `${this.getUrl("roles")}/`

    getList(params: string): Promise<PaginatedListResult> {
        if (params) params = `?${params}`

        const url = `${this.baseEndpoint}${params}`
        const token = this.cookieService.get("token")

        return new Promise<PaginatedListResult>((resolve, reject): void => {
            this.http.get(url, { observe: "response", headers: { 
                authorization: `Token ${token}`
            }})
                .subscribe((data: Generics): void => resolve(data.body),
                (error: HttpErrorResponse): void => reject(error))
        })
    }
}