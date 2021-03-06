
import { mockPurchases, CacheStoreSpy } from "@/data/tests"
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


  test('Should call delete with correct key', async () => {
    const { cacheStore, sut } = makeSut()    
    await sut.save(mockPurchases())
    expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete, CacheStoreSpy.Message.insert])
    expect(cacheStore.deleteKey).toBe('purchases')
    expect(cacheStore.insertKey).toBe('purchases')
  })  

  test('Should not insert new Cache if delete fails', async  () => {
    const { cacheStore, sut } = makeSut()        
    cacheStore.simulateDeleteError()
    const promise = sut.save(mockPurchases())
   
    expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete])   
    await expect(promise).rejects.toThrow()
  })  

  test('Should insert new Cache if delete succeeds', async () => {
    const timestamp = new Date()
    const { cacheStore, sut } = makeSut()       
    const purchases = mockPurchases() 
    const promise = sut.save(purchases)
    
    expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete, CacheStoreSpy.Message.insert])
    expect(cacheStore.insertKey).toBe('purchases')
    expect(cacheStore.insertValues).toEqual({
      timestamp,
      value: purchases
    })

    await expect(promise).resolves.toBeFalsy()
  }) 

  test('Should throw error if insert fails', async () => {
    const { cacheStore, sut } = makeSut()           
    cacheStore.simulateInsertError()    
    const promise = sut.save(mockPurchases())   
    expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete, CacheStoreSpy.Message.insert])
    await expect(promise).rejects.toThrow()

  }) 
});

