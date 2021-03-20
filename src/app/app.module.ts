// Angular main dependencies
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { HttpClientModule } from "@angular/common/http"

// Third party and supporting dependencies
import { StoreModule } from '@ngrx/store';
import { CookieService } from "ngx-cookie-service"
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatExpansionModule } from "@angular/material/expansion"
import { MatMenuModule } from "@angular/material/menu"
import { MatTableModule } from "@angular/material/table"
import { MatPaginatorModule } from "@angular/material/paginator"
import { MatInputModule } from "@angular/material/input"
import { MatSelectModule } from "@angular/material/select"
import { MatDialogModule } from '@angular/material/dialog'
import { MatSortModule } from "@angular/material/sort"
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'

// Routing modules
import { AppRoutingModule } from './app-routing.module';
import { RouterGuard } from './router.guard';

// Component modules
import { AppComponent } from './app.component';
import { LoginComponent } from "./screens/login/login.component"
import { LoginChildComponent } from "src/app/components/login/login_child.component"
import { HomeComponent } from "./screens/home/home.component"
import { userReducer } from './reducers/user.reducers';
import { dropdownItemsReducer } from "src/app/reducers/dropdown_items.reducers"
import { ActivationUser } from "src/app/screens/activation_user/activation_user.component"
import { ForgotPassword } from "src/app/components/forgot_password/forgot_password.component"
import { ChangePassword } from "src/app/components/change_password/change_password.component"

// Modal dialogs
import { ConfirmDeleteDialog } from "src/app/components/modal_dialog/modal_confirm.component"
import { ConfirmUpdateDialog } from "src/app/components/modal_dialog/modal_confirm.component"
import { ErrorPopup } from "src/app/components/modal_dialog/modal_confirm.component"

// Navigation bars
import { UpperBar } from './components/upperbar/upperbar.component';
import { ExpandedSidebar } from './components/sidebar/expanded_sidebar.component';
import { CollapsedSideBar } from "./components/sidebar/collapsed_sidebar.component"

// Menu modules
import { Menulist } from 'src/app/components/menus/menulist/menulist.component'
import { CreateMenu } from "src/app/components/menus/crud_menu/create_menu.component"
import { MenuForm } from "src/app/components/menus/crud_menu/menu_form.component"

// User modules
import { UserList } from "src/app/components/users/userlist/userlist.component"
import { UserForm } from "src/app/components/users/crud_user/user_form.component"
import { CreateUser } from "src/app/components/users/crud_user/create_user.component"
import { DetailUser } from "src/app/components/users/crud_user/detail_user.component"

// Home modules
import { HomeChildComponent } from "src/app/components/home/home_child.component"


// Role modules
import { RoleList } from "src/app/components/roles/rolelist/rolelist.component"
import { RoleForm } from "src/app/components/roles/crud_role/role_form.component"
import { CreateRole } from "src/app/components/roles/crud_role/create_role.component"
import { DetailRole } from './components/roles/crud_role/detail_role.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LoginChildComponent,
    HomeComponent,
    HomeChildComponent,
    ActivationUser,
    UpperBar,
    ExpandedSidebar,
    CollapsedSideBar,
    Menulist,
    CreateMenu,
    MenuForm,
    UserList,
    UserForm,
    DetailUser,
    CreateUser,
    RoleList,
    RoleForm,
    CreateRole,
    DetailRole,
    ConfirmDeleteDialog,
    ConfirmUpdateDialog,
    ErrorPopup,
    ForgotPassword,
    ChangePassword
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    StoreModule.forRoot({
      userStates: userReducer,
      dropdownItems: dropdownItemsReducer
    }),
    MatExpansionModule,
    MatMenuModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatSortModule,
    MatProgressSpinnerModule,
    BrowserAnimationsModule
  ],
  providers: [ CookieService, RouterGuard ],
  bootstrap: [AppComponent]
})
export class AppModule { }
