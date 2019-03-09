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

    doDownload() {
        var start = Date.now(), elapsed, end, totalSize = 0;
        axios.get('test.jpg?n=' + Math.random(), {
            onDownloadProgress: (progressEvent) => {
                this.setState({ totalSize: progressEvent.total / 1000000 });
                this.setState({ progressDownload: progressEvent.loaded / progressEvent.total * 100 });
            }
        }).then(() => {
            var end = Date.now();
            var elapsed = (end - start) / 1000;
            this.setState({ speed: this.state.totalSize / elapsed * 8 });
            this.setState({ working: false });
        })
        .catch(function (error) {
            console.log('error' + error);
        });
    }

    doUpload() {
                //axios.post('test', 'none')
        //    .then(function (response) {
        //        console.log(response);
        //    })
        //    .catch(function (error) {
        //        console.log(error);
        //    });
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
        await asyncSetState(this)({ working: false });
    }
    
    render() {
        const { progressDownload, speed, pingTime } = this.state;

        return (
            <div>
                <Line percent={progressDownload} strokeWidth="1" strokeColor="#3FC7FA" />
                <button onClick={this.handleStart}>Tester votre vitesse</button>
                {pingTime ? <p>votre PING est {Math.round(pingTime)} millisecondes</p> : null }
                {speed ? <p>votre vitesse est de {speed} mbps</p>: null}
            </div>
        );
    }
}

export default HomeView;