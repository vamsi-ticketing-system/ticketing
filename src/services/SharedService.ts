import mongoose from "mongoose";


class SharedService{
    constructor(){

    }

    isNumber(val:any){
        return typeof val == 'number' && !isNaN(val) ? true : false;
    }

    stringToObjectId(id:string){
        return new mongoose.Types.ObjectId(id);
    }

    stringsToObjectIDs(ids:[string]){
        let idList = [...new Set(ids)]
        return idList.map((id:string)=> new mongoose.Types.ObjectId(id))
    }
}

const sharedService = new SharedService;
export default sharedService;