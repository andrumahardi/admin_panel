import { HttpClient, HttpErrorResponse, HttpResponse } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Observable } from "rxjs"
import { PreLoginPayload, User } from "../models/users"
import { ConfigService } from "./config.service"

import * as UserActions from "../actions/user.actions"
import { Menu } from "../models/menus"
import { Generics, PaginatedListResult } from "../models/generics"
import { CookieService } from "ngx-cookie-service"
import { AppState } from "../app.states"
import { Store } from "@ngrx/store"

@Injectable({
    providedIn: "root"
})
export class UserService extends ConfigService {

    constructor(
        protected http: HttpClient,
        protected cookieService: CookieService,
        protected store: Store<AppState>
    ) {
        super(http, cookieService, store)
    }
    
    private readonly baseEndpoint: string = `${this.getUrl("users")}/`

    doLogin(payload: PreLoginPayload): Promise<Generics> {
        const url = `${this.baseEndpoint}login`

        return new Promise((resolve, reject) => {
            this.http.post(url, payload, { observe: "response" })
                .subscribe((data: HttpResponse<Generics>) => {
                    const { body }: Generics = data

                    this.cookieService.set("token", body.key)
                    this.cookieService.set("user_id", JSON.stringify(body.id))
                    this.cookieService.set("crm_key", body.crm_key)

                    this.setLoggedinUser(body)
                    resolve(body)
                }, (error: HttpErrorResponse): void => reject(error))
        })
    }

    getUser(id: number): Observable<Generics> {
        const url = `${this.baseEndpoint}${id}/`

        return new Observable<Generics>(observer => {
            return this.http
                .get(url, { headers: { authorization: `Token ${this.getAccessToken()}` }})
                .subscribe((data: Generics): void => {
                    observer.next(data)
                })
        })
    }

    getList(param: string = ""): Promise<PaginatedListResult> {
        if (param) param = `?${param}`
        const url = `${this.baseEndpoint}${param}`

        return new Promise<PaginatedListResult>((resolve, reject) => {
            this.http.get(url, { 
                observe: "response",
                headers: { authorization: `Token ${this.getAccessToken()}` }
            })
                .subscribe((data: Generics): void => {
                    const { body } = data
                    resolve(body)
                }, (error) => reject(error))
        })
    }

    doRegister(payload: Generics): Promise<HttpResponse<Generics>> {
        const url = `${this.baseEndpoint}register`
        return new Promise((resolve, reject) => {
            this.http.post(url, payload, { 
                observe: "response", 
                headers: { authorization: `Token ${this.getAccessToken()}` }
            })
                .subscribe((data): void => resolve(data),
                (error) => reject(error))
        })
    }

    doUpdate(payload: Generics, id: number): Promise<Generics> {
        const url = `${this.baseEndpoint}${id}/`
        return new Promise((resolve, reject) => {
            this.http.patch( url, payload, { 
                    observe: "response", 
                    headers: { authorization: `Token ${this.getAccessToken()}` } 
                })
                .subscribe(
                    ({ body }: Generics): void => resolve(body),
                    (error: HttpErrorResponse): void => reject(error))
        })
    }

    doActivate(payload: Generics, id: number, authorization: string): Promise<void>{
        const url = `${this.baseEndpoint}${id}/?flag=email_activation`
        return new Promise((resolve, reject) => {
            this.http.patch(url, payload, {
                observe: "response",
                headers: { authorization }
            })
                .subscribe((): void => resolve(),
                (error): void => reject(error))
        })
    }

    doLogout(): Promise<void> {
        const url = `${this.baseEndpoint}logout`
        return new Promise((resolve, reject) => {
            this.http.get(url, { 
                observe: "response",
                headers: {
                    authorization: `Token ${this.getAccessToken()}`
                } 
            })
                .subscribe(() => resolve(),
                (err) => reject(err))
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

    doConfirmUser(payload: Generics): Promise<void> {
        const url = `${this.baseEndpoint}send_email_confirmation`
        const crmAccess = this.cookieService.get("crm_key")

        return new Promise((resolve, reject): void => {
            this.http.post(url, payload, {
                headers: { authorization: `Token ${this.getAccessToken()}` },
                params: { "crm_access": crmAccess }
            })
                .subscribe((): void => resolve(),
                (error): void => reject(error))
        })
    }

    setLoggedinUser(payload: Generics): void {
        const user: User = {
            id: payload.id,
            username: payload.username,
            first_name: payload.first_name,
            last_name: payload.last_name,
            email: payload.email,
            mobile: payload.mobile,
            is_active: payload.is_active
        }
        this.store.dispatch(UserActions.setUser({payload: user}))
    }

    setUserMenu(menulist: Array<Generics>): void {
        const menu: Array<Menu> = menulist.map((obj: Generics) => {
            let output: Menu = {
                id: obj.id,
                menu_name: obj.menu_name,
                menu_icon_url: obj.menu_icon_url,
                menu_path_url: obj.menu_path_url,
                parent: obj.parent,
                children: []
            }
            menulist.forEach((child: Generics) => {
                if (obj.id === child.parent) {
                    output["children"].push({
                        id: child.id,
                        menu_name: child.menu_name,
                        menu_icon_url: child.menu_icon_url,
                        menu_path_url: child.menu_path_url,
                        parent: child.parent,
                        children: []
                    })
                }
            })
            return output
        }).filter((obj: Generics) => !obj.parent)

        this.store.dispatch(UserActions.setUserMenu({ payload: menu }))
    }
}