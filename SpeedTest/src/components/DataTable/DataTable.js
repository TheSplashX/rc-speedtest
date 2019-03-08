import React, { Component } from 'react';
import './DataTable.css'

class DataTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: []
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState.items = nextProps.items;
    }

    render() {
        var headers = [];
        var columns = this.props.columns;
        columns.map(function (column) {
            headers.push(<div key={column.header} className={column.class}>{column.header}</div>); 
        });

        var items = this.state.items.map(function (item) {
            return (
                <div className="row" key={item.ID}>
                    {
                        columns.map(function (column) {
                            return (
                                <div key={column}>{item[column]}</div>
                            );
                        })
                    }
                </div>
            );
        });

        return (
            <div className="DataTable grid-container">   
                <div className="row">
                    {headers}   
                </div>
                {items}
            </div>
        );
    }
}

export default DataTable;