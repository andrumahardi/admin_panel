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
}