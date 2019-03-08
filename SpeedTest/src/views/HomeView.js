import React, { Component } from 'react';
import axios from 'axios';
import { Line } from 'rc-progress'; //https://react-component.github.io/progress/examples/simple.html

class HomeView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            totalSize: 0,
            progressDownload : 0,
            progressUpload: 0,
            speed: null
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
        const { progressDownload, speed} = this.state;

        return (
            <div>
                <Line percent={progressDownload} strokeWidth="1" strokeColor="#3FC7FA" />
                <button onClick={this.handleGet}>Tester votre vitesse</button>
                {/*<button onClick={this.handlePost}>Post</button>*/}
                {speed ? <p>votre vitesse est de {speed} mbps</p>: null}
            </div>
        );
    }
}

export default HomeView;