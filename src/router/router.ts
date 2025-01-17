import { createRouter, createWebHistory } from "vue-router";

import DashboardView from "../views/DashboardView.vue";
import AthleteView from "../views/AthleteView.vue";

const routes = [
  { path: "/", component: DashboardView },
  { path: "/athlete/:id", component: AthleteView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
