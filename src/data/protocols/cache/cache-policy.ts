export class CachePolicy {

  private static maxAgeIndays = 3

  private constructor (){}

  static validate(timestamp: Date, date: Date): boolean {
    const maxAge = new Date(timestamp)
    maxAge.setDate(maxAge.getDate() + CachePolicy.maxAgeIndays)
    return maxAge > date
  }
     
}