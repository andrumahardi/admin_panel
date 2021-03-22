import { HttpErrorResponse } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Generics } from "../models/generics"
import { ConfigService } from "./config.service"

@Injectable({
    providedIn: "root"
})
export class CityService extends ConfigService {
    private readonly baseEndpoint: string = `${this.getUrl("cities")}/`

    getAll(): Promise<Array<Generics>> {
        const url = `${this.baseEndpoint}get_all`

        return new Promise<Array<Generics>>((resolve, reject) => {
            this.http.get(url, { observe: "response", headers: {
                authorization: `Token ${this.getAccessToken()}`
            }})
                .subscribe((data: Generics) => resolve(data.body),
                (error: HttpErrorResponse) => reject(error))
        })
    }
}