import React, { Component } from 'react';
import axios from 'axios';
import { Line } from 'rc-progress'; // https://react-component.github.io/progress/examples/simple.html
import Ping from 'ping.js'; // https://github.com/alfg/ping.js
import { delay, asyncSetState } from '../components/utils';

class HomeView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            working: false,
            totalSize: 0,
            progressDownload : 0,
            progressUpload: 0,
            speed: null,
            pingTime :null
        };
        this.handleStart = this.handleStart.bind(this);
    }

    async doDownload() {
        let start = Date.now(), file;
        console.log('beginning download test');
        await axios.get('test.jpg?n=' + Math.random(), {
            onDownloadProgress: (progressEvent) => {
                asyncSetState(this)({ totalSize: progressEvent.total / 1000000 });
                asyncSetState(this)({ progressDownload: progressEvent.loaded / progressEvent.total * 100 });
            }
        }).then((response) => {
            let end = Date.now();
            let elapsed = (end - start) / 1000;
            asyncSetState(this)({ speed: this.state.totalSize / elapsed * 8 });
            console.log('download speed : ' + this.state.speed + 'mbps');
            asyncSetState(this)({ working: false });
            console.log('finished download test');
            file = response.data;
        })
        .catch(function (error) {
            console.log('error' + error);
        });
        await delay(1000);
        return file;
    }

    async doUpload() {
        axios.post('http://lecampus.com/', 'none')
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    async doPing() {
        let p = new Ping(), total = 0, occurence = 0;
        console.log('beginning ping test');
        async function loop() {
            for (let i = 0; i < 6; i++) {
                p.ping("http://lecampus.com/", (err, data) => {
                    if (!err && !isNaN(data) && i > 0 ) {
                        occurence++;
                        total += data;  
                        console.log('ping test #'+ i +' of ' + data + 'ms');
                    }
                });
                await delay(1000);
            }
        }
        await loop();
        await asyncSetState(this)({ pingTime: total / occurence });
        console.log('finished ping test');
    }

    async handleStart() {
        if (this.state.working) {
            return;
        }
        await asyncSetState(this)({ working: true });
        await this.doPing();
        var file = await this.doDownload();
        await asyncSetState(this)({ working: false });
    }
    
    render() {
        const { progressDownload, speed, pingTime } = this.state;

        return (
            <div>
                <Line percent={progressDownload} strokeWidth="1" strokeColor="#3FC7FA" />
                <button onClick={this.handleStart}>Tester votre vitesse</button>
                {pingTime ? <p>votre PING est {Math.round(pingTime)} millisecondes</p> : null }
                {speed ? <p>votre vitesse est de téléchargement est de {Math.round(speed)} mbps</p>: null}
            </div>
        );
    }
}

export default HomeView;