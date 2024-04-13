import { OriginComponent, OriginDiv, useSelect } from "@cn-ui/reactive";
import { AiOutlineCheck, AiOutlineRight } from "solid-icons/ai";
import { For, Match, Switch } from "solid-js";
import type { CommonGroupListConfig } from "../groupList";
import { Icon } from "../icon";
import { SelectCtx } from "../select";
import { SelectPanel } from "../select/SelectPanel";

type SelectedEvent = (checked: CommonGroupListConfig, isLeaf: boolean) => void;

export interface CascaderPanelProps {
	options: CommonGroupListConfig[];
	onSelected?: SelectedEvent;
}
export const CascaderPanel = OriginComponent<
	CascaderPanelProps,
	HTMLDivElement,
	CommonGroupListConfig[]
>((props) => {
	return (
		<OriginDiv prop={props} class="border rounded-lg flex select-none">
			<For each={[null, ...props.model()]}>
				{(item, index) => {
					const options = item === null ? props.options : item.options;
					if (!options) return null;
					const selectSystem = useSelect(() => options!, {
						multi: () => false,
					});
					return (
						<SelectCtx.Provider value={selectSystem}>
							<SelectPanel
								class="p-1 border-r"
								disallowCancelClick
								options={options!}
								onSelected={(item) => {
									props.model((i) => {
										const newArr = i.slice(0, index());
										newArr[index()] = item;
										console.log(newArr);
										return newArr;
									});
								}}
								selectedIconSlot={(item: CommonGroupListConfig | undefined) => (
									<Icon class="w-6 px-1 flex-none text-primary-400">
										<Switch>
											<Match when={item?.options}>
												<AiOutlineRight
													class={
														selectSystem.isSelected(item!)
															? ""
															: "text-gray-400"
													}
												/>
											</Match>
											<Match when={selectSystem.isSelected(item!)}>
												<AiOutlineCheck />
											</Match>
										</Switch>
									</Icon>
								)}
							/>
						</SelectCtx.Provider>
					);
				}}
			</For>
		</OriginDiv>
	);
});
