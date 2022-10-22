import { Atom } from '@cn-ui/use';

export namespace FormFieldOptions {
    export interface ExtraSystemMessage {
        onChange?: <T>(key: string, value: T) => void;
    }
    export interface AllowParams<D> {
        /** 组件的参数 */
        params?: Partial<D>;
    }
    export interface commonProp<T> {
        prop: string;
        /** 默认为 prop */
        label?: string;

        valid?: (
            value: T,
            total: {
                [key: string]: Atom<unknown>;
            }
        ) => string | void | Promise<string> | Promise<void>;
    }
    export type baseProp<T> = ExtraSystemMessage & commonProp<T>;
    export type WithDefault<T> = {
        default?: T;
    };

    /// 列举组件
    export interface Select<T = { value: string; label?: string }>
        extends baseProp<T>,
            WithDefault<string>,
            AllowParams<import('@cn-ui/core').SelectProps> {
        type: 'select';
        options: T[];
    }

    export type Radio = Omit<Select, 'type'> & { type: 'radio' } & AllowParams<
            import('@cn-ui/core').CheckGroupProps
        >;
    export interface Switch<T = boolean>
        extends baseProp<T>,
            WithDefault<T>,
            AllowParams<import('@cn-ui/core').SwitchProps> {
        type: 'switch';
    }
    export interface Range<T = number>
        extends baseProp<T>,
            WithDefault<T>,
            AllowParams<import('@cn-ui/core').InputNumberProps> {
        type: 'range';
        unit?: string;
    }
    export type Slider = Omit<Range, 'type'> & { type: 'slider' };
    export interface Color<T = string>
        extends baseProp<T>,
            WithDefault<T>,
            AllowParams<import('@cn-ui/core').InputColorProps> {
        type: 'color';
    }
    export interface Rate<T = number>
        extends baseProp<T>,
            WithDefault<T>,
            AllowParams<import('@cn-ui/core').RateProps> {
        type: 'rate';
    }
    export interface Text<T = string>
        extends baseProp<T>,
            WithDefault<T>,
            AllowParams<import('@cn-ui/core').InputTextProps> {
        type: 'text';
    }
}