const { default: n } = (() => {
  const e = require("child_process");
  return e && e.__esModule ? e : Object.assign(/* @__PURE__ */ Object.create(null), e, { default: e, [Symbol.toStringTag]: "Module" });
})();
function l() {
  switch (process.platform) {
    case "win32":
      return s();
    case "linux":
    case "freebsd":
    case "openbsd":
    case "netbsd":
      return o();
    case "darwin":
      return i();
    default:
      return c();
  }
}
function s() {
  let e = c();
  try {
    let a = n.execSync("wmic baseboard get manufacturer,product,version,serialnumber").toString().split(/\r\n/).filter((t) => t.trim()).map((t) => t.replace(/\r?\n?/, "").trim().split(/ {2,}/).map((r) => r.trim()));
    a.length === 2 && a[0].forEach((t, r) => {
      t = t.toLowerCase(), t && (t === "serialnumber" && (t = "serial"), e[t] = a[1][r] || "");
    });
  } catch (a) {
    console.error("get baseboard error: ", a);
  }
  return e;
}
function o() {
  let e = c(), a = [];
  try {
    a = n.execSync("export LC_ALL=C; dmidecode -t 2 2>/dev/null; unset LC_ALL").toString().split(`
`);
  } catch (t) {
    try {
      a = n.execSync(
        `echo -n "product name: "; cat /sys/devices/virtual/dmi/id/board_name 2>/dev/null; echo;
          echo -n "serial number: "; cat /sys/devices/virtual/dmi/id/board_serial 2>/dev/null; echo;
          echo -n "manufacturer: "; cat /sys/devices/virtual/dmi/id/board_vendor 2>/dev/null; echo;
          echo -n "version: "; cat /sys/devices/virtual/dmi/id/board_version 2>/dev/null; echo;`
      ).toString().split(`
`);
    } catch {
      console.error("get baseboard error: ", t);
    }
  }
  return a.forEach((t) => {
    let r = t.split(":");
    if (r.length === 2)
      switch (r[0].trim().toLowerCase()) {
        case "manufacturer":
          e.manufacturer = r[1].trim();
          break;
        case "product name":
          e.product = r[1].trim();
          break;
        case "version":
          e.version = r[1].trim();
          break;
        case "serial number":
          e.serial = r[1].trim();
          break;
      }
  }), e;
}
function i() {
  let e = c();
  try {
    n.execSync("ioreg -c IOPlatformExpertDevice -d 2").toString().replace(/[<>"]/g, "").split(`
`).forEach((t) => {
      let r = t.split("=");
      if (r.length === 2)
        switch (r[0].trim().toLowerCase()) {
          case "manufacturer":
            e.manufacturer = r[1].trim();
            break;
          case "product-name":
            e.product = r[1].trim();
            break;
          case "version":
            e.version = r[1].trim();
            break;
          case "ioplatformserialnumber":
            e.serial = r[1].trim();
            break;
        }
    });
  } catch (a) {
    console.error("get baseboard error: ", a);
  }
  return e;
}
function c() {
  return {
    manufacturer: "",
    product: "",
    version: "",
    serial: ""
  };
}
export {
  l as baseboard
};
