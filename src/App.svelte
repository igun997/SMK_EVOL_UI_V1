<script>
	import { Router, Link, Route } from "svelte-routing";
	import {Behavior} from "./Components/Common/Behavior.js"
	import Popper from 'popper.js';
	import { toast, ToastContainer } from "svelte-toastify";
	import 'bootstrap/dist/js/bootstrap.bundle.min';
	import Foot from "./Components/Partials/Foot.svelte";
	import Menus from "./Components/Partials/Menus.svelte";
	import Head from "./Components/Partials/Head.svelte";
	import HomeBL from "./Pages/BeforeLogin/Home.svelte";
	import Ujian from "./Pages/AfterLogin/Ujian.svelte";
	import UjianDetail from "./Pages/AfterLogin/UjianDetail.svelte";
	import {isLogin} from "./Components/Common/Store";
	const menu = Behavior.collapseMenu;
	let listMenu = [];
	isLogin.subscribe(value => {
		if (value === 0){
			listMenu = Behavior.menus[1].menus
		}else {
			listMenu = Behavior.menus[0].menus
		}
	})
	let isCollapse = false;
	menu.subscribe(value => {
		isCollapse = (value === 1);
	});
	toast.configure({
		position: "top-left"
	});
	export let url = "";
</script>
<svelte:head>
	<svelte:component this="{Head}"/>
</svelte:head>
<Router url="{url}">
	<div class="d-flex {(isCollapse)?'toggled':''}" id="wrapper">
	<div class="bg-light border-right" id="sidebar-wrapper">
		<div class="sidebar-heading">Learning SMK</div>
		<div class="list-group list-group-flush">
			{#each listMenu as item, i}
			<a href="{item.link}" on:click={(item.link === null)?item.method:null} class="list-group-item list-group-item-action bg-light" >{item.name}</a>
			{/each}
		</div>
	</div>
		<div id="page-content-wrapper">

			<svelte:component this="{Menus}"/>

			<div class="container-fluid">
				<Route path="/" component="{HomeBL}" />
				<Route path="/login" component="{HomeBL}" />
				<Route path="/ujian" component="{Ujian}" />
				<Route path="/ujian/:id" component="{UjianDetail}" let:params >
					<UjianDetail id="params.id" />
				</Route>
			</div>
			<ToastContainer />
		</div>
	</div>
</Router>
<svelte:component this="{Foot}"/>
