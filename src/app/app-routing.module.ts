import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Menulist } from './components/menus/menulist/menulist.component';
import { DetailUser } from './components/users/crud_user/detail_user.component';
import { UserList } from './components/users/userlist/userlist.component';
import { RouterGuard } from './router.guard';
import { HomeComponent } from './screens/home/home.component';
import { LoginComponent } from './screens/login/login.component';
import { CreateUser } from "src/app/components/users/crud_user/create_user.component"
import { CreateMenu } from './components/menus/crud_menu/create_menu.component';
import { ActivationUser } from './screens/activation_user/activation_user.component';
import { HomeChildComponent } from './components/home/home_child.component';
import { RoleList } from './components/roles/rolelist/rolelist.component';
import { CreateRole } from './components/roles/crud_role/create_role.component';
import { DetailRole } from './components/roles/crud_role/detail_role.component';
import { LoginChildComponent } from './components/login/login_child.component';
import { ForgotPassword } from './components/forgot_password/forgot_password.component';
import { ChangePassword } from './components/change_password/change_password.component';
import { DetailMenu } from './components/menus/crud_menu/detail_menu.component';
import { TenantList } from './components/tenants/tenantlist/tenantlist.component';
import { CreateTenant } from './components/tenants/crud_tenant/create_tenant.component';
import { DetailTenant } from './components/tenants/crud_tenant/detail_tenant.component';
import { Profile } from './components/profile/profile.component';
import { BannerList } from './components/banners/bannerlist/bannerlist.component';
import { CreateBanner } from './components/banners/crud_banner/create_banner.component';
import { DetailBanner } from './components/banners/crud_banner/detail_banner.component';

const routes: Routes = [
  { path: "activation/:id/:token", component: ActivationUser },
  { 
    path: "auth", 
    component: LoginComponent,
    children: [
      { path: "login", component: LoginChildComponent, pathMatch: "full" },
      { path: "forgot_password", component: ForgotPassword, pathMatch: "full" },
      { path: ":id/change_password", component: ChangePassword }
    ] 
  },
  { 
    path: "",
    component: HomeComponent, 
    canActivate: [RouterGuard],
    children: [
      { path: "home", component: HomeChildComponent, pathMatch: "full" },
      { path: "menu", component: Menulist, pathMatch: "full" },
      { path: "menu/create", component: CreateMenu },
      { path: "menu/:id", component: DetailMenu },
      { path: "user", component: UserList, pathMatch: "full" },
      { path: "user/create", component: CreateUser },
      { path: "user/:id", component: DetailUser },
      { path: "profile/:id", component: Profile },
      { path: "role", component: RoleList, pathMatch: "full" },
      { path: "role/create", component: CreateRole },
      { path: "role/:id", component: DetailRole },
      { path: "tenant", component: TenantList },
      { path: "tenant/create", component: CreateTenant },
      { path: "tenant/:id", component: DetailTenant },
      { path: "banner", component: BannerList },
      { path: "banner/create", component: CreateBanner },
      { path: "banner/:id", component: DetailBanner },
      { path: "", redirectTo: "/home", pathMatch: "full" }
    ]
  },
  { path: "**", redirectTo: "/home" }
]


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
