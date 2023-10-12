const MAP_TILE_URL = import.meta.env.VITE_API_KEY ? `https://api.myptv.com/maps/v1/vector-tiles/{z}/{x}/{y}` : 'https://api.myptv.com/maps/v1/vector-tiles/{z}/{x}/{y}';

export const initialMapStyle: mapboxgl.Style = {
  version: 8,
  name: "initial",
  pitch: 0,
  sources: {
    ptv: {
      type: "vector",
      tiles: [
        MAP_TILE_URL
      ],
      minzoom: 0,
      maxzoom: 17
    }
  },
  layers: [],
  sprite: "https://vectormaps-resources.myptv.com/icons/latest/sprite",
  glyphs: "https://vectormaps-resources.myptv.com/fonts/latest/{fontstack}/{range}.pbf",

};

export const getMapStyle = (url: string) => {
  return fetch(url)
    .then(result => result.json())
    .then(mapStyle => {
      mapStyle["sources"]["ptv"]["tiles"] = [MAP_TILE_URL];
      return mapStyle;
    })
    .catch(err => console.error(err));
};
