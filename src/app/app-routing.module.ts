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
import { HomeChildComponent } from './components/home/home.component';
import { RoleList } from './components/roles/rolelist/rolelist.component';
import { CreateRole } from './components/roles/crud_role/create_role.component';
import { DetailRole } from './components/roles/crud_role/detail_role.component';

const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "activation/:id/:token", component: ActivationUser },
  { 
    path: "", 
    component: HomeComponent, 
    canActivate: [RouterGuard],
    children: [
      { path: "home", component: HomeChildComponent, pathMatch: "full" },
      { path: "menu", component: Menulist, pathMatch: "full" },
      { path: "menu/create", component: CreateMenu },
      { path: "user", component: UserList, pathMatch: "full" },
      { path: "user/create", component: CreateUser },
      { path: "user/:id", component: DetailUser },
      { path: "role", component: RoleList, pathMatch: "full" },
      { path: "role/create", component: CreateRole },
      { path: "role/:id", component: DetailRole }
    ]
  }
]


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
