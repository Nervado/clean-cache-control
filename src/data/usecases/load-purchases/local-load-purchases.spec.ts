
import { CacheStoreSpy, mockPurchases } from "@/data/tests"
import { time } from "console"
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

    

  test('Should return empty list if load fails', async ()=> {
    const { cacheStore , sut} = makeSut()    
    cacheStore.simulateFetchError()
    const purchases = await sut.loadAll()
    expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.fetch, CacheStoreSpy.Message.delete]) 
    expect(purchases).toEqual([])
    expect(cacheStore.deleteKey).toBe('purchases')
  })  

  test('Should return a list of purchases if cache is less than 3 days old', async ()=> {
    const currentDate = new Date()
    const timestamp = new Date(currentDate)
    timestamp.setDate(timestamp.getDate() - 3)
    timestamp.setSeconds(timestamp.getSeconds() + 1)
    const { cacheStore , sut} = makeSut(currentDate)       
    cacheStore.fetchResult = {
      timestamp,
      value: mockPurchases()
    }
    const purchases = await sut.loadAll()
    expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.fetch])
    expect(purchases).toEqual(cacheStore.fetchResult.value)    
    expect(cacheStore.fetchKey).toBe('purchases')    
  }) 


  test('Should return a empty list of purchases if cache is more than 3 days old', async ()=> {
    const currentDate = new Date()
    const timestamp = new Date(currentDate)
    timestamp.setDate(timestamp.getDate() - 3)
    timestamp.setSeconds(timestamp.getSeconds() -1)
    const { cacheStore , sut} = makeSut(currentDate)       
    cacheStore.fetchResult = {
      timestamp: timestamp,
      value: mockPurchases()
    }
    const purchases = await sut.loadAll()
    expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.fetch, CacheStoreSpy.Message.delete])  
    expect(cacheStore.fetchKey).toBe('purchases') 
    expect(cacheStore.deleteKey).toBe('purchases') 
    expect(purchases).toEqual([])      
  }) 

  test('Should return a list of purchases if cache is 3 days old', async ()=> {
    const currentDate = new Date()
    const timestamp = new Date(currentDate)
    timestamp.setDate(timestamp.getDate() - 3)
    // timestamp.setSeconds(timestamp.getSeconds() - 1)
    const { cacheStore , sut} = makeSut(currentDate)       
    cacheStore.fetchResult = {
      timestamp: timestamp,
      value: mockPurchases()
    }
    const purchases = await sut.loadAll()
    expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.fetch, CacheStoreSpy.Message.delete])  
    expect(cacheStore.fetchKey).toBe('purchases') 
    expect(cacheStore.deleteKey).toBe('purchases') 
    expect(purchases).toEqual([])      
  }) 
});

