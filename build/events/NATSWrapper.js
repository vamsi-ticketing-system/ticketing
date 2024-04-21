"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_nats_streaming_1 = __importDefault(require("node-nats-streaming"));
class NATSWrapper {
    get client() {
        if (!this._client) {
            throw new Error("Client can't accessible with out connect");
        }
        return this._client;
    }
    connect(clusterID, clientID, url) {
        return new Promise((resolve, reject) => {
            this._client = node_nats_streaming_1.default.connect(clusterID, clientID, { url: url, waitOnFirstConnect: true });
            this._client.on('connect', () => {
                console.log("connected to NATS");
                resolve(true);
            });
            this._client.on('error', () => {
                console.log("Unable to connect");
                reject();
            });
        });
    }
}
const natsWrapper = new NATSWrapper();
exports.default = natsWrapper;
