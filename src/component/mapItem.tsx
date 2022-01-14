import * as React from 'react'
import mapboxgl from 'mapbox-gl'
import { LatLng } from '../constants'
import { deepEqual } from 'assert'
import { isEqual } from 'lodash'

mapboxgl.accessToken = "pk.eyJ1Ijoic2VtaWh1Y2FyaSIsImEiOiJjanRxcm1tNTAwY3B2NDRxZHNhcnlnbnluIn0.JLo1IwjIwPzfRqAt2ZcPwQ"

type MapItemProps = {
  destination?: LatLng;
  origin?: LatLng;
  roadMap?: [number, number][]
}

type MapItemState = {
}

export class MapItem extends React.Component<MapItemProps, MapItemState>
{
  private map?: mapboxgl.Map;
  private mapContainer: React.RefObject<HTMLDivElement>;

  constructor(props: MapItemProps) 
  {
    super(props);

    this.mapContainer = React.createRef();
  }

  public componentDidUpdate(prevProps: MapItemProps): void
  {
    const { origin, destination, roadMap } = this.props;
    if (isEqual(this.props, prevProps))
    {
      return;
    }
    if (!origin?.lat || !origin?.lng || !destination?.lat || !destination?.lng)
    {
      this.map?.removeLayer("route");
      return;
    }

    const map = new mapboxgl.Map({
      container: this.mapContainer.current as HTMLDivElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [origin.lat, origin.lng],
      zoom: 12
    });

    map.addControl(new mapboxgl.NavigationControl());
       
    map.on('load', () => {
      if (roadMap)
      {
        map.addSource('route', {
          'type': 'geojson',
          'data': {
            'type': 'Feature',
            'properties': {},
            'geometry': {
              'type': 'LineString',
              'coordinates': roadMap
            }
          }
        });

        const bounds = new mapboxgl.LngLatBounds(
          roadMap[0],
          roadMap[0]
        );

        for (const item of roadMap) {
          bounds.extend(item);
        }
           
        map.fitBounds(bounds, {
          padding: 20
        });
      }


      map.addLayer({
        'id': 'route',
        'type': 'line',
        'source': 'route',
        'layout': {
          'line-join': 'round',
          'line-cap': 'round'
        },
        'paint': {
          'line-color': '#888',
          'line-width': 6
        }
      });
    });

    this.map = map;
  }

  public render(): React.ReactNode 
  {
    return (
      <div>
        <div ref={this.mapContainer} className="map-container" />
      </div>
    )
  }
}
