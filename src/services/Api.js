import Data from './resource.json'

export  class API {
    static getData(){
        // console.log(Data);
        // return Data
        return new Promise((resolve,reject)=>{
            try{
                // resolve(Data)
                setTimeout(()=>resolve(Data),1000); // simulating request delay
            }catch(err){
                reject(err)
            }
        });
    }
}
