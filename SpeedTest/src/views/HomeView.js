import React, { Component } from 'react';
import axios from 'axios';
import { Line } from 'rc-progress'; // https://react-component.github.io/progress/examples/simple.html
import Ping from 'ping.js'; // https://github.com/alfg/ping.js

class HomeView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            working: false,
            doingPing: false,
            totalSize: 0,
            progressDownload : 0,
            progressUpload: 0,
            speed: null,
            pingTime :null
        };
        this.handleStart = this.handleStart.bind(this);

    }


    componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.something !== prevState.something) {
            this.props.somefunction(this.state.something); 
        }
    }

    doPing() {
        var p = new Ping(), total = 0, occurence = 0;
        for (var i = 0; i < 5; i++) {
            setTimeout(() => {
                p.ping("https://lecampus.com/", (err, data) => {
                    if (!err) {
                        occurence++;
                        total += data;
                        this.setState({ pingTime: total / occurence });
                    }
                });
            }, 1000);
        }
    }

    doDownload() {
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

    handleStart() {
        if (this.state.working) {
            return;
        }
        this.setState({ working: true });
        var start = Date.now(), elapsed, end, totalSize = 0;

        this.doPing();

    }
    
    render() {
        const { progressDownload, speed, pingTime } = this.state;

        return (
            <div>
                <Line percent={progressDownload} strokeWidth="1" strokeColor="#3FC7FA" />
                <button onClick={this.handleStart}>Tester votre vitesse</button>
                {pingTime ? <p>votre PING est {pingTime} millisecondes</p> : null }
                {speed ? <p>votre vitesse est de {speed} mbps</p>: null}
            </div>
        );
    }
}

export default HomeView;