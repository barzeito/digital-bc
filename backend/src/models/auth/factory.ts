import Model from "./model";
import auth from "./mysql";

export default function getModel(): Model {
    return auth;
}