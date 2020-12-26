import { CacheStore } from "@/data/protocols/cache"
import { LocalSavePurchases } from "./local-save-purchases"


class CacheStoreSpy implements CacheStore {
  deleteCallsCount: number = 0
  insertCallsCount: number = 0
  insertKey: string 
  deleteKey: string 
  delete (key:string): void {
     this.deleteCallsCount++
     this.deleteKey = key
  }

  insert(key:string):void {
    this.insertCallsCount++
    this.insertKey = key
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
    await sut.save()
    expect(cacheStore.deleteCallsCount).toBe(1)
  }) 

  test('Should call delete with correct key', async () => {
    const { cacheStore, sut } = makeSut()    
    await sut.save()
    expect(cacheStore.deleteKey).toBe('purchases')
  })  

  test('Should not insert new Cache if delete fails', () => {
    const { cacheStore, sut } = makeSut()    
    jest.spyOn(cacheStore, 'delete').mockImplementation( () => { throw new Error()})
    const promise =  sut.save()
    expect(cacheStore.insertCallsCount).toBe(0)
    expect(promise).rejects.toThrow()
  })  

  test('Should insert new Cache if delete succeeds', async () => {
    const { cacheStore, sut } = makeSut()       
    await sut.save()
    expect(cacheStore.insertCallsCount).toBe(1)
    expect(cacheStore.deleteCallsCount).toBe(1)   
    expect(cacheStore.insertKey).toBe('purchases')
  }) 
});

