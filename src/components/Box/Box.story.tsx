export const Controller = [];
import { Image, Result, Box } from '@cn-ui/core';
export default (props) => {
    const baseStyle = { height: '200px', width: '100%' };
    return (
        <>
            <div style={baseStyle}>
                <Box
                    class="bg-slate-50"
                    icon={
                        <Image
                            src="https://doodleipsum.com/700x525/hand-drawn?i=dee23ea78d4bed889e6b2c07f25f3a13"
                            style={{ 'max-width': '70%', 'max-height': '70%', overflow: 'hidden' }}
                        ></Image>
                    }
                    subTitle="数据为空"
                ></Box>
            </div>
            <div style={baseStyle}>
                <Result
                    class="bg-green-50"
                    icon="success"
                    title="数据为空"
                    subTitle="这是一些描述信息"
                ></Result>
            </div>
            <div style={baseStyle}>
                <Result
                    class="bg-red-50"
                    icon="error"
                    title="数据为空"
                    subTitle="这是一些描述信息"
                ></Result>
            </div>
            <div style={baseStyle}>
                <Result
                    class="bg-blue-50"
                    icon="info"
                    title="数据为空"
                    subTitle="这是一些描述信息"
                ></Result>
            </div>
            <div style={baseStyle}>
                <Result
                    class="bg-yellow-50"
                    icon="warning"
                    title="数据为空"
                    subTitle="这是一些描述信息"
                ></Result>
            </div>
        </>
    );
};
