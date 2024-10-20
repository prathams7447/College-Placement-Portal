import { observable, action, initialize } from "mobx";

export const mainstore = observable({
    is_loggedin: false,
    userInfo: {
        email: "",
        username:"",
        first_name: "",
        is_student: false,
        is_admin:false
    },
    resetUserInfo() {
        this.userInfo = {
            email: "",
            username: "",
            first_name: "",
            is_student: false,
            is_admin: false
        };
    },
    initialize: function() {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            // Assuming you have a way to decode the token to get user details
            const userDetails = JSON.parse(localStorage.getItem('userinfo')); // Parse the JSON string
    console.log("User details:", userDetails);
            console.log("%%%%%%%%%%%% FFFFFFFFF", userDetails)
            if(accessToken !== null && accessToken !== undefined){
                this.is_loggedin = true;
            }
            if(userDetails !== null && userDetails !== undefined){
                this.userInfo = {
                    email: userDetails.email,
                    username: userDetails.username,
                    first_name: userDetails.first_name,
                    is_student: userDetails.is_student,
                    is_admin: userDetails.is_admin
                };
        }
        }
        console.log("%%%%%%%%%%%% FFFFFFFFF 1111111111111", this.userInfo)
    }
})