import { useSearchParams } from "react-router-dom";

export function useURLPosition() {
  const [param] = useSearchParams();

  const mapLat = param.get("lat");
  const mapLng = param.get("lng");

  return [mapLat, mapLng];
}
