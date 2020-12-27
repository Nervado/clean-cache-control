import { PurchaseModel } from "@/domain/models";

export interface LoadPurchases {
  loadAll: (purchases: Array<SavePurchases.Params>) => Promise<void>
}

 export namespace SavePurchases {
  export type Params = PurchaseModel
 }
