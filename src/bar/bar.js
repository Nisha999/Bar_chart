import React from 'react';
import { select, event } from 'd3-selection';
import { transition } from 'd3-transition';
import * as d3 from 'd3'
const color = ['#f05440', '#d5433d', '#b33535', '#283250'];
class Bar extends React.Component {
  constructor() {
    super();
    this.ref = React.createRef();

    
  }
  componentDidMount() {
    this.init();
  }
  componentDidUpdate() {

    this.barTransition();
    this.init();
  

  }

  barTransition() {
    const node = this.ref.current;
    const { yScale, height, data, t } = this.props;

    select(node)
      .selectAll('.bar')
      .data(data)
      .transition(t)
      .attr('y', d => yScale(d.value))
      .attr('height', d => height - yScale(d.value))
  }
  init() {
    
    const {xScale, yScale, data, height,t} = this.props;
    const node = this.ref.current;

    // prepare initial data from where transition starts.
    const initialData = data.map(obj => ({
      category: obj.category,
      value: 0
    }));

 

    // prepare the field
    const bar = select(node)
      .selectAll('.bar')
      .data(initialData);

      
      // console.log(initialData);
    // add rect to svg
    bar
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.category))
      .attr('y', height)
      .attr('width', xScale.bandwidth())
      .style('fill', function(d, i) {
        return color[i % 4] // use colors in sequence
      })

    this.barTransition();
        
    // // bar-label
    // select(node)
    
    //   .selectAll('.bar-label')
    //   .data(data)
    //   .enter()
     
    //   .append('text')
    //   .classed('bar-label', true)
    //   .transition(t)
    //   .attr('x', d => xScale(d.category) + xScale.bandwidth()/2)
    //   .attr('dx', 0)
    //   .attr('y', d => yScale(d.value))
    //   .attr('dy', -6)
    //   .attr("font-family", "sans-serif")
    //   .attr("font-size", "10px")
    //   .attr("fill", "black")
    //   .attr("text-anchor", " middle") 
    //   .text(function(d) { return d.value; })   

}
  render() {
    return (
      <g
        className="bar-group"
        ref={this.ref}
      />
    );
  }
}

export default Bar;
