import { HttpErrorResponse } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { ArraysInObject, Generics, PaginatedListResult } from "../models/generics"
import { ConfigService } from "./config.service"

@Injectable({
    providedIn: "root"
})
export class RoleService extends ConfigService {
    private readonly baseEndpoint = `${this.getUrl("roles")}/`

    getList(params: string): Promise<PaginatedListResult> {
        if (params) params = `?${params}`

        const url = `${this.baseEndpoint}${params}`

        return new Promise<PaginatedListResult>((resolve, reject): void => {
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
                .subscribe((data: Generics) => resolve(data.body),
                (error: HttpErrorResponse) => reject(error))
        })
    }

    getRole(id: number): Promise<Generics> {
        const url = `${this.baseEndpoint}${id}/`

        return new Promise<Generics>((resolve, reject) => {
            this.http.get(url, { headers: { authorization: `Token ${this.getAccessToken()}` }})
                .subscribe((data: Generics): void => resolve(data), 
                (error: HttpErrorResponse) => reject(error))
        })
    }

    doCreate(payload: Generics): Promise<void> {
        const url = this.baseEndpoint

        return new Promise<void>((resolve, reject) => {
            this.http.post(url, payload, { observe: "response", headers: {
                authorization: `Token ${this.getAccessToken()}`
            }})
                .subscribe(() => resolve(),
                (error: HttpErrorResponse) => reject(error))
        })
    }

    doUpdate(payload: Generics, id: number): Promise<Generics> {
        const url = `${this.baseEndpoint}${id}/`

        return new Promise<Generics>((resolve, reject) => {
            this.http.put(url, payload, { observe: "response", headers: {
                authorization: `Token ${this.getAccessToken()}`
            }})
                .subscribe((data: Generics) => resolve(data),
                (error: HttpErrorResponse) => reject(error))
        })
    }

    doDestroy(id: number): Promise<boolean> {
        const url = `${this.baseEndpoint}${id}/`

        return new Promise((resolve, reject) => {
            this.http.delete(url, { 
                observe: "response", 
                headers: { authorization: `Token ${this.getAccessToken()}` } 
            })
                .subscribe((): void => resolve(true),
                (error: HttpErrorResponse): void => reject(error))
        })
    }
}