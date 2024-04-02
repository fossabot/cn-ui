import { decompress } from './compress'
import data from '@cn-ui/area-data/dist/area.json'
export const getChinaAddressOptions = () => {
    return [decompress(data.province_list), decompress(data.city_list), decompress(data.county_list)].map((i) => {
        return Object.entries(i).map(([key, value]) => {
            return {
                label: value,
                value: key
            }
        })
    })
}
