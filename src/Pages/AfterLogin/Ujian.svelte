<style>
    .card {
        margin-top: 10px;
    }
</style>
<script>
    import {Helpers} from "../../Components/Common/Helpers";
    import {toast} from "svelte-toastify";

    const my = JSON.parse(localStorage.getItem("fullIdentity"));
    const request = {
        nis:my.nis,
        password:my.password
    }
    let soal = [];
    async function loadSoal() {
        toast.info("Loading . . .")
        const rest = await fetch(ps.env.endpoint+"listujian/"+request.nis+"?"+Helpers.qs(request));
        const json = await rest.json();
        console.log(json)
        if (json.data[0] !== undefined){
            for (const restKey in json.data) {
                soal[restKey] = {
                    title:json.data[restKey][1],
                    tanggal:json.data[restKey][2],
                    waktu:json.data[restKey][3],
                    status:json.data[restKey][4],
                    aksi:(((((json.data[restKey][5]).split("="))[2]).split("'"))[1]).replace(" ",""),
                };
            }
            toast.success("Loaded")

        }else {
            toast.warning("Load Soal Gagal")
        }
    }
    loadSoal()
</script>

<div class="row">
    <div class="col-12">
        <div class="card">
            <div class="card-header">
                <div class="card-title">
                    Daftar Ujian
                </div>
            </div>
            <div class="card-body">

                <div class="table-responsive">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Nama</th>
                                <th>Tanggal</th>
                                <th>Waktu</th>
                                <th>Status Pengerjaan</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                        {#each soal as item , i}
                            <tr>
                                <td>{i+1}</td>
                                <td>{item.title}</td>
                                <td>{item.tanggal}</td>
                                <td>{item.waktu}</td>
                                <td>
                                    <span class="badge badge-primary">
                                        {item.status}
                                    </span>
                                </td>
                                <td>
                                    {#if (item.status === "Belum")}
                                    <a href="/ujian/{item.aksi}" class="btn btn-primary">
                                        Kerjakan
                                    </a>
                                    {/if}
                                </td>
                            </tr>
                        {/each}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    </div>
</div>
