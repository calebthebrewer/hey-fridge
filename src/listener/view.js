import React, { Component } from 'react'
import d3 from 'd3'
import _throttle from 'lodash.throttle'

export default class TreeD3 extends Component {
  componentDidMount() {
    this.trees = {}
    this.diagonal = d3.svg.diagonal().projection(d => [d.x, d.y])
    this.drawTrees(this.props.data)
    this.refreshTree = _throttle(this.refreshTree.bind(this), 500, {leading: false})
    window.addEventListener('resize', this.refreshTree)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.refreshTree)
  }

  shouldComponentUpdate(nextProps) {
    this.drawTrees(nextProps.data)
    return false
  }

  refreshTree() {
    this.drawTrees(this.props.data)
  }

  drawTrees(trees) {
    if (!trees) return

    let count = trees.length
    let width = (window.innerWidth / count) - 10
    let height = window.innerHeight - 10

    trees.forEach((newTree, i) => {
      let tree = this.trees[newTree.id]

      if (!tree) {
        // construct tree
        this.trees[newTree.id] = tree = {
          svg: d3.select(`#${this.props.id}`).append('svg')
            .attr('viewBox', `0 0 ${width} ${height}`)
          	.attr('width', width)
          	.attr('height', height),
          layout: d3.layout.tree().size([width, 500])
        }
      } else {
        // resize tree
        tree.svg.attr('width', width)
        tree.layout.size([height, width])
      }

      var nodes = tree.layout.nodes(newTree).reverse()
    	var links = tree.layout.links(nodes)

      // Normalize for fixed-depth.
      nodes.forEach(d => d.y = 40 + (d.depth * 100))

      // Declare the nodes…
      var node = tree.svg.selectAll('g.node').data(nodes, d => d.id || (d.id = ++i))

      // Enter the nodes.
      var nodeEnter = node.enter().append('g')
    	  .attr('class', 'node')
    	  .attr('transform', d => `translate(${d.x}, ${d.y})`)

      nodeEnter.append('circle')
    	  .attr('r', 10)
    	  .style('fill', '#fff')

      nodeEnter.append('text')
    	  .attr('y', d => d.children || d._children ? -18 : 18)
    	  .attr('dy', '.35em')
    	  .attr('text-anchor', 'middle')
    	  .text(d => d.label)
    	  .style('fill-opacity', 1)

      // Declare the links…
      var link = tree.svg.selectAll('path.link').data(links, d => d.target.id)

      // Enter the links.
      link.enter().insert('path', 'g')
    	  .attr('class', 'link')
    	  .attr('d', this.diagonal)
    })
  }

  render() {
    const { id } = this.props
    return (
      <div id={ id }></div>
    )
  }
}
