import React, { Component } from 'react';
import '../styles/singleElement.css';
import '../styles/tables.css';

class Partys extends Component {
    state = {
        count: '',
        partys: '',
        user: '',
        userLevel: 0,
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
                    partys: res.partys,
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

    cancelTrigger() {
        this.setState({ 
            count: this.state.count,
            partys: this.state.caterings,
            userLevel: this.state.userLevel,
            create: false
        })
    }

    createTrigger() {
        this.setState({ 
            count: this.state.count,
            partys: this.state.caterings,
            userLevel: this.state.userLevel,
            create: true
        })
    }

    createParty = async (e) => {

        e.preventDefault();

        var body = {
            "name": this.refs.name.value,
            "description": this.refs.description.value,
            "startDate": this.refs.startDate.value,
            "endDate": this.refs.endDate.value,
        }  

        const options = {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(body)
        }

        const request = new Request(window.location.pathname, options);
        const response = await fetch(request);
        const status = await response.status;
        const result = await response.json();

        if(status === 200)
        {
            var secondBody = [];

            var userPartys = this.state.user.partys;

            var toAdd = result.Party._id;

            userPartys.push(toAdd);

            secondBody[0] = { "propName": "partys", "value": userPartys }

            const secondOptions = {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(secondBody)
            }
    
            const secondRequest = new Request("/user/" + this.state.user._id, secondOptions);
            const secondResponse = await fetch(secondRequest);
            const secondStatus = await secondResponse.status;
            const secondResult = await secondResponse.json();
    
            if(secondStatus === 200)
            {
                window.location.reload();
            }
            else {
                console.log(secondResult);
            }
        }
        else {
            console.log(result);
        }
    }

  
    render() {
        console.log(this.state.user);
        var rows = [];
        for (var i = 0; i < this.state.count; i++) {
            var date = new Date(this.state.partys[i].date);
            date = date.toUTCString();
            rows.push(
                    <tr key={i}>
                        <td> <img src={this.state.partys[i].image} height="150" width="300" alt={this.state.partys[i].name}/> </td>
                        <td> {this.state.partys[i].name} </td>
                        <td> {date} </td>
                        <td> <a id="tablelink" href={this.state.partys[i].request.url}> To Party Page </a> </td>
                    </tr>
                    
            );
        }

        if (this.state.userLevel === 0)
        {
            return (
                <div id="headerLine">
                    <h3 id="headererror">Please Login </h3>
                </div>
            );
        }

        if(this.state.create) {

            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1; 
            var yyyy = today.getFullYear();
            if(dd<10){
                dd='0'+dd
            } 
            if(mm<10){
                mm='0'+mm
            } 

            today = yyyy+'-'+mm+'-'+dd;


            return (
                <div id="singleBody">
                    <form onSubmit={this.createParty.bind(this)}>
                        <div id="headerLine">
                            <h3>Create Party </h3>
                            <div id="adminButtons">
                                <button id="deleteButton" type="button" onClick={() => this.cancelTrigger()} className="btn btn-primary">Cancel</button>
                                <input id="editButton" className="btn btn-primary" type="submit" value="Save" />
                            </div>
                        </div>
                        <div className="container">
                        <div className="row">
                            <div id="editinfo">
                                    <label> Name: </label>
                                    <input id="inputs" ref="name" type="text" placeholder="Name" required />
                                    <br/> <br/>
                                    <label> Description: </label>
                                    <textarea id="areainputs" ref="description" type="text" placeholder="Description" required />
                                    <br/> <br/>
                                    <label> Start Date: </label>
                                    <input id="inputs" ref="startDate" type="datetime-local" min={today} placeholder={today} required />
                                    <br/> <br/>
                                    <label> End Date: </label>
                                    <input id="inputs" ref="endDate" type="datetime-local" min={today} placeholder={today} required />
                                    <br/> <br/>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            );
        }
        else {
            return (
            <div id="venuesBody">
                <div id="headerLine">
                    <h3> Your Partys </h3>
                    <div id="adminButtons">
                        <button id="editButton" type="button" onClick={() => this.createTrigger()} className="btn btn-primary">Create</button>
                    </div>;
                </div>
                <table id="tables">
                    <thead>
                        <tr>
                            <th>Party </th>
                            <th>Party Name</th>
                            <th>Event Date</th>
                            <th>More Info</th>
                        </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </table>
            </div>
          );
        }
      }
}

export default Partys;