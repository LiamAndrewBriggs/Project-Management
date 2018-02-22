import React, { Component } from 'react';
import '../styles/singleElement.css';
import '../styles/tables.css';

class Users extends Component {
    state = {
        count: '',
        users: '',
        userLevel: '',
        create: false
    };
    
    componentDidMount() {
       this.callApi()
        .then(res => {
            var userLevel = '';
            if(res.loggedIn === "No User") {
                userLevel = 0;
            }
            else {
                userLevel = res.loggedIn.userLevel;
            }
            this.setState({ 
                count: res.count,
                users: res.user,
                userLevel: userLevel
            })
        })
        .catch(err => console.log(err));
    }
    
    callApi = async () => {
        
        var path = this.props.location.pathname;
        const response = await fetch(path, {
            credentials: 'include'
        });
        const body = await response.json();
    
        if (response.status !== 200) throw Error(body.message);
    
        return body;
    };

 
    render() {

        console.log(this.state.users);

        var rows = [];
        for (var i = 0; i < this.state.count; i++) {
            rows.push(
                    <tr key={i}>
                        <td> {this.state.users[i].name} </td>
                        <td> {this.state.users[i].email} </td>
                        <td> <a id="tablelink" href={this.state.users[i].request.url}> To Users Page </a> </td>
                    </tr>
                    
            );
        }

      
        if(this.state.userLevel === 1) {
           return (
            <div id="venuesBody">
                <div id="headerLine">
                    <h3> Users </h3>
                </div>
                <table id="tables">
                    <thead>
                        <tr>
                            <th>Users Name</th>
                            <th>Users Email</th>
                            <th>More Info</th>
                        </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </table>
            </div>
          );
        }
        else {
            return (null)
        }
      }
}

export default Users;