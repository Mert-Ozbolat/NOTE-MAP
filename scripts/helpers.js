import { gotoIcon, homeIcon, jobIcon, parkIcon } from "./constants.js";


function getIcon(status) {
    switch (status) {
        case "goto":
            return gotoIcon;

        case "home":
            return homeIcon;

        case "job":
            return jobIcon;

        case "park":
            return parkIcon;

        default:
            return undefined;
    }
}




export function getStatus(status) {
    switch (status) {
        case "goto":
            return "Visit";

        case "home":
            return "Home";

        case "job":
            return "Job";

        case "park":
            return "Park";

        default:
            return "Default";
    }
}






export default getIcon;