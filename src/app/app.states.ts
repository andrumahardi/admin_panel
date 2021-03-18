import { ArrayOfObjects } from "./models/generics";
import { UserStates } from "./models/users";

export interface AppState {
    readonly userStates: UserStates,
    readonly dropdownItems: ArrayOfObjects
}