import * as React from 'react';
import { CoordinateInput } from './component/coordinateInput';
import { DistanceCostDisplay } from './component/distanceCostDisplay';
import { MapItem } from './component/mapItem';
import { AppState, CalculationType, LatLng } from './constants';

export class App extends React.Component<{}, AppState>
{
  constructor(props: {})
  {
    super(props);

    this.state = {
      calculationType: CalculationType.Coordinates
    }

    this.handleMapChange = this.handleMapChange.bind(this);
  }

  public render(): React.ReactNode
  {
    const { destination, distance, origin, roadMap, totalCost } = this.state;

    return (
      <div className="App">
        <div className="content">
          <CoordinateInput onChange={this.handleMapChange}/>
          <DistanceCostDisplay cost={totalCost} distance={distance}/>
          <MapItem destination={destination} origin={origin} roadMap={roadMap}/>
        </div>
      </div>
    );
  }

  private handleMapChange(value: AppState): void
  {
    this.setState(value);
  }
}
