import React, { Component } from 'react';
import '../styles/singleElement.css';
import '../styles/tables.css';

class PartyInvites extends Component {
    state = {
        user: '',
        userLevel: 0,
        partys: '',
        edit: false,
        inFocus: ''
    };
    
    componentDidMount() {
        this.callApi()
        .then(res => {
            console.log(res);
                var userLevel = '';
                if(res.loggedIn === "No User") {
                    userLevel = 0;
                }
                else {
                    userLevel = res.loggedIn.userLevel;
                }
                this.setState({ 
                    count: res.count,
                    partys: res.invitedTo,
                    userLevel: userLevel,
                    user: res.loggedIn
                })
            })
            .catch(err => console.log(err));
    }
    
    callApi = async () => {
        
        var path = this.props.location.pathname;
        const response = await fetch(path, {
            credentials: "include"
        });
        const body = await response.json();
    
        if (response.status !== 200) throw Error(body.message);
        
        return body;
    };

    editResponse = async (e) => {
        
        e.preventDefault();

        console.log(this.refs.responses.value);

        var body =  [];

        var toChange = this.state.user;

        toChange.invitedTo[this.state.inFocus].response = this.refs.responses.value;

        body[0] = { "propName": "invitedTo", "value": toChange.invitedTo }

        console.log(body);

        const options = {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(body)
        }

        const request = new Request('/user/' + this.state.user._id, options);
        const response = await fetch(request);
        const status = await response.status;
        const result = await response.json();

        if(status === 200) {
            
            const secondOptions = {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            }

            const secondRequest = new Request('/user/partys/' + this.state.partys[this.state.inFocus].partyID, secondOptions);
            const secondResponse = await fetch(secondRequest);
            const secondStatus = await secondResponse.status;
            const secondResult = await secondResponse.json();

            if(secondStatus === 200) {
                
                var invitedGuest = secondResult.doc.invitedGuests;
                
                var thirdbody = [];

                for (var i = 0; i < invitedGuest.length; i++)
                {
                    if(invitedGuest[i]._userID === this.state.user._id) {
                        invitedGuest[i].response = this.refs.responses.value;
                    }
                }
                
                thirdbody[0] = { "propName": "invitedGuests", "value": invitedGuest}
                
                const thirdOptions = {
                    method: 'PATCH',
                    credentials: 'include',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(thirdbody)
                }
    
                const thirdRequest = new Request('/user/partys/' + this.state.partys[this.state.inFocus].partyID, thirdOptions);
                const thirdResponse = await fetch(thirdRequest);
                const thirdStatus = await thirdResponse.status;
                const thirdResult = await thirdResponse.json();

                if(thirdStatus === 200) {
                    window.location.reload();
                }
                else {
                    console.log(thirdResult);
                }
            }
            else {
                console.log(secondResult);
            }
        }
        else {
            console.log(result);
        }
        
    }

    editTrigger(key) {
        this.setState({
            edit: true,
            inFocus: key
        }, this.setState(this.state))
    }

    render() {

        console.log(this.state);

        if (this.state.userLevel === 0)
        {
            return (
                <div id="headerLine">
                    <h3 id="headererror">Please Wait Or Try Logging In</h3>
                </div>
            );
        }

        var rows = [];
            for (var i = 0; i < this.state.partys.length; i++) {
                var url = "http://localhost:3000/user/partys/" + this.state.partys[i].partyID;
                var date = new Date(this.state.partys[i].date);
                date = date.toUTCString();
                rows.push(
                        <tr key={i}>
                            <td> {this.state.partys[i].name} </td>
                            <td> {date} </td>
                            <td key={i}> 
                                {this.state.partys[i].response}
                                <br/>
                                <button key={i} onClick={this.editTrigger.bind(this, i)}> Respond </button>
                            </td>
                            <td> <a id="tablelink" href={url}> To Party Page </a> </td>
                        </tr>
                        
                );
            }

            if(!this.state.edit) {
                return (
                    <div id="venuesBody">
                        <div id="headerLine">
                            <h3> Party Invites </h3>
                        </div>
                        <table id="tables">
                            <thead>
                                <tr>
                                    <th>Party Name</th>
                                    <th>Event Date</th>
                                    <th>Party Reponse </th>
                                    <th>More Info</th>
                                </tr>
                            </thead>
                            <tbody>{rows}</tbody>
                        </table>
                    </div>
                  );
            }
            else {
                return (
                    <div id="venuesBody">
                        <div id="headerLine">
                            <h3> {this.state.partys[this.state.inFocus].name} </h3>
                        </div>
                        <form onSubmit={this.editResponse.bind(this)}>
                            <label> Responses:</label>
                                <select ref="responses" id ="inputs" defaultValue={this.state.partys[this.state.inFocus].response}>
                                    <option value="Going">Going</option>
                                    <option value="Declined">Declined</option>
                                    <option value="Invited">Invited</option>
                                </select>
                            <input id="editButton" className="btn btn-primary" type="submit" value="Save" />
                        </form>
                    </div>
                )
            }

            
        }
      
}

export default PartyInvites;