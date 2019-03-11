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
            doingPing: false,
            doingDownload: false,
            doingUpload: false,
            totalSize: 0,
            progressDownload : 0,
            progressUpload: 0,
            downloadSpeed: null,
            uploadSpeed: null,
            pingTime: null,
            file: null
        };
        this.handleStart = this.handleStart.bind(this);
    }

    async doDownload() {
        let start = Date.now();
        await asyncSetState(this)({ doingDownload: true });
        console.log('beginning download test');
        await axios.get('test.jpg?n=' + Math.random(), {
            onDownloadProgress: (progressEvent) => {
                asyncSetState(this)({ totalSize: progressEvent.total / 1000000 });
                asyncSetState(this)({ progressDownload: progressEvent.loaded / progressEvent.total * 100 });
            }
        }).then((response) => {
            let end = Date.now();
            let elapsed = (end - start) / 1000;
            asyncSetState(this)({ downloadSpeed: this.state.totalSize / elapsed * 8 });
            console.log('download speed : ' + this.state.downloadSpeed + 'mbps');
            asyncSetState(this)({ file: response.data });
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
        let p = new Ping(), total = 0, occurence = 0;
        await asyncSetState(this)({ doingPing: true });
        console.log('beginning ping test');
        async function loop() {
            for (let i = 0; i < 6; i++) {
                p.ping('http://lecampus.com/', (err, data) => {
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
        await asyncSetState(this)({ doingPing: false });
        console.log('finished ping test');
    }

    async handleStart() {
        if (this.state.working) {
            return;
        }
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