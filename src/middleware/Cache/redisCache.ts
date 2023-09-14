import { createClient } from "redis";


export const redisClient = createClient({url:"redis://localhost:8080/"})
  
export function isInRedis(){
    return null
}
