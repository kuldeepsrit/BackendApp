export  const getEnv = (key: string, defaultValue?: string): string => {
    
    const  value = process.env[key];
    if(value ==undefined){
        if(defaultValue==undefined){
            throw new  Error(`Environments variable  ${key} is not set`) 
       }
       return defaultValue;
    }

return value ;

}