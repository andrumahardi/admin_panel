import { HttpErrorResponse } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Generics, PaginatedListResult } from "../models/generics"
import { ConfigService } from "./config.service"

@Injectable({
    providedIn: "root"
})
export class BannerService extends ConfigService {
    private readonly baseEndpoint: string = `${this.getUrl("banners")}/`

    getList(params: string = ""): Promise<PaginatedListResult> {
        if (params) params = `?${params}`
        const url = `${this.baseEndpoint}${params}`

        return new Promise<PaginatedListResult>((resolve, reject) => {
            this.http.get(url, { observe: "response", headers: { 
                authorization: `Token ${this.getAccessToken()}`
            }})
                .subscribe((data: Generics): void => {
                    const { body } = data
                    resolve(body)
                }, (error: HttpErrorResponse): void => reject(error))
        })
    }

    getBanner(id: number): Promise<Generics> {
        const url = `${this.baseEndpoint}${id}/`

        return new Promise<Generics>((resolve, reject) => {
            this.http.get(url, { headers: { authorization: `Token ${this.getAccessToken()}` }})
                .subscribe((data: Generics): void => resolve(data), 
                (error: HttpErrorResponse) => reject(error))
        })
    }

    doCreate(payload: FormData): Promise<void> {
        const url = this.baseEndpoint

        return new Promise<void>((resolve, reject) => {
            this.http.post(url, payload, { observe: "response", headers: {
                authorization: `Token ${this.getAccessToken()}`
            }})
                .subscribe(() => resolve(),
                (error: HttpErrorResponse) => reject(error))
        })
    }
    
    doUpdate(payload: FormData, id: number): Promise<Generics> {
        const url = `${this.baseEndpoint}${id}/`
        return new Promise((resolve, reject) => {
            this.http.put( url, payload, { observe: "response", headers: {
                authorization: `Token ${this.getAccessToken()}`
            }})
                .subscribe((data): void => resolve(data),
                (error: HttpErrorResponse): void => reject(error))
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