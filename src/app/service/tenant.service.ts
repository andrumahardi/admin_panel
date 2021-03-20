import { HttpErrorResponse } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { ArraysInObject, Generics, PaginatedListResult } from "../models/generics"
import { ConfigService } from "./config.service"

@Injectable({
    providedIn: "root"
})
export class TenantService extends ConfigService {
    private readonly baseEndpoint = `${this.getUrl("tenants")}/`

    getList(params: string = ""): Promise<PaginatedListResult> {
        if (params) params = `?${params}`

        const url = `${this.baseEndpoint}${params}`

        return new Promise<PaginatedListResult>((resolve, reject) => {
            this.http.get(url, { observe: "response", headers: { 
                authorization: `Token ${this.getAccessToken()}`
            }})
                .subscribe((data: Generics): void => resolve(data.body), 
                (error: HttpErrorResponse): void => reject(error))
        })
    }

    getAll(): Promise<ArraysInObject> {
        const url = `${this.baseEndpoint}get_all`

        return new Promise<ArraysInObject>((resolve, reject) => {
            this.http.get(url, { observe: "response", headers: {
                authorization: `Token ${this.getAccessToken()}`
            }})
                .subscribe((data: Generics): void => resolve(data.body),
                (err: HttpErrorResponse): void => reject(err))
        })
    }

}