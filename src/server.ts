import path from 'path';
import App from './app';

const app = new App();
console.log('PATH APLICATION: ' + path.resolve(__dirname));
app.start();