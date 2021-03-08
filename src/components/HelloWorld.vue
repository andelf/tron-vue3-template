<template>
  <h1>{{ msg }}</h1>

  <p>
    Recommended IDE setup:
    <a href="https://code.visualstudio.com/" target="_blank">VSCode</a>
    +
    <a
      href="https://marketplace.visualstudio.com/items?itemName=octref.vetur"
      target="_blank"
      >Vetur</a
    >
    or
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
    (if using
    <code>&lt;script setup&gt;</code>)
  </p>

  <p>See <code>README.md</code> for more information.</p>

  <p>
    <a href="https://vitejs.dev/guide/features.html" target="_blank"
      >Vite Docs</a
    >
    |
    <a href="https://v3.vuejs.org/" target="_blank">Vue 3 Docs</a>
  </p>
  <button @click="count++">count is: {{ count }}</button>
  <p>
    Edit
    <code>components/HelloWorld.vue</code> to test hot module replacement.
  </p>

  <p v-if="tronLinkLoading">Loading ....</p>

  <template v-if="!tronLinkLoading">
    <p v-if="tronLinkReady">
      Address is <code>{{ tronLinkAddress }}</code> Network:
      <code>{{ tronLinkChain }}</code>
    </p>
    <p>
      <input v-model="balance" />&nbsp;
      <button @click="queryBalance">Query Balance</button>&nbsp;
      <button @click="queryTrc20Balance">Query TRC20 Balance</button>
    </p>
    <p>
      <input v-model="toAccount" />
      <button @click="sendTrx">Send 10TRX</button>
    </p>
    <p>
      <code>{{ info }}</code>
    </p>
    <p v-if="!tronLinkInstalled">Please install TronLink!</p>
    <p v-if="tronLinkInstalled && !tronLinkReady">Please unlock TronLink!</p>
  </template>
</template>

<script lang="ts">
import { ref, defineComponent } from "vue";
export default defineComponent({
  name: "HelloWorld",
  props: {
    msg: {
      type: String,
      required: true,
    },
  },
  data() {
    return { info: "", balance: null, toAccount: "" };
  },
  setup: () => {
    const count = ref(0);
    return { count };
  },
  methods: {
    async queryBalance() {
      const resp = await tronWeb.trx.getAccount(tronWeb.defaultAddress.base58);
      this.balance = tronWeb.fromSun(resp.balance);
    },
    async queryTrc20Balance() {
      const CONTRACT = "TF17BgPaZYbz8oxbjhriubPDsA7ArKoLX3";
      const { abi } = await tronWeb.trx.getContract(CONTRACT);
      const contract = tronWeb.contract(abi.entrys, CONTRACT);
      const balance = await contract.methods
        .balanceOf(tronWeb.defaultAddress.base58)
        .call();
      const decimal = await contract.methods.decimals().call();
      // console.log(balance);
      this.balance = balance / Math.pow(10, decimal);
    },
    async sendTrx() {
      await tronWeb.trx
        .sendTrx(this.toAccount, tronWeb.toSun(10))
        .then((resp) => {
          console.log(resp);
          if (resp.result) {
            this.info = resp.txid;
          }
        })
        .catch((err) => {
          console.log("ERROR:", err);
        });
    },
  },
});
</script>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
