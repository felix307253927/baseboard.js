import child_process from "child_process";

export function baseboard(): Baseboard {
  switch (process.platform) {
    case "win32":
      return getWinBaseboard();
    case "linux":
    case "freebsd":
    case "openbsd":
    case "netbsd":
      return getLinuxBaseboard();
    case "darwin":
      return getDarwinBaseboard();
    default:
      return createBaseboard();
  }
}

function getWinBaseboard(): Baseboard {
  let result = createBaseboard();
  try {
    let map: string[][] = child_process
      .execSync("wmic baseboard get manufacturer,product,version,serialnumber")
      .toString()
      .split(/\r\n/)
      .filter((line) => line.trim())
      .map((line) => {
        return line
          .replace(/\r?\n?/, "")
          .trim()
          .split(/ {2,}/)
          .map((item) => item.trim());
      });
    if (map.length === 2) {
      map[0].forEach((item, index) => {
        item = item.toLowerCase();
        if (item) {
          if (item === "serialnumber") {
            item = "serial";
          }
          result[item] = map[1][index] || "";
        }
      });
    }
  } catch (e) {
    console.error("get baseboard error: ", e);
  }
  return result;
}

function getLinuxBaseboard(): Baseboard {
  let result = createBaseboard();
  let lines: string[] = [];
  try {
    lines = child_process
      .execSync("export LC_ALL=C; dmidecode -t 2 2>/dev/null; unset LC_ALL")
      .toString()
      .split("\n");
  } catch (e) {
    // 没有权限
    try {
      lines = child_process
        .execSync(
          `echo -n "product name: "; cat /sys/devices/virtual/dmi/id/board_name 2>/dev/null; echo;
          echo -n "serial number: "; cat /sys/devices/virtual/dmi/id/board_serial 2>/dev/null; echo;
          echo -n "manufacturer: "; cat /sys/devices/virtual/dmi/id/board_vendor 2>/dev/null; echo;
          echo -n "version: "; cat /sys/devices/virtual/dmi/id/board_version 2>/dev/null; echo;`
        )
        .toString()
        .split("\n");
    } catch (error) {
      console.error("get baseboard error: ", e);
    }
  }
  lines.forEach((line) => {
    let ret: string[] = line.split(":");
    if (ret.length === 2) {
      switch (ret[0].trim().toLowerCase()) {
        case "manufacturer":
          result.manufacturer = ret[1].trim();
          break;
        case "product name":
          result.product = ret[1].trim();
          break;
        case "version":
          result.version = ret[1].trim();
          break;
        case "serial number":
          result.serial = ret[1].trim();
          break;
      }
    }
  });
  return result;
}

function getDarwinBaseboard(): Baseboard {
  let result = createBaseboard();
  try {
    let lines: string[] = child_process
      .execSync("ioreg -c IOPlatformExpertDevice -d 2")
      .toString()
      .replace(/[<>"]/g, "")
      .split("\n");
    lines.forEach((line) => {
      let ret = line.split("=");
      if (ret.length === 2) {
        switch (ret[0].trim().toLowerCase()) {
          case "manufacturer":
            result.manufacturer = ret[1].trim();
            break;
          case "product-name":
            result.product = ret[1].trim();
            break;
          case "version":
            result.version = ret[1].trim();
            break;
          case "ioplatformserialnumber":
            result.serial = ret[1].trim();
            break;
        }
      }
    });
  } catch (e) {
    console.error("get baseboard error: ", e);
  }
  return result;
}

function createBaseboard(): Baseboard {
  return {
    manufacturer: "",
    product: "",
    version: "",
    serial: "",
  };
}
