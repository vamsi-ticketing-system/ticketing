
import nats, { Stan } from 'node-nats-streaming';

class NATSWrapper{
    private _client?:Stan;

    get client(){
        if(!this._client){
            throw new Error("Client can't accessible with out connect")
        }
        return this._client;
    }

    connect(clusterID:string, clientID:string, url: string){
        return new Promise((resolve,reject)=>{
            this._client = nats.connect(clusterID,clientID,{url:url,waitOnFirstConnect: true});

            this._client.on('connect',()=>{
                console.log("connected to NATS");
                resolve(true);
            });

            this._client.on('error',()=>{
                console.log("Unable to connect");
                reject();
            });
        })
    }
}

const natsWrapper = new NATSWrapper();
export default natsWrapper;