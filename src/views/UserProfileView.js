import React, { Component } from 'react';
import '../App.css';

/*
* Construct the user page for the app where information about the user is
* displayed
*/
class UserProfileView extends Component {
  // Define the behaviour that happens when we click on an event in the user's
  // list of events they're going to
  showEvent(id) {
    // let obj = this.props.searchViewData.events.find(o => o.id === parseInt(id, 10));
    // this.props.switchState(2, obj);
  }

  render() {
    let interestedList = Object.keys(this.props.goingEvents)
    return (
      <div className="paper userDetailsBox">
        <div className="header1">{this.props.username}</div>
        <div className="date1">About me</div>
        <div className="userDetailsTextBox">
        <div>{this.props.description}</div>
        <div>{this.props.country}</div>
        </div>
        <div className="date1">Interested Events</div>
        <div>
          {interestedList.map(x => <button className="generalButton" onClick={() =>
            this.showEvent(x)} key={this.props.goingEvents[x]}>{this.props.goingEvents[x]}</button>)}
        </div>
      </div>
    );
  }
}

export default UserProfileView;