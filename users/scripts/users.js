import { GSgetAllUsers } from "../../assets/scripts/gs-api.js";


GSgetAllUsers({type: "all", data: null}, (data) => {
    console.log(data);
})