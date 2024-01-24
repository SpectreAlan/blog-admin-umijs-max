import {useRequest} from '@umijs/max';
import ReactECharts from 'echarts-for-react';
import {IPropsStatistics} from '../utils'
import {useEffect} from "react";

const Visitor: React.FC<IPropsStatistics> = (params) => {
    const {data = {xAxis: [], series: []}, loading, run} = useRequest({
        url: '/visitor/statistics',
        method: 'GET',
        params
    }, {manual: true});

    useEffect(() => {
        run()
    }, [params])
    const option = {
        title: {
            text: '访客统计'
        },
        tooltip: {},
        xAxis: {
            data: data.xAxis
        },
        yAxis: {},
        series: [{
            name: '访客数量',
            type: 'line',
            data: data.series
        }]
    };
    return <ReactECharts
        showLoading={loading}
        option={option}
        style={{height: 400}}
        opts={{renderer: 'svg'}}
    />
};

export default Visitor;
