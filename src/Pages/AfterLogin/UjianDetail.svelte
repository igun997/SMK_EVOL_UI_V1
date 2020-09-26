<style>
    .card {
        margin-top: 10px;
    }
</style>
<script>
    import { fade,fly } from 'svelte/transition';
    import {toast} from "svelte-toastify";
    import { writable } from 'svelte/store';
    import {Helpers} from "../../Components/Common/Helpers";
    import {navigate} from "svelte-routing";

    export let id;
    const lastCredential = localStorage.getItem("onProgressId");
    let lastId = null
    if (lastCredential !== null){
        lastId = lastCredential
    }
    let title = null;
    let correctCredential = false;

    const my = JSON.parse(localStorage.getItem("fullIdentity"));
    const request = {
        nis:my.nis,
        password:my.password
    }
    let soal = null;
    let soalDate = writable({
        buka:0,
        tutup:0
    })
    async function loadSoal() {
        const rest = await fetch(ps.env.endpoint+"listsoal/"+id+"?"+Helpers.qs(request));
        const json = await rest.json();
        if (json.status === 1){
            if (lastId !== null){
                //OLD
                if(json.data[lastId] !== undefined){
                    soal = json.data[lastId];
                    console.log(soal)
                    title = "Anda Sedang Mengerjakan : "+soal.nama_ujian
                    soalDate.update(value => {
                        value = {
                            buka:new Date(soal.buka).getTime(),
                            tutup:new Date(soal.ditutup).getTime(),
                            waktu:soal.waktu
                        }

                        return value
                    })
                    console.log(soalDate)
                }else {
                    toast.info("Ada Ujian Yang Belum Di Selesaikan")
                    title  = "Dialihkan . . .";
                    // navigate("/ujian/"+lastId,{replace:false});
                    setTimeout(function () {
                        location.href = "/ujian/"+lastId
                    },1000)
                }
            }else{
                //New
                if (json.data[id] !== undefined){
                    localStorage.setItem("onProgressId",id);
                    soal = json.data[id];
                    soalDate.update(value => {
                        value = {
                            buka:new Date(soal.buka).getTime(),
                            tutup:new Date(soal.ditutup).getTime(),
                            waktu:soal.waktu
                        }
                        return value
                    })
                    title = "Anda Akan Mengerjakan : "+soal.nama_ujian
                }else {
                    toast.error("Data Rusak Silahkan Hubungi Operator")
                }

            }
        }else {
            toast.warning("Load Soal Gagal")
        }
    }

    let pin = "";
    let waktu = "00:00:00";
    const currentDate = new Date().getTime();

    function checkPin() {
        if (soal !== null){
            const currentPin = parseInt(soal.pin);
            const inputPin = parseInt(pin);
            if(currentPin === inputPin) {
                toast.success("PIN Terverifikasi")
                correctCredential = true;
                runCountdown();
            }else{
                toast.error("PIN Salah");

            }
        }else {
            toast.error("Silahkan Reload Halaman Ini ! , Jika Berlanjut Hubungi Operator")
        }
    }
    loadSoal()
    function isExpired(timestamp){
        return (currentDate > timestamp)
    }
    function secondsToHms(d) {
        d = Number(d);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);


        return h +":"+ m +":"+ s;
    }
    let timeleft = 0;
    soalDate.subscribe(value => {
        console.log(currentDate)
        console.log(value.tutup)
        //Cek Ujian Sudah Dimulai ?
        if (!ps.env.debug){
            const isStart = (isExpired(value.buka));
            const isEnded = (!isExpired(value.tutup));
            if (!isStart){
                toast.info("Ujian Belum Dimulai")
                localStorage.removeItem("onProgressId")
                navigate("/ujian",{replace:true});
            }else{
                if (!isEnded){
                    toast.info("Ujian Telah Selesai")
                    localStorage.removeItem("onProgressId")
                    navigate("/ujian",{replace:true});
                }
            }
        }
        if (ps.env.debug){
            //Exta Time
            value.tutup = value.tutup + (3600*1000)
        }
        timeleft = (value.waktu*60)
        waktu = secondsToHms(timeleft)
    })
    let countdown = null;
    let jawaban = [];
    function runCountdown() {
        countdown = setInterval(function () {
            if (timeleft < 0){
                clearInterval(countdown);
            }
            timeleft -= 1;
            waktu = secondsToHms(timeleft);
        },1000)
    }
    let point = [
        "A","B","C","D","E"
    ]
    function log() {
        console.log(jawaban);
    }

</script>

<div class="row">
    <div class="col-12">
        <div class="card">
            <div class="card-header">
                <div class="card-title">
                    {title}
                </div>


            </div>
            <div class="card-body">
                <div class="card-title">
                    {waktu}
                </div>
                {#if !correctCredential}
                    <div class="form-group col-12 col-md-4 offset-md-4" transition:fade>
                        <label for="pin">Masukan PIN</label>
                        <input type="text" bind:value={pin} class="form-control" />
                    </div>
                    <div class="form-group col-12 col-md-4 offset-md-4" transition:fade>
                        <button class="btn btn-primary btn-block" type="button" on:click={checkPin}>
                            Cek PIN
                        </button>
                    </div>
                {/if}

            <div class="row" >
                {#if correctCredential}
                    {#each soal.soal as item ,i}
                        <div class="col-12" transition:fly>
                            <div class="card">
                                <div class="card-body">
                                    <div class="card-text">
                                        {@html item.soal}
                                    </div>
                                    <hr>
                                    {#if item.tipe === "pg"}
                                        <div class="card-body">
                                            <div class="row">
                                                {#each point as point_item,index_point}
                                                <div class="col-1" on:click={log}>
                                                    <label class="btn btn-secondary btn-block">
                                                        <input type="radio" value="{point_item}" bind:group={jawaban[i]} name="choices_{i}" id="choices_{index_point}_{i}" autocomplete="off" >
                                                        <p>{point_item}</p>
                                                    </label>
                                                </div>
                                                <div class="col-11">
                                                    {#if (point_item === "A")}
                                                        {@html item.pg_a}
                                                    {:else if (point_item === "B")}
                                                        {@html item.pg_b}
                                                    {:else if (point_item === "C")}
                                                        {@html item.pg_c}
                                                    {:else if (point_item === "D")}
                                                        {@html item.pg_d}
                                                    {:else if (point_item === "E")}
                                                        {@html item.pg_e}
                                                    {/if}

                                                </div>
                                                {/each}
                                            </div>
                                        </div>
                                    {:else}
                                        <textarea class="form-control" bind:value={jawaban[i]} cols="30" rows="10"></textarea>
                                    {/if}
                                </div>
                            </div>
                        </div>
                    {/each}
                {/if}
            </div>
            </div>
        </div>
    </div>
</div>
