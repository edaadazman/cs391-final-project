import React, { useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

type Props = {
    onNeighborhoodSelect: (name: string) => void;
};

export default function NeighborhoodMap({ onNeighborhoodSelect }: Props) {
    const [layerData, setLayerData] = React.useState<any>(null);

    useEffect(() => {
        fetch(
            'https://gis.bostonplans.org/hosting/rest/services/Hosted/' +
            'Boston_Neighborhood_Boundaries/FeatureServer/1/query?' +
            'where=1=1&outFields=name&outSR=4326&f=geojson'
        )
            .then(r => r.json())
            .then(setLayerData);
    }, []);

    const onEach = (feature: any, layer: L.Layer) => {
        const name = feature.properties.name;
        layer.on({
            click: () => onNeighborhoodSelect(name),
            mouseover: (e: any) => e.target.setStyle({ fillOpacity: 0.6 }),
            mouseout: (e: any) => e.target.setStyle({ fillOpacity: 0.3 })
        });
    };

    return (
        <MapContainer
            center={[42.33, -71.05]}
            zoom={11}
            style={{ height: '100%', width: '100%' }}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {layerData && (
                <GeoJSON
                    data={layerData}
                    style={{ color: '#3388ff', weight: 1, fillOpacity: 0.3 }}
                    onEachFeature={onEach}
                />
            )}
        </MapContainer>
    );
}
