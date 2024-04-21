import "./deps.d";
import data from "@cn-ui/area-data/dist/area.json";
import { decompress } from "./compress";
export const getChinaAddressOptions = () => {
    return [
        decompress(data.province_list),
        decompress(data.city_list),
        decompress(data.county_list),
    ].map((i) => {
        return Object.entries(i).map(([key, value]) => {
            return {
                label: value,
                value: key,
            };
        });
    });
};
