import React, { Component } from 'react';
import './App.css';
import * as queries from './api/queries.js'
import SearchView from './views/SearchView.js'
import DetailsView from './views/DetailsView.js'
import LoginView from './views/LoginView.js'
import UserProfileView from './views/UserProfileView.js'
import SearchBar from './components/SearchBar.js'
import AdvancedSearchView from './views/AdvancedSearchView.js'
// key = 	rgH0sHA67HAtSurrdPQON985G4BAMWTY

let mockData4 = {
  username:"ohohoh",
  description:"Hello there. Welcome to my profile!",
  country:"country: Canada",
  goingEvents: {
    1:"Monster Jam!"
  }
}

var q = {};

function cleanData (response) {
  if (response._embedded) {
    const baseEvent = {
      pleaseNote: "No information provided",
      info: "No information provided",
      dates: {start: {localDate: "", localTime: ""}},
      priceRanges: [{min: "None"}],
      _embedded: {venues: [{address: {line1: ""}, city: {name: ""}, country: {name: ""}}]}
    }
    let r = response._embedded
    let newEvents = r.events.map(x => Object.assign({}, baseEvent, x))
    return {events: newEvents}
  }
  return {events: []}
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = this.init();
    fetch("http://localhost:5000/checklogin", {
      method: 'GET',
      credentials: 'include'
    })
    .then(res => {res.json()})
    .catch(error => console.error('Error:', error))
    .then(response1 => {
      console.log(response1)
      queries.loadInitial().then((response) => {q=response._embedded;this.setState({searchViewData: response._embedded})})
    })
    .catch(error => console.error('Error:', error));
  }

  init = () => {
    return {searchViewData: {events: []}, view: 1};
  }

  logIn = (user, pass, email, userInfo) => {
    console.log(user)
    mockData4.username = user
    mockData4.goingEvents = userInfo.events
    this.setState({loggedIn: true})
  }

  logOut = () => {
    fetch("http://localhost:5000/logout", {
      method: 'GET',
      credentials: 'include'
    })
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(response => {
      console.log(response.message)
      this.setState({loggedIn: false})
    });
  }

  interested = (new_id, new_name) => {


    var data = {eventID: new_id, username: mockData4.username};

    fetch("http://localhost:5000/interested", {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(response => {
      this.setState({});
      console.log("added");
    })

  }

  notInterested = (id) => {


    var data = {eventID: id, username: mockData4.username};

    fetch("http://localhost:5000/uninterested", {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(response => {
      this.setState({});
      console.log("deleted");
    })


  }

  link_to_event = (id) => {
    console.log(id);
    console.log(q.events);

    let obj = q.events.find(o => o.id === id);
    this.switchState(2, obj);
  }

  find_name = (id) => {
    return q.events.find(o => o.id === id).name
  }

  switchState = (id, queryData) => {
    if (id === 1) {
      this.setState({view: id});
      if (queryData) queries.searchEventKeyword(queryData).then((response) => {
        this.setState({searchViewData: cleanData(response)})})
    }
    else if (id === 2) {
      this.setState({view: id, detailsViewData: queryData, userProfileData: mockData4});
    }
    else if (id === 3) this.setState({view: id, loginViewData: queryData});
    else if (id === 4) this.setState({view: id, userProfileData: mockData4});
    else if (id === 5) this.setState({view: id});
  }

  render() {
    let view = null;
    if (this.state.view === 1) {
      view = <SearchView switchState={this.switchState} {...this.state.searchViewData}/>;
    }
    else if (this.state.view === 2) {
      view = <DetailsView switchState={this.switchState} {...this.state.searchViewData} {...this.state.detailsViewData} userData={this.state.userProfileData} loggedIn={this.state.loggedIn} interested = {this.interested} notInterested = {this.notInterested}/>;
    }
    else if (this.state.view === 3) {
      view = <LoginView logIn={this.logIn} switchState={this.switchState} {...this.state.loginViewData}/>;
    }
    else if (this.state.view === 4) {
      view = <UserProfileView find_name = {this.find_name} link_to_event = {this.link_to_event} switchState={this.switchState} {...this.state.userProfileData} searchViewData={this.state.searchViewData}/>;
    }
    else if (this.state.view === 5) {
      view = <AdvancedSearchView switchState={this.switchState} />
    }
    else {
      view = null;
    }
    return (
      <div className="App">
        <SearchBar loggedIn={this.state.loggedIn} logOut={this.logOut} switchState={this.switchState}/>
        {view}
      </div>
    );
  }
}

export default App;
