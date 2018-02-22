import React, { Component } from 'react';
import '../styles/singleElement.css';
import '../styles/tables.css';

class Partys extends Component {
    state = {
        count: '',
        partys: '',
        user: '',
        userLevel: 0,
        venues: '',
        caterers: '',
        entertainment: '',
        transport: '',
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
        
        this.getVenues();
        this.getCaterers();
        this.getEntertainment();
        this.getTransport();
        
        return body;
    };

    getVenues = async () => {
        const options = {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
        }

        const request = new Request('/venues', options);
        const response = await fetch(request);
        const status = await response.status;
        const result = await response.json();

        if(status === 200)
        {
            this.setState({
                venues: result
            })
        }
        else {
            console.log(result);
        }
    }

    getCaterers = async () => {
        const options = {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
        }

        const request = new Request('/caterings', options);
        const response = await fetch(request);
        const status = await response.status;
        const result = await response.json();

        if(status === 200)
        {
            this.setState({
                caterers: result
            })
        }
        else {
            console.log(result);
        }
    }

    getEntertainment = async () => {
        const options = {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
        }

        const request = new Request('/entertainments', options);
        const response = await fetch(request);
        const status = await response.status;
        const result = await response.json();

        if(status === 200)
        {
            this.setState({
                entertainment: result
            })
        }
        else {
            console.log(result);
        }
    }

    getTransport = async () => {
        const options = {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
        }

        const request = new Request('/transports', options);
        const response = await fetch(request);
        const status = await response.status;
        const result = await response.json();

        if(status === 200)
        {
            this.setState({
                transport: result
            })
        }
        else {
            console.log(result);
        }
    }

    cancelTrigger() {
        this.setState({ 
            count: this.state.count,
            partys: this.state.caterings,
            userLevel: this.state.userLevel,
            create: false
        }, this.setState(this.state))
    }

    createTrigger() {
        this.setState({ 
            count: this.state.count,
            partys: this.state.caterings,
            userLevel: this.state.userLevel,
            create: true
        }, this.setState(this.state))
    }

    createParty = async (e) => {

        e.preventDefault();
       
        var chosenVenue = this.state.venues.venues[this.refs.venue.value]._id;
       
        var chosenCaterer = null;

        if (this.refs.caterer.value !== 'none')
        {
            chosenCaterer = this.state.caterers.caterings[this.refs.caterer.value]._id;
        }

        var chosenEntertainment = null;

        if (this.refs.entertainment.value !== 'none')
        {
            chosenEntertainment =  this.state.entertainment.entertainment[this.refs.entertainment.value]._id;
                
        }

        var chosenTransport = null;

        if (this.refs.transport.value !== 'none')
        {
            chosenTransport = this.state.transport.transports[this.refs.transport.value]._id;
        }

        var body = {
            "name": this.refs.name.value,
            "description": this.refs.description.value,
            "startDate": this.refs.startDate.value,
            "endDate": this.refs.endDate.value,
            "venue": chosenVenue,
            "catering": chosenCaterer,
            "entertainment": chosenEntertainment,
            "transport": chosenTransport
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

        var venues = [];

        for (var i = 0; i < this.state.venues.count; i++)
        {
            venues.push(
                <option key={i} value={i}> {this.state.venues.venues[i].name}</option>
            );
        }

        var caterers = [];

        for (i = 0; i < this.state.caterers.count; i++)
        {
            caterers.push(
                <option key={i} value={i}> {this.state.caterers.caterings[i].name}</option>
            );
        }

        caterers.push(
            <option key={i++} value="none"> None</option>
        );

        var entertainment = [];

        for (i = 0; i < this.state.entertainment.count; i++)
        {
            entertainment.push(
                <option key={i} value={i}> {this.state.entertainment.entertainment[i].name}</option>
            );
        }

        entertainment.push(
            <option key={i++} value="none"> None</option>
        );

        var transport = [];

        for (i = 0; i < this.state.transport.count; i++)
        {
            transport.push(
                <option key={i} value={i}> {this.state.transport.transports[i].name}</option>
            );
        }

        transport.push(
            <option key={i++} value="none"> None</option>
        );

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
                                    <label> Venue:</label>
                                    <select ref="venue" id ="inputs">
                                        {venues}
                                    </select>
                                    <label> Caterers:</label>
                                    <select ref="caterer" id ="inputs">
                                        {caterers}
                                    </select>
                                    <label> Entertainment:</label>
                                    <select ref="entertainment" id ="inputs">
                                        {entertainment}
                                    </select>
                                    <label> Transport:</label>
                                    <select ref="transport" id ="inputs">
                                        {transport}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            );
        }
        else {

            var rows = [];
            for (i = 0; i < this.state.count; i++) {
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