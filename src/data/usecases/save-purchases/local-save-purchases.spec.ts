
import { mockPurchases, CacheStoreSpy } from "@/data/tests"
import { LocalSavePurchases } from "./local-save-purchases"



type SutTypes = {
  sut: LocalSavePurchases
  cacheStore: CacheStoreSpy
}


const makeSut = (): SutTypes => {
  const cacheStore = new CacheStoreSpy()
  const sut = new LocalSavePurchases(cacheStore)
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

  test('Should delete cache on sut.save', async () => {
    const { cacheStore, sut } = makeSut()    
    await sut.save(mockPurchases())    
    expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete, CacheStoreSpy.Message.insert])
  }) 

  test('Should call delete with correct key', async () => {
    const { cacheStore, sut } = makeSut()    
    await sut.save(mockPurchases())
    expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete, CacheStoreSpy.Message.insert])
    expect(cacheStore.deleteKey).toBe('purchases')
  })  

  test('Should not insert new Cache if delete fails', () => {
    const { cacheStore, sut } = makeSut()        
    cacheStore.simulateDeleteError()
    const promise =  sut.save(mockPurchases())
   
    expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete])   
    expect(promise).rejects.toThrow()
  })  

  test('Should insert new Cache if delete succeeds', async () => {
    const { cacheStore, sut } = makeSut()       
    const purchases = mockPurchases() 
    await sut.save(purchases)
    
    expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete, CacheStoreSpy.Message.insert])
    expect(cacheStore.insertKey).toBe('purchases')
    expect(cacheStore.insertValues).toEqual(purchases)
  }) 

  test('Should throw error if insert fails', () => {
    const { cacheStore, sut } = makeSut()           
    cacheStore.simulateInsertError()    
    const promise =  sut.save(mockPurchases())   
    expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete, CacheStoreSpy.Message.insert])
    expect(promise).rejects.toThrow()
  }) 
});

