import { Component, Input } from "@angular/core"
import { Menu } from "src/app/models/menus";

@Component({
    selector: "app-collaps-bar",
    templateUrl: "./collapsed_sidebar.component.html",
    styleUrls: [ "./sidebar.component.scss" ]
})

export class CollapsedSideBar {
    @Input() menus: Array<Menu> = []
}