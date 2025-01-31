import { createRouter, createWebHistory } from "vue-router";

import DashboardView from "../views/DashboardView.vue";
import AthleteView from "../views/AthleteDetailView.vue";

const routes = [
  { path: "/", component: DashboardView },
  { path: "/athlete/:id", component: AthleteView, props: true },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
