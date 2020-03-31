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
      data: []
    }
  }

  componentDidMount(){
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
       let groupedPeople = groupBy(response.data, 'preferredStyle')
       return{
            category:finalVar.preferredStyle,
            totalCount:groupedPeople[finalVar.preferredStyle].length
            } 
          }
        )
      this.setState({data: finalPost});    
      console.log(finalPost)      
    });
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
      .domain([0, Math.max(...data.map(d => (d.totalCount)))])
      .range([height, 0])
      .nice();

    return (
      <div className='App-chart-container'>
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
