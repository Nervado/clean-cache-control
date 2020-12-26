import { CacheStore } from '@/data/protocols/cache/cache-store'
import { SavePurchases } from '@/domain/usecases'

export class CacheStoreSpy implements CacheStore {

  messages: CacheStoreSpy.Message[] = []  
  insertKey: string 
  deleteKey: string 
  insertValues: Array<SavePurchases.Params> = []
  
  delete (key:string): void {    
     this.deleteKey = key
     this.messages.push(CacheStoreSpy.Message.delete)
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
}
export namespace CacheStoreSpy {
  export enum Message {
    delete,
    insert
  }
}
