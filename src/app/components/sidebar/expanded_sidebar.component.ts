import { Component, Input } from "@angular/core"
import { Menu } from "src/app/models/menus";

@Component({
    selector: "app-expand-bar",
    templateUrl: "./expanded_sidebar.component.html",
    styleUrls: [ "./sidebar.component.scss" ]
})

export class ExpandedSidebar {
    @Input() menus: Array<Menu> = []
}