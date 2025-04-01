import Model from "./model";
import social_links from "./mysql";

export default function getModel(): Model {
    return social_links;
}