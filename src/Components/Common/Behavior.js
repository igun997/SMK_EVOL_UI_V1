import { writable } from 'svelte/store';
import { isLogin } from "./Store";
import {navigate} from "svelte-routing";
const rawMenu = [
    {
        type:"loggedIn",
        menus:[
            {
                name:"Dashboard",
                link:"/dashboard"
            },{
                name:"Ujian",
                link:"/ujian"
            },{
                name:"Logout",
                link:null,
                method:function () {
                    localStorage.setItem("isLogin",0);
                    localStorage.setItem("fullIdentity",null);
                    localStorage.removeItem("onProgressId");
                    isLogin.update(value => {
                        return value = 0;
                    })
                    navigate("/login",{replace:true});
                }
            }
        ]
    },{
        type:"loggedOut",
        menus:[
            {
                name:"Login",
                link:"/login"
            }
        ]
    }
]
let menu = [];

export const Behavior = {
    collapseMenu:writable(0),
    menus:rawMenu
};
