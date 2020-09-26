<script>
import {isLogin} from  "../Common/Store.js";
import {Behavior} from  "../Common/Behavior.js";
import { navigate } from "svelte-routing";
let login = 0;

const unsubscribe = isLogin.subscribe(value => {
    login = value;
});
isLogin.update(n => {
    const localLogin = parseInt(localStorage.getItem("isLogin"));
    if (localLogin === 1){
        n = localLogin;
    }else {
         n = 0;
    }
    return n;
});

let defCollapse = 0;
const menu = Behavior.collapseMenu;
function toogle() {
    console.log("Updated "+defCollapse);
    menu.update(update => {
        if (update === 0){
            update = 1
        }else {
            update = 0
        }
        defCollapse = update;
        return update;
    })
}
const my = JSON.parse(localStorage.getItem("fullIdentity"));
let identity = "";
if (my !== null){
    if (my.nama !== undefined){
        identity = my.nama+" - "+my.nis
    }
}
</script>
<style>

    button {
        border-color: transparent !important;
    }

</style>

<nav class="navbar navbar-expand-lg navbar-light bg-light border-bottom">
    <button class="btn btn-default" on:click={toogle}>
        <span class="navbar-toggler-icon"></span>
    </button>
    <button class="btn btn-default" type="button">
        {identity}
    </button>

</nav>
