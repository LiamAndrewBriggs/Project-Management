import React, { Component } from 'react';
import '../styles/singleElement.css';
import '../styles/tables.css';

class Venues extends Component {
    state = {
        count: '',
        venues: ''
    };
    
    componentDidMount() {
       this.callApi()
        .then(res => {
            this.setState({ 
                count: res.count,
                venues: res.venues
            })
        })
        .catch(err => console.log(err));
    }
    
    callApi = async () => {
        
        var path = this.props.location.pathname;
        const response = await fetch(path);
        const body = await response.json();
    
        if (response.status !== 200) throw Error(body.message);
    
        return body;
    };

    render() {
        var rows = [];
        for (var i = 0; i < this.state.count; i++) {
            rows.push(
                    <tr key={i}>
                        <td> <img src={this.state.venues[i].image} height="150" width="300" alt={this.state.venues[i].name}/> </td>
                        <td> {this.state.venues[i].name} </td>
                        <td> {this.state.venues[i].capactity} </td>
                        <td> <a id="tablelink" href={this.state.venues[i].request.url}> To Venue Page </a> </td>
                    </tr>
                    
            );
        }
        console.log(this.state);
        return (
            <div id="venuesBody">
                <h3> Venues </h3>
                <table id="tables">
                    <thead>
                        <tr>
                            <th>Venue </th>
                            <th>Venue Name</th>
                            <th>Event Capacity</th>
                            <th>More Info</th>
                        </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </table>
            </div>
          );
      }
}

export default Venues;