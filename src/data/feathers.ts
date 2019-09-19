import io from 'socket.io-client';
import feathers from '@feathersjs/client';
import {Application} from "@feathersjs/feathers";

const socket = io('http://localhost:3030');
const client:Application<any> = feathers();

client.configure(feathers.socketio(socket));
client.configure(feathers.authentication({
    storage: window.localStorage
}));
export default client;
