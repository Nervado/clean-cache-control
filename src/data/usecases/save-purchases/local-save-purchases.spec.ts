import { CacheStore } from "@/data/protocols/cache"
import { mockPurchases } from "@/data/tests"
import { SavePurchases } from "@/domain/usecases"
import { LocalSavePurchases } from "./local-save-purchases"


class CacheStoreSpy implements CacheStore {
  deleteCallsCount: number = 0
  insertCallsCount: number = 0
  insertKey: string 
  deleteKey: string 
  insertValues: Array<SavePurchases.Params> = []
  delete (key:string): void {
     this.deleteCallsCount++
     this.deleteKey = key
  }

  insert(key:string, value: any):void {
    this.insertCallsCount++
    this.insertKey = key
    this.insertValues = value
  }

  simulateDeleteError(): void {
    jest.spyOn(CacheStoreSpy.prototype, 'delete').mockImplementationOnce(()=> {throw new Error()})
  }

  simulateInsertError(): void {
    jest.spyOn(CacheStoreSpy.prototype, 'insert').mockImplementationOnce(()=> {throw new Error()})
  }
}

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
  test('Should not delete cache on sut.init', ()=> {
    const { cacheStore } = makeSut()    
    expect(cacheStore.deleteCallsCount).toBe(0)
  })  

  test('Should delete cache on sut.save', async () => {
    const { cacheStore, sut } = makeSut()    
    await sut.save(mockPurchases() )
    expect(cacheStore.deleteCallsCount).toBe(1)
  }) 

  test('Should call delete with correct key', async () => {
    const { cacheStore, sut } = makeSut()    
    await sut.save(mockPurchases() )
    expect(cacheStore.deleteKey).toBe('purchases')
  })  

  test('Should not insert new Cache if delete fails', () => {
    const { cacheStore, sut } = makeSut()        
    cacheStore.simulateDeleteError()
    const promise =  sut.save(mockPurchases())
    expect(cacheStore.insertCallsCount).toBe(0)
    expect(promise).rejects.toThrow()
  })  

  test('Should insert new Cache if delete succeeds', async () => {
    const { cacheStore, sut } = makeSut()       
    const purchases = mockPurchases() 
    await sut.save(purchases)
    expect(cacheStore.insertCallsCount).toBe(1)
    expect(cacheStore.deleteCallsCount).toBe(1)   
    expect(cacheStore.insertKey).toBe('purchases')
    expect(cacheStore.insertValues).toEqual(purchases)
  }) 

  test('Should throw error if insert fails', () => {
    const { cacheStore, sut } = makeSut()           
    cacheStore.simulateInsertError()    
    const promise =  sut.save(mockPurchases())   
    expect(promise).rejects.toThrow()
  }) 
});

