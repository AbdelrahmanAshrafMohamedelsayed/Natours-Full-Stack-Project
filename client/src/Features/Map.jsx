import React from "react";
import maplibregl from "maplibre-gl";
import Map, { NavigationControl, Marker } from "react-map-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import mapboxgl from "mapbox-gl/dist/mapbox-gl";
import mapp from "../assets/pin.png";

const Map2 = ({ startLocation, locations }) => {
  console.log(startLocation);
  return (
    <div className=" mt-[-9vw] ">
      {startLocation &&
        startLocation?.coordinates[0] &&
        startLocation?.coordinates[1] &&
        locations && (
          <Map
            mapLib={maplibregl}
            initialViewState={{
              longitude: +startLocation?.coordinates[0],
              latitude: +startLocation?.coordinates[1],
              zoom: 7,
            }}
            style={{ width: "100%", height: "650px" }}
            mapStyle="https://api.maptiler.com/maps/streets/style.json?key=PDC13gzW8XGuFpwK9qVf"
          >
            <NavigationControl position="top-left" />
            {/* <Marker
              longitude={+startLocation?.coordinates[0]}
              latitude={+startLocation?.coordinates[1]}
              color="#55c57a"
            /> */}
            {locations?.map((item) => (
              <div key={item?._id} className="relative">
                <Marker
                  longitude={+item?.coordinates[0]}
                  latitude={+item?.coordinates[1]}
                  color="#55c57a"
                >
                  <img src={mapp} alt="pin" className="w-[2rem]" />
                  <span className="py-[.5rem] px-[1rem] linearGrad text-[#f7f7f7] box-dec text-[1rem]">
                    {item?.description}
                  </span>
                </Marker>
                {/* define cool label contain the name above the marker */}
              </div>
            ))}
          </Map>
        )}
    </div>
  );
};

export default Map2;
