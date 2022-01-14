import * as React from 'react'

type DistanceCostDisplayProps = {
  cost?: string | number;
  distance?: string | number;
}

export class DistanceCostDisplay extends React.PureComponent<DistanceCostDisplayProps, {}> {
  render() {
    return (
      <div className="total-cost-display">
        <span>Total cost:</span><h1>{this.props.cost ?? "--"}</h1><span>€</span>
        <br />
        <span>Total distance:</span><h1>{this.props.distance ?? "--"}</h1><span>km</span>
      </div>
    )
  }
}
