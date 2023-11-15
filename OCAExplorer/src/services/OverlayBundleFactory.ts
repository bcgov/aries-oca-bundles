import { OverlayBundle } from "@hyperledger/aries-oca/build/types";
import { IOverlayBundleData } from "@hyperledger/aries-oca/build/interfaces/data";
import { parse } from "csv-parse/browser/esm/sync";

class OverlayBundleFactory {
  public static async fetchOverlayBundle(
    credentialDefinitionId: string,
    url: string
  ): Promise<OverlayBundle> {
    const response = await fetch(url);
    const data: IOverlayBundleData[] = await response.json();
    return this.createOverlayBundle(credentialDefinitionId, data[0]);
  }

  public static async fetchOverlayBundleData(
    url: string
  ): Promise<Record<string, string>> {
    try {
      const response = await fetch(
        url.replace("OCABundle.json", "testdata.csv")
      );
      const csv: string = await response.text();
      const data = parse(csv, { delimiter: ", ", columns: true });
      return data[0] ?? ({} as Record<string, string>);
    } catch (error) {
      console.error(error);
      return {};
    }
  }

  public static createOverlayBundle(
    id: string,
    data: IOverlayBundleData
  ): OverlayBundle {
    return new OverlayBundle(id, data);
  }
}

export default OverlayBundleFactory;
