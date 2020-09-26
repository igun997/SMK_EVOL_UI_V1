<script>

    import {toast, ToastContainer} from "svelte-toastify";
    import {navigate} from "svelte-routing";
    import {isLogin} from "../../Components/Common/Store"
    import {Helpers} from "../../Components/Common/Helpers";

    const endpoint = ps.env.endpoint;
    let dform = {
        nis: "",
        password: ""
    };

    let result = null
    localStorage.setItem("isLogin", 0);

    async function loginOn() {
        const res = await fetch(endpoint + "login?"+Helpers.qs(dform))

        const json = await res.json()

        if (json.status === 1) {
            dform.nama = json.data.nama
            toast.success("Username & Password Benar")
            localStorage.setItem("isLogin", 1);
            localStorage.setItem("fullIdentity", JSON.stringify(dform));
            isLogin.update(n => n + 1);
            navigate("/dashboard", {replace: true});
        } else {
            toast.info("Silahkan Cek Kembali Username & Password Anda")
        }
    }
</script>
<style>
    img {
        max-height: 100px;
        display: block;
        margin-left: auto;
        margin-right: auto;
        margin-bottom: 80px;
    }


    .form-group {
        margin: 27px 20px 20px
    }
    #home_layout{
        margin-top:10px;
    }
</style>
<div class="row" id="home_layout">
    <div class="col-12">
        <img src="{ps.env.logo}" alt="">
    </div>
    <div class="col-md-6 offset-md-3 col-12">
       <div class="card">
           <div class="card-body">
               <div class="form-group">
                   <label for="email">NIS</label>
                   <input type="text" id="email" bind:value={dform.nis} name="email" class="form-control">
               </div>
               <div class="form-group">
                   <label for="password">Password</label>
                   <input type="password" id="password" bind:value={dform.password} name="password" class="form-control">
               </div>

               <div class="form-group">
                   <button class="btn btn-primary text-center btn-block" on:click={loginOn} type="button">Login</button>
               </div>
           </div>
       </div>
    </div>
</div>
