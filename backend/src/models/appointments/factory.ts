import Model from "./model";
import appointments from "./mysql";

export default function getModel(): Model {
    return appointments;
}