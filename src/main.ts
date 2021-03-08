import { createApp } from "vue";
import App from "./App.vue";
import tronLinkMixin from "./mixins/vue-tronlink";

const app = createApp(App);

app.mixin(tronLinkMixin);
app.mount("#app");
