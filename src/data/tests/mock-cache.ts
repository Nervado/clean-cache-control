import { CacheStore } from '@/data/protocols/cache/cache-store'
import { LoadPurchases, SavePurchases } from '@/domain/usecases'


export const getCacheExpirationDate = (timestamp: Date): Date => {
  const maxCacheAge = new Date(timestamp)
  maxCacheAge.setDate(maxCacheAge.getDate() - 3)
  return maxCacheAge
}
export class CacheStoreSpy implements CacheStore {

  messages: CacheStoreSpy.Message[] = []  
  insertKey: string 
  deleteKey: string 
  fetchKey: string
  insertValues: Array<SavePurchases.Params> = []
  fetchResult: any
  
  delete (key:string): void {    
     this.deleteKey = key
     this.messages.push(CacheStoreSpy.Message.delete)
  }
b
  fetch(key: string): any {
    this.messages.push(CacheStoreSpy.Message.fetch)
    this.fetchKey = key
    return this.fetchResult
  }

  insert(key:string, value: any):void {   
    this.insertKey = key
    this.insertValues = value
    this.messages.push(CacheStoreSpy.Message.insert)
  }

  replace(key:string, value: any):void {   
    this.delete(key)
    this.insert(key,value)
   
  }


  simulateDeleteError(): void {
    jest.spyOn(CacheStoreSpy.prototype, 'delete').mockImplementationOnce(()=> { this.messages.push(CacheStoreSpy.Message.delete);throw new Error();})
  }

  simulateInsertError(): void {
    jest.spyOn(CacheStoreSpy.prototype, 'insert').mockImplementationOnce(()=> { this.messages.push(CacheStoreSpy.Message.insert);throw new Error(); })
  }

  simulateFetchError(): void {
    jest.spyOn(CacheStoreSpy.prototype, 'fetch').mockImplementationOnce(()=> { this.messages.push(CacheStoreSpy.Message.fetch);throw new Error();})
  
  }
}
export namespace CacheStoreSpy {
  export enum Message {
    delete,
    insert,
    fetch
  }
}
