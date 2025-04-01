import config from 'config';
import server from './app';

server.listen(config.get<number>('app.port'), () => {
    console.log(`${config.get<string>('app.name')} is now running on localhost:${config.get<number>('app.port')}`)
})