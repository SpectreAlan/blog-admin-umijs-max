import ReactECharts from 'echarts-for-react';
import {Radio} from "antd";
import {useState} from 'react'

interface IProps {
    loading: boolean
    data: any
}

const types: any = {
    os: '系统',
    device: '设备'
}

const Pie: React.FC<IProps> = ({loading, data}) => {

    const [selected, setSelected] = useState<string>('os');
    const option = {
        title: {
            text: '访客设备'
        },
        tooltip: {},
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
        },
        label: {
            show: false,
            position: 'center'
        },
        emphasis: {
            label: {
                show: true,
                fontSize: 40,
                fontWeight: 'bold'
            }
        },
        labelLine: {
            show: false
        },
        series: [{
            type: 'pie',
            data: Object.keys(data[selected]).map(item=>({
                value: data[selected][item],
                name: item
            }))
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

export default Pie;
