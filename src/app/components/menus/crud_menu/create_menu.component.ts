import { Component } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Generics } from "src/app/models/generics";

import { ErrorPopup } from "../../modal_dialog/modal_confirm.component";

@Component({
    selector: "app-detail-user",
    templateUrl: "./create_menu.component.html",
    styleUrls: [ "./menu_styles.component.scss" ]
})

export class CreateMenu{
    formControlData: Generics = {
        menu_name: "",
        menu_path_url: "",
        menu_seq: "",
        parent: "",
        description: ""
    }

    constructor(
        private dialog: MatDialog,
    ) {
        this.setControlStates()
    }

    closeForm(): void {
        this.setControlStates()
    }

    create(eventPayload: {[key: string]: FormControl}): void {
        const payload: Generics = {
            menu_name: eventPayload.menu_name.value,
            menu_seq: eventPayload.menu_seq.value,
            parent_id: eventPayload.parent.value,
            description: eventPayload.description.value,
            menu_path_url: eventPayload.menu_path_url.value
        }

        console.log(payload)
    }

    setControlStates(): void {
        this.formControlData = {
            menu_name: "",
            menu_path_url: "",
            menu_seq: "",
            parent: "",
            description: ""
        }
    }
}