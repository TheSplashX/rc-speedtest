import React, { Component } from 'react';
import axios from 'axios';
import { Line } from 'rc-progress'; //https://react-component.github.io/progress/examples/simple.html

class HomeView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            totalSize: 0,
            progressDownload : 0,
            progressUpload : 0
        };
        this.handleGet = this.handleGet.bind(this);
        this.handlePost = this.handlePost.bind(this);
    }

    componentDidMount() {

    }

    handleGet() {
        var start = Date.now(), elapsed, end, totalSize = 0;
        axios.get('test.jpg?n=' + Math.random, {
            onDownloadProgress: (progressEvent) => {
                this.setState({ totalSize: progressEvent.total / 1000000 });
                this.setState({ progressDownload: progressEvent.loaded / progressEvent.total * 100 });
            }
        }).then(() => {
            var end = Date.now();
            var elapsed = (end - start) /1000; 
            console.log('elapsed ' + elapsed + 's'); // 1000ms = 1s 
            console.log('size ' + this.state.totalSize + 'mb');
            console.log(this.state.totalSize / elapsed * 8); //mbps
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
        const { progressDownload } = this.state;

        return (
            <div>
                <Line percent={progressDownload} strokeWidth="4" strokeColor="#3FC7FA" />
                <button onClick={this.handleGet}>Get Resource</button>
                <button onClick={this.handlePost}>Post</button>
            </div>
        );
    }
}

export default HomeView;