const chainIdMap: { [key: string]: string } = {
  "00000000000000001ebf88508a03865c71d452e25f4d51194196a1d22b6653dc": "Mainnet",
  "0000000000000000de1aa88295e1fcf982742f773e0419c5a9c134c994a9059e":
    "Shasta Testnet",
  "0000000000000000d698d4192c56cb6be724a558448e2684802de4d6cd8690dc":
    "Nile Testnet",
};

export default {
  data() {
    return {
      tronWeb: {
        ready: false,
      },
      tronLinkReady: false,
      tronLinkInstalled: false,
      tronLinkAddress: "",
      tronLinkChain: "",
      tronLinkLoading: true,
    };
  },
  methods: {
    checkTronLink() {
      if (window && window.hasOwnProperty("tronWeb")) {
        this.tronWeb = window.tronWeb;
        this.tronLinkInstalled = true;
        this.tronLinkReady = window.tronWeb.ready;
        this.tronLinkLoading = false;
        console.log("TronLink is OK!");
      } else {
        this.tronLinkInstalled = false;
        this.tronLinkReady = false;
        console.log("TronLink is not installed");
      }
    },
  },
  mounted() {
    let _this = this;

    window.addEventListener("message", ({ data }) => {
      const { message, isTronLink } = data;
      if (isTronLink) {
        const { action, data } = message;
        console.log("E action", action, data);
        switch (action) {
          case "tabReply":
            if (data.success && data.data.address) {
              this.tronLinkAddress = data.data.address;
              this.tronLinkChain = data.data.node.name;
            }
            break;
          case "setAccount":
            if (data.address !== this.tronLinkAddress) {
              if (data.address) {
                this.tronLinkAddress = data.address;
              } else {
                this.tronLinkAddress = "";
                this.tronLinkReady = false;
              }
            }
            break;
          case "setNode":
            if (data.node.fullNode === "https://api.nileex.io") {
              this.tronLinkChain = "Nile Testnet";
            } else if (data.node.fullNode === "https://api.tronstack.io") {
              this.tronLinkChain = "Mainnet";
            } else if (
              data.node.fullNode === "https://api.shasta.trongrid.io"
            ) {
              this.tronLinkChain = "Shasta Testnet";
            } else {
              this.tronWeb.trx
                .getBlockByNumber(0)
                .then(({ blockID }) => {
                  if (chainIdMap.has(blockID)) {
                    this.tronLinkChain = chainIdMap[blockID];
                  } else {
                    this.tronLinkChain = "Unknown Chain";
                  }
                })
                .catch(() => {
                  this.tronLinkChain = "Node Error";
                });
            }
            break;
          default:
            break;
        }
      }
    });

    setTimeout(function tick() {
      _this.checkTronLink();
      if (!this.tronWeb || !this.tronWeb.ready) {
        setTimeout(tick, 1000);
      }
    }, 0);
  },
};
