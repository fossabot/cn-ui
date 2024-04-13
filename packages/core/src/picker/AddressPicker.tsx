import { OriginComponent, computed } from "@cn-ui/reactive";
import type { SelectOptionsType } from "@cn-ui/reactive";
import { For } from "solid-js";
import { Flex } from "../container";
import { PickerColumn } from "./PickerColumn";

export interface AddressPickerProps {
	options: {
		label: string;
		value: string;
	}[][];
}

export const AddressPicker = OriginComponent<
	AddressPickerProps,
	HTMLDivElement,
	SelectOptionsType[]
>((props) => {
	const data = props.model;

	const rebuildOptions = () => {
		const provinceCode = data()[0].value.toString().slice(0, 2);
		const cityUnderProvince = props.options[1].filter((i) =>
			i.value.startsWith(provinceCode),
		);
		if (!data()[1].value.toString().startsWith(provinceCode)) {
			data((i) => {
				const newArr = [...i];
				newArr[1] = cityUnderProvince[0];
				return newArr;
			});
		}

		const cityCode = data()[1].value.toString().slice(0, 4);
		const countyUnderCity = props.options[2].filter((i) =>
			i.value.startsWith(cityCode),
		);
		if (!data()[2].value.toString().startsWith(cityCode)) {
			data((i) => {
				const newArr = [...i];
				newArr[2] = countyUnderCity[0];
				return newArr;
			});
		}

		return [props.options[0], cityUnderProvince, countyUnderCity];
	};
	const initModel = () => {
		console.log(props.model());
		if (!props.model()?.length) {
			props.model(props.options.map((i) => i[0]));
		}
		rebuildOptions();
	};
	initModel();
	/**
	 * 级联地址的联动选项
	 * @effect 强制检查数据正确性并赋值
	 */
	const computedOptions = computed(rebuildOptions);

	return (
		<Flex class="w-full">
			<For each={computedOptions()}>
				{(options, index) => {
					const model = props.model.reflux(props.model()[index()], (i) => {
						const newArr = [...props.model()];
						newArr[index()] = i;
						return newArr;
					});
					return (
						<PickerColumn
							visibleOptionNum={3}
							class="flex-1"
							v-model={model}
							options={options}
						/>
					);
				}}
			</For>
		</Flex>
	);
});
