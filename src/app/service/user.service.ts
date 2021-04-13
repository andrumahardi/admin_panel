import { HttpErrorResponse, HttpResponse } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { PreLoginPayload, User } from "../models/users"
import { ConfigService } from "./config.service"

import * as UserActions from "../actions/user.actions"
import { Generics, PaginatedListResult } from "../models/generics"

@Injectable({
    providedIn: "root"
})
export class UserService extends ConfigService {
    private readonly baseEndpoint: string = `${this.getUrl("users")}/`

    doLogin(payload: PreLoginPayload): Promise<Generics> {
        const url = `${this.baseEndpoint}login`

        return new Promise((resolve, reject) => {
            this.http.post(url, payload, { observe: "response" })
                .subscribe((data: HttpResponse<Generics>) => {
                    const { body }: Generics = data
                    
                    localStorage.setItem("token", body.key)
                    localStorage.setItem("user_id", String(body.id))

                    this.setLoggedinUser(body)
                    resolve(body)
                }, (error: HttpErrorResponse): void => reject(error))
        })
    }

    getUser(id: number): Promise<Generics> {
        const url = `${this.baseEndpoint}${id}/`

        return new Promise<Generics>((resolve, reject) => {
            this.http.get(url, { headers: { authorization: `Token ${this.getAccessToken()}` }})
                .subscribe((data: Generics): void => resolve(data), 
                (error: HttpErrorResponse) => reject(error))
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
            this.http.put( url, payload, { 
                    observe: "response", 
                    headers: { authorization: `Token ${this.getAccessToken()}` } 
                })
                .subscribe(
                    ({ body }: Generics): void => resolve(body),
                    (error: HttpErrorResponse): void => reject(error))
        })
    }

    doUpdateProfile(payload: FormData, id: Number): Promise<Generics> {
        const url = `${this.baseEndpoint}${id}/profile`
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

    doActivate(id: number, authorization: string): Promise<void>{
        const url = `${this.baseEndpoint}${id}/email_activation`
        return new Promise((resolve, reject) => {
            this.http.get(url, {
                observe: "response",
                headers: { authorization }
            })
                .subscribe((): void => resolve(),
                (error): void => reject(error))
        })
    }

    doLogout(): Promise<boolean> {
        const url = `${this.baseEndpoint}logout`
        const token = `Token ${this.getAccessToken()}`
        
        localStorage.removeItem("token")
        localStorage.removeItem("user_id")
        return new Promise<boolean>((resolve) => {
            this.http.get(url, { observe: "response", headers: {
                authorization: token
            }}).subscribe(() => resolve(true))
        })
    }

    doChangePassword(payload: Generics, id: number): Promise<void> {
        const url = `${this.baseEndpoint}${id}/change_password`

        return new Promise((resolve, reject) => {
            this.http.patch(url, payload, { observe: "response", headers: {
                authorization: `Token ${this.getAccessToken()}`
            }})
                .subscribe(() => resolve(),
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

    doConfirmUser(payload: Generics): Promise<void> {
        const url = `${this.baseEndpoint}send_email_confirmation`

        return new Promise((resolve, reject): void => {
            this.http.post(url, payload, {
                headers: { authorization: `Token ${this.getAccessToken()}` }
            })
                .subscribe((): void => resolve(),
                (error): void => reject(error))
        })
    }

    doResetPassword(params: string): Promise<void> {
        const url = `${this.baseEndpoint}reset_password?${params}`

        return new Promise<void>((resolve, reject) => {
            this.http.get(url, { observe: "response" })
                .subscribe(() => resolve(),
                (error: HttpErrorResponse) => reject(error))
        })
    }

    setLoggedinUser(payload: Generics): User {
        const user: User = {
            id: payload.id,
            username: payload.username,
            first_name: payload.first_name,
            last_name: payload.last_name,
            email: payload.email,
            mobile: payload.mobile,
            is_active: payload.is_active,
            profile_image: payload.profile_image
        }
        this.store.dispatch(UserActions.setUser({payload: user}))

        return user
    }
}