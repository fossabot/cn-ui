import { ensureArrayReturn } from "@cn-ui/reactive";
import Schema from "async-validator";
import type { RuleItem } from "async-validator";
import { createMemo } from "solid-js";
import { type RootColumnDef, getKeyFromRootColumnDef } from "./utils";

/** 用于表单校验的规则构建 */
export const useValidator = <T, D>(
	config: RootColumnDef<T, D>[],
	originData: T,
	index: number,
) => {
	const validator = createMemo(() => {
		const schema = Object.fromEntries(
			config.reduce(
				(schema, column) => {
					const rules: RuleItem[] = [];
					let ruleType: RuleItem["type"];
					if ("required" in column && column.required) {
						switch (column.type) {
							case "date-range":
							case "checkbox":
								ruleType = "array";
								break;
							case "number":
								ruleType = "number";
								break;
							case "date":
								ruleType = "date";
								break;
						}
						rules.push({
							required: true,
							type: ruleType,
						});
					}
					if ("rules" in column && column.rules) {
						rules.push(...ensureArrayReturn(column.rules));
					}
					if (rules.length)
						schema.push([
							getKeyFromRootColumnDef(column, originData, index),
							rules,
						]);
					return schema;
				},
				[] as [string, RuleItem[] | RuleItem][],
			),
		);
		return new Schema(schema);
	});

	return { validator };
};
