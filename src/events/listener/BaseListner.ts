import { Stan } from "node-nats-streaming";



export abstract class BaseListner{
    
    abstract subject: string;
    abstract queueGroupName: string;
    
    private client:Stan;

    constructor(client:Stan){
        this.client = client
    }

    listen(){

    }
}