import * as React from 'react'
import { AppState, CalculationType, Geocode, LatLng, RouteResponse } from '../constants';
import { Rest } from '../rest';
import { cloneDeep, set } from "lodash"

type CoordinateInputProps = {
  onChange: (value: AppState) => void;
}

type CoordinateInputState = AppState & {
  destinationName?: string;
  originName?: string;
  unitCost: number;
}

export class CoordinateInput extends React.Component<CoordinateInputProps, CoordinateInputState> 
{
  constructor(props: CoordinateInputProps)
  {
    super(props);

    this.state = {
      calculationType: CalculationType.Distance,
      unitCost: 1
    }

    this.calculateRoute = this.calculateRoute.bind(this);
    this.handleChangeCalculationType = this.handleChangeCalculationType.bind(this);
    this.handleChangeInput = this.handleChangeInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderByDistance = this.renderByDistance.bind(this);
    this.renderByCoordinates = this.renderByCoordinates.bind(this);
    this.renderByNames = this.renderByNames.bind(this);
    this.renderFields = this.renderFields.bind(this);
  }

  public render(): React.ReactNode
  {
    return (
      <form className="pure-form pure-form-aligned">
        <fieldset>
          <div className="pure-control-group">
              <label>Calculation method</label>
              <select className="pure-input pure-input-2-3" onChange={this.handleChangeCalculationType}>
                {Object.values(CalculationType).map(item => (
                  <option key={item}>{item}</option>
                ))}
              </select>
          </div>
          {this.renderFields()}
          <div className="pure-control-group">
              <label>Unit cost</label>
              <input className="pure-input-2-3" name="unitCost" onChange={this.handleChangeInput} placeholder="€/Km"/>
          </div>
          <div className="pure-controls">
            <button type="button" className="pure-button pure-button-primary" onClick={this.handleSubmit}>Calculate</button>
          </div>
        </fieldset>
      </form>
    )
  }

  private async calculateRoute(origin: LatLng, destination: LatLng): Promise<RouteResponse | undefined>
  {
    let route: RouteResponse | undefined;
    try
    {
      route = await Rest.route(origin, destination);
    }
    catch (error)
    {
      return;
    }
    return route;
  }

  private handleChangeCalculationType(event: React.ChangeEvent<HTMLSelectElement>): void
  {
    const { onChange } = this.props;
    const value = event.target.value as CalculationType;
    
    this.setState({ calculationType: value, destination: undefined, origin: undefined });
    onChange({ calculationType: value, destination: undefined, distance: undefined, origin: undefined, roadMap: undefined, totalCost: undefined })
  }

  private handleChangeInput(event: React.ChangeEvent<HTMLInputElement>): void
  {
    const { name, value } = event.target;

    const state = cloneDeep(this.state);
    this.setState(set(state, name, value));
  }

  private async handleSubmit(): Promise<void>
  {
    const { onChange } = this.props;
    const { calculationType, destination, destinationName, distance, origin, originName, unitCost } = this.state;

    switch (calculationType) {
      case CalculationType.Distance:
        if (!distance || !unitCost)
        {
          return;
        }
        onChange({ calculationType, distance, totalCost: Number(distance) * unitCost })
        break;
      case CalculationType.Coordinates:
      {
        if (!origin?.lat || !origin.lng || !destination?.lat || !destination.lng)
        {
          return;
        }
        const route = await this.calculateRoute(origin, destination);

        if (!route)
        {
          return;
        }

        onChange({
          calculationType,
          origin, 
          destination, 
          roadMap: route.routes[0].legs.map(
            leg => leg.steps.map(item => item.intersections).flat().map(item => item.location)).flat(),
          totalCost: Math.round(((route.routes[0].distance / 1000) * unitCost) * 10 / 10)
        })
        break;
      }

      case CalculationType.Names:
      {
        if (!originName || !destinationName)
        {
          return;
        }
        let originGeocode: Geocode | undefined;
        try
        {
          originGeocode = await Rest.geoCode(originName)
        }
        catch
        {
          return;
        }
        let destinationGeocode: Geocode | undefined;
        try
        {
          destinationGeocode = await Rest.geoCode(destinationName)
        }
        catch
        {
          return;
        }
        const [originLat, originLng] = originGeocode.features[0].center;
        const [destinationLat, destinationLng] = destinationGeocode.features[0].center;

        const calculatedOrigin = { lat: originLat, lng: originLng };
        const calculatedDestination = { lat: destinationLat, lng: destinationLng };

        const route = await this.calculateRoute(calculatedOrigin, calculatedDestination);

        if (!route)
        {
          return;
        }

        onChange({
          calculationType,
          origin: calculatedOrigin, 
          destination: calculatedDestination, 
          roadMap: route.routes[0].legs.map(
            leg => leg.steps.map(item => item.intersections).flat().map(item => item.location)).flat(),
          totalCost: Math.round(((route.routes[0].distance / 1000) * unitCost) * 10 / 10)
        })
        break;
      }

      default:
        break;
    }
  }

  private renderByCoordinates(): React.ReactNode
  {
    const { destination, origin } = this.state;
    return (
      <>
        <div className="pure-control-group">
          <label>Origin</label>
          <input className="pure-input-1-3" name="origin.lat" onChange={this.handleChangeInput} placeholder="Latitude" value={origin?.lat ?? ""}/>
          <input className="pure-input-1-3" name="origin.lng" onChange={this.handleChangeInput} placeholder="Longitude" value={origin?.lng ?? ""}/>
        </div>
        <div className="pure-control-group">
          <label>Destination</label>
          <input className="pure-input-1-3" name="destination.lat" onChange={this.handleChangeInput} placeholder="Latitude" value={destination?.lat ?? ""}/>
          <input className="pure-input-1-3" name="destination.lng" onChange={this.handleChangeInput} placeholder="Longitude" value={destination?.lng ?? ""}/>
        </div>
      </>
    )
  }

  private renderByDistance(): React.ReactNode
  {
    const { distance } = this.state;
    return (
      <div className="pure-control-group">
          <label>Distance</label>
          <input className="pure-input-2-3" name="distance" onChange={this.handleChangeInput} placeholder="Km" type="number" value={distance ?? ""}/>
      </div>
    )
  }

  private renderByNames(): React.ReactNode
  {
    const { destinationName, originName } = this.state;
    return (
      <>
        <div className="pure-control-group">
          <label>Origin name</label>
          <input className="pure-input-2-3" name="originName" onChange={this.handleChangeInput} placeholder="e.g., Berlin" value={originName ?? ""} />
        </div>
        <div className="pure-control-group">
          <label>Destination name</label>
          <input className="pure-input-2-3" name="destinationName" onChange={this.handleChangeInput} placeholder="e.g., Moscow" value={destinationName ?? ""} />
        </div>
      </>
    )
  }

  private renderFields(): React.ReactNode
  {
    const { calculationType } = this.state;
    
    switch (calculationType) 
    {
      case CalculationType.Coordinates:
        return this.renderByCoordinates();
      case CalculationType.Distance:
        return this.renderByDistance();
      case CalculationType.Names:
        return this.renderByNames();
      default:
        return;
    }
  }
}
