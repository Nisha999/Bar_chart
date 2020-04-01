import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import { render } from 'react-dom';
import { scaleBand, scaleLinear } from 'd3-scale';
import { transition } from 'd3-transition';
import XYAxis from './axis/xy-axis.js';
import Grid from './grid/grid.js';
import Bar from './bar/bar.js';


class App extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      SelectedValue: 'preferredStyle'
    }
    this.handleChange = this.handleChange.bind(this);
    this.mountingFunc=this.mountingFunc.bind(this);
    
  }


  handleChange(event) { 
    this.setState({SelectedValue: event.target.value});
    console.log(this.state.SelectedValue)
    this.mountingFunc()
  }


  mountingFunc(){
      axios.get('http://localhost:8080/myApp/myApp/subscriptions')
      .then(response=>{   
        function groupBy(objectArray, property) {
          return objectArray.reduce(function (acc, obj) {
            let key = obj[property]
            if (!acc[key]) {
              acc[key] = []
            }
            acc[key].push(obj)
            return acc
          }, {})
        }
        const finalPost=response.data.map(finalVar=>{
        // let choice=this.state.SelectedValue
        console.log(this.state.SelectedValue)
        let groupedPeople = groupBy(response.data, this.state.SelectedValue)
          return{
                category:finalVar[this.state.SelectedValue],
                value:groupedPeople[finalVar[this.state.SelectedValue]].length
                } 
              }
            )
        this.setState({data: finalPost});     
        
      });
  }

  componentDidUpdate(){
    console.log(this.state.SelectedValue)
    // this.mountingFunc()
   
   
  }

  componentDidMount(){
    this.mountingFunc()
  }  
     
  render() {
    const  {data}  = this.state;
    const parentWidth = 700;
    const margin = {
      top: 50,
      right: 10,
      bottom: 20,
      left: 40,
    };
    const ticks = 6;
    const t = transition().duration(1000);
    const width = parentWidth - margin.left - margin.right;
    const height = parentWidth * 0.5 - margin.top - margin.bottom;
    
 
      const xScale = scaleBand()
      .domain(data.map(d => (d.category)))
      .range([0, width])
      .padding(0.45);

    const yScale = scaleLinear()
      .domain([0, Math.max(...data.map(d => (d.value)))])
      .range([height, 0])
      .nice();

    

    return (
      <div className='App-chart-container'>
        <form onSubmit={this.handleSubmit}>
          <label>
            Choose the display category:
            <br/>
            <br/>
            <select value={this.state.value} onChange={this.handleChange}>
              <option value="preferredStyle">Preferred Style</option>
              <option value="age">Age</option>
              <option value="gender">Gender</option>
            </select>
          </label>
        </form>
        <svg width={width + margin.left + margin.right} height={height + margin.top + margin.bottom}>
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            <XYAxis {...{ xScale, yScale, height, ticks, t }} />
            <Grid {...{ xScale, yScale, width, ticks, t }} />
            <Bar
              {...({
                xScale,
                yScale,
                data,
                height,
                t,
              })}
            />
          </g>
        </svg>
      </div>
      
    );  
  }
}

export default App;
