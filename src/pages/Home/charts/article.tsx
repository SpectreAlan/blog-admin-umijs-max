import {useRequest} from '@umijs/max';
import ReactECharts from 'echarts-for-react';
import {IPropsStatistics} from '../utils'
import {useEffect} from "react";

const Article: React.FC<IPropsStatistics> = (params) => {
    const {data = {xAxis: [], series: []}, loading, run} = useRequest({
        url: '/article/statistics',
        method: 'GET',
        params
    }, {manual: true});

    useEffect(() => {
        run()
    }, [params])
    const option = {
        title: {
            text: '博客统计'
        },
        tooltip: {},
        xAxis: {
            data: data.xAxis
        },
        yAxis: {},
        series: [{
            name: '创作数量',
            type: 'line',
            data: data.series
        }]
    };
    console.log(data);
    return <ReactECharts
        showLoading={loading}
        option={option}
        style={{height: 400}}
        opts={{renderer: 'svg'}}
    />
};

export default Article;
