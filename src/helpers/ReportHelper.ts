import { ColumnInterface } from "@churchapps/helpers";
import { DateHelper } from "./DateHelper";

export class ReportHelper {

  static getField = (column: ColumnInterface, dataRow: any) => {
    let result = ""
    try {
      result = dataRow[column.value]?.toString() || "";
    } catch { }

    switch (column.formatter) {
      case "date":
        let dt = new Date(result);
        result = DateHelper.prettyDate(dt);
        break;
      case "number":
        try {
          const num = parseFloat(result);
          result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } catch {}
        break;
      case "dollars":
        try {
          const num = parseFloat(result);
          const usd = new Intl.NumberFormat("en-US", { style:"currency", currency:"USD" });
          result = usd.format(num).replace(".00", "");
        } catch {}
        break;
    }
    return result;
  }

}
