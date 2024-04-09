import { createRouter, createWebHistory } from "vue-router";
import CityView from "@/views/CityView.vue";
import HomeView from "@/views/HomeView.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            name: "home",
            component: HomeView,
            meta: {
                title: "Home",
            }
        },
        {
            path: "/weather/:state/:city",
            name: "cityView",
            component: CityView,
            meta: {
                title: "Weather",
            }
        }
    ]
});

router.beforeEach((to, from, next) => {
    document.title = `${to.params.city ? to.params.city : to.meta.title} | The Local Weather`;
    next();
})

export default router;