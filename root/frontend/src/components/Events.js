import React, { Component } from 'react'

import axios from "axios";
export class Events extends Component {
  
    state = {
        events: []
      }
    
      componentDidMount() {
        axios.get('http://localhost:3000/api/events')
          .then(res => {
            const events= res.data;
            this.setState({ events });
          })
      }

    render() {
    
    return (
      <div>
         <ul>
        { this.state.events.map(events => <li>{events}</li>)}
      </ul>
      </div>
    )
  }
}

export default Events
