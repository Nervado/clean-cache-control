
import { CacheStoreSpy } from "@/data/tests"
import { LocalLoadPurchases } from "./local-load-purchases"



type SutTypes = {
  sut: LocalLoadPurchases
  cacheStore: CacheStoreSpy
}


const makeSut = (timestamp: Date = new Date()): SutTypes => {
  const cacheStore = new CacheStoreSpy()
  const sut = new LocalLoadPurchases(cacheStore, timestamp)
  return {
    sut,
    cacheStore
  }
}

describe('LocalSavePurchase', () => {
  test('Should not delete or insert cache on sut.init', ()=> {
    const { cacheStore } = makeSut()    
    expect(cacheStore.messages).toEqual([])    
  })  

  test('Should call correc key on load', async ()=> {
    const { cacheStore , sut} = makeSut()    
    await sut.loadAll()
    expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.fetch])    
  })    
});

