import Data from './resource.json'

export  class API {
    static getData(){
        // simulating api call
        return new Promise((resolve,reject)=>{
            try{
                setTimeout(()=>resolve(Data),500); // simulating request delay
            }catch(err){
                reject(err)
            }
        });
    }
    static search(query){
        // simulating api call
        return new Promise((resolve,reject)=>{
            try{
                const result = Data.filter(item=>JSON.stringify(item).toLowerCase().includes(query.toLowerCase()))
                setTimeout(()=>resolve(result),500); // simulating request delay
            }catch(err){
                reject(err)
            }
        });
    }
}
