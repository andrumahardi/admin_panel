import { 
    Component, 
    EventEmitter, 
    Input, 
    OnChanges, 
    Output, 
    SimpleChanges 
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/app.states";
import { Generics } from "src/app/models/generics";

@Component({
    selector: "app-menu-form",
    templateUrl: "./menu_form.component.html",
    styleUrls: [ "./menu_styles.component.scss" ]
})

export class MenuForm implements OnChanges{
    @Input() data: Generics = {}
    @Input() disableState: boolean = false
    @Input() forEdit: boolean = false

    @Output() submitEvent = new EventEmitter<{[key: string]: FormControl}>()
    @Output() cancelEvent = new EventEmitter<void>()

    readonly errorMessages = {
        required: "This field is required!",
        maxlength: "Characters should not exceed 20 letters",
        minlength: "Characters too short ( < 5 letters )"
    }

    constructor(
        private store: Store<AppState>,
    ) {
        this.fetchRequiredData()
    }

    ngOnChanges(event: SimpleChanges) {
        if (event.disableState) {
            this.disableState = event.disableState.currentValue

            this.setControlStates(this.data)
        }

        if (event.data) {
            this.setControlStates(event.data.currentValue)
        }
    }

    private fetchRequiredData(): void {

    }

    readonly formControl: {[key: string]: FormControl} = {
        menu_name: new FormControl({ value: "", disabled: this.disableState }),
        menu_path_url: new FormControl({ value: "", disabled: this.disableState }),
        menu_seq: new FormControl({ value: "", disabled: this.disableState }),
        parent: new FormControl({ value: "", disabled: this.disableState }),
        description: new FormControl({ value: "", disabled: this.disableState })
    }

    onSubmit(): void {
        const formValid: boolean = Object.values(this.formControl)
            .every((control) => !control.errors)
        
        if(formValid) {
            this.submitEvent.emit(this.formControl) 
        }
    }
    onCancel: () => void = (): void => this.cancelEvent.emit()

    setControlStates(data: Generics): void {
        for (const key in this.formControl) {
            this.formControl[key].reset({ value: data[key], disabled: this.disableState })
        }
    }
}