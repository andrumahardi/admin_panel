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

    getTenant(id: number): Promise<Generics> {
        const url = `${this.baseEndpoint}${id}/`

        return new Promise<Generics>((resolve, reject) => {
            this.http.get(url, { headers: { authorization: `Token ${this.getAccessToken()}` }})
                .subscribe((data: Generics): void => resolve(data), 
                (error: HttpErrorResponse) => reject(error))
        })
    }

    doCreate(payload: Generics): Promise<Generics> {
        const url = this.baseEndpoint

        return new Promise<Generics>((resolve, reject) => {
            this.http.post(url, payload, { observe: "response", headers: {
                authorization: `Token ${this.getAccessToken()}`
            }})
                .subscribe((data) => resolve(data),
                (error: HttpErrorResponse) => reject(error))
        })
    }

    doUpdate(payload: Generics, id: number): Promise<Generics> {
        const url = `${this.baseEndpoint}${id}/`
        return new Promise((resolve, reject) => {
            this.http.patch( url, payload, { observe: "response", headers: {
                authorization: `Token ${this.getAccessToken()}` } 
            })
                .subscribe(({ body }: Generics): void => resolve(body),
                (error: HttpErrorResponse): void => reject(error))
        })
    }

    doDestroy(id: number): Promise<void> {
        const url = `${this.baseEndpoint}${id}/`
        return new Promise((resolve, reject) => {
            this.http.delete(url, { 
                observe: "response", 
                headers: { authorization: `Token ${this.getAccessToken()}` } 
            })
                .subscribe((): void => resolve(),
                (error: HttpErrorResponse): void => reject(error))
        })
    }
}