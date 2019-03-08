import React, { Component } from 'react';
import axios from 'axios';
import { Line } from 'rc-progress'; // https://react-component.github.io/progress/examples/simple.html
import Ping from 'ping.js'; // https://github.com/alfg/ping.js

class HomeView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            totalSize: 0,
            progressDownload : 0,
            progressUpload: 0,
            speed: null,
            pingTime :null
        };
        this.handleGet = this.handleGet.bind(this);
        this.handlePost = this.handlePost.bind(this);
    }

    componentDidMount() {

    }

    handleGet() {
        var start = Date.now(), elapsed, end, totalSize = 0;

        var p = new Ping();
        p.ping("https://lecampus.com/", (err, data) => {
            this.setState({ pingTime: data });
        });

        axios.get('test.jpg?n=' + Math.random, {
            onDownloadProgress: (progressEvent) => {
                this.setState({ totalSize: progressEvent.total / 1000000 });
                this.setState({ progressDownload: progressEvent.loaded / progressEvent.total * 100 });
            }
        }).then(() => {
            var end = Date.now();
            var elapsed = (end - start) /1000; 
            this.setState({ speed: this.state.totalSize / elapsed * 8 });
        })
        .catch(function (error) {
            console.log('error' + error);
        });
    }

    handlePost() {
        axios.post('test', 'none')
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    
    render() {
        const { progressDownload, speed, pingTime } = this.state;

        return (
            <div>
                <Line percent={progressDownload} strokeWidth="1" strokeColor="#3FC7FA" />
                <button onClick={this.handleGet}>Tester votre vitesse</button>
                {/*<button onClick={this.handlePost}>Post</button>*/}
                {pingTime ? <p>votre PING est {pingTime} millisecondes</p> : null }
                {speed ? <p>votre vitesse est de {speed} mbps</p>: null}
            </div>
        );
    }
}

export default HomeView;