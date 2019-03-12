import React, { Component } from 'react';
import axios from 'axios';
import { Line } from 'rc-progress'; // https://react-component.github.io/progress/examples/simple.html
import Ping from 'ping.js'; // https://github.com/alfg/ping.js
import { delay, asyncSetState } from '../components/utils';

class HomeView extends Component {
    constructor(props) {
        super(props);
        this.state = this.initialState;
        this.resetBuilder = this.resetBuilder.bind(this);
        this.handleStart = this.handleStart.bind(this);
    }

    get initialState() {
        return {
            working: false,
            doingPing: false,
            doingDownload: false,
            doingUpload: false,
            totalSize: 0,
            progressDownload: 0,
            progressUpload: 0,
            downloadSpeed: null,
            uploadSpeed: null,
            pingTime: null,
            file: null
        };
    }

    async resetBuilder() {
        asyncSetState(this)(this.initialState);
    }

    async doDownload() {
        let start = Date.now();
        await asyncSetState(this)({ doingDownload: true });
        console.log('beginning download test');
        await axios.get('/img/test.jpg?n=' + Math.random(), {
            responseType: 'blob',
            onDownloadProgress: (progressEvent) => {
                asyncSetState(this)({ totalSize: progressEvent.total / 1000000 });
                asyncSetState(this)({ progressDownload: progressEvent.loaded / progressEvent.total * 100 });
            }
        }).then((response) => {
            let end = Date.now();
            let elapsed = (end - start) / 1000;
            asyncSetState(this)({ downloadSpeed: this.state.totalSize / elapsed * 8 });
            console.log('download speed : ' + this.state.downloadSpeed + 'mbps');
            asyncSetState(this)({ file: new Blob([response.data]) });
            asyncSetState(this)({ doingDownload: false });
            console.log('finished download test');
        })
        .catch(function (error) {
            console.log('error' + error);
        });
    }

    async doUpload() {
        let start = Date.now();
        await asyncSetState(this)({ doingUpload: true });
        console.log('beginning upload test');
        var formData = new FormData();
        formData.append("image", this.state.file);
        axios.post('/api/test', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent) => {
                asyncSetState(this)({ progressUpload: progressEvent.loaded / progressEvent.total * 100 });
            }
        }).then(() => {
            let end = Date.now();
            let elapsed = (end - start) / 1000;
            asyncSetState(this)({ uploadSpeed: this.state.totalSize / elapsed * 8 });
            console.log('upload speed : ' + this.state.uploadSpeed + 'mbps');
            asyncSetState(this)({ doingUpload: false });
            console.log('finished upload test');
            asyncSetState(this)({ working: false });
        })
        .catch(function (error) {
            console.log('error' + error);
        });
    }

    async doPing() {
        let p = new Ping(), total = 0, occurence = 0, address = 'http://speedtest.quebecsvr.local/';
        await asyncSetState(this)({ doingPing: true });
        console.log('beginning ping test to address ' + address);
        async function loop() {
            for (let i = 0; i < 6; i++) {
                p.ping(address, (err, data) => {
                    if (!err && !isNaN(data) && i > 0 ) {
                        occurence++;
                        total += data;  
                        console.log('ping test #' + i + ' of ' + data + 'ms');
                    }
                });
                await delay(1000);
            }
        }
        await loop();
        await asyncSetState(this)({ pingTime: total / occurence });
        await asyncSetState(this)({ doingPing: false });
        console.log('finished ping test');
    }

    async handleStart() {
        if (this.state.working) {
            return;
        }
        await this.resetBuilder(); // reset the state of this view

        await asyncSetState(this)({ working: true });

        await this.doPing();
        await delay(1000);

        await this.doDownload();
        await delay(1000);

        await this.doUpload();
    }
    
    render() {
        const { progressDownload, progressUpload, downloadSpeed, uploadSpeed, pingTime, working , doingDownload, doingUpload, doingPing} = this.state;

        return (
            <div>             
                <button onClick={this.handleStart} disabled={working}>Tester votre vitesse</button>
                {!pingTime && doingPing ? <p>Test de PING en cours</p> : null }
                {pingTime && !doingPing ? <p>votre PING est {Math.round(pingTime)} millisecondes</p> : null}
 
                {!downloadSpeed && doingDownload ? <p>Test de TÉLÉCHARGEMENT en cours<Line percent={progressDownload} strokeWidth="1" strokeColor="#3FC7FA" /></p> : null}
                {downloadSpeed && !doingDownload ? <p>votre vitesse est de TÉLÉCHARGEMENT est de {Math.round(downloadSpeed)} mbps</p> : null}

                {!uploadSpeed && doingUpload ? <p>Test de TÉLÉVERSEMENT en cours<Line percent={progressUpload} strokeWidth="1" strokeColor="#3FC7FA" /></p> : null}
                {uploadSpeed && !doingUpload ? <p>votre vitesse est de TÉLÉVERSEMENT est de {Math.round(uploadSpeed)} mbps</p> : null}
            </div>
        );
    }
}

export default HomeView;