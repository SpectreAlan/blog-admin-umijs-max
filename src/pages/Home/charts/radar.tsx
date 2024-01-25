import ReactECharts from 'echarts-for-react';
import {Radio} from "antd";
import {useState} from 'react'

interface IProps {
    loading: boolean
    data: any
}

const types: any = {
    country: '国家',
    province: '省份',
    city: '城市',
}

const Radar: React.FC<IProps> = ({loading, data}) => {

    const [selected, setSelected] = useState<string>('country');
    const option = {
        title: {
            text: '访客分布'
        },
        tooltip: {},
        radar: {
            indicator: Object.keys(data[selected]).map(name => ({name}))
        },
        series: [{
            type: 'radar',
            data: [
                {
                    value: Object.values(data[selected]),
                    name: '访客数量'
                }
            ]
        }]
    }
    return <div className="chart">
        <Radio.Group
            size={"small"}
            className='type-radio'
            buttonStyle="solid"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}>
            {
                Object.keys(types).map((item: string) => <Radio.Button
                    value={item}
                    key={item}
                >{types[item]}</Radio.Button>)
            }
        </Radio.Group>
        <ReactECharts
            showLoading={loading}
            option={option}
            style={{height: 400}}
            opts={{renderer: 'svg'}}
        />
    </div>
};

export default Radar;
