import {useRequest} from '@umijs/max';
import ReactECharts from 'echarts-for-react';
import {IPropsStatistics} from '../utils'
import {useEffect} from "react";

const Comments: React.FC<IPropsStatistics> = (params) => {
    const {data = {xAxis: [], series: []}, loading, run} = useRequest({
        url: '/comment/statistics',
        method: 'GET',
        params
    }, {manual: true});

    useEffect(() => {
        run()
    }, [params])
    const option = {
        title: {
            text: '评论统计'
        },
        tooltip: {},
        xAxis: {
            data: data.xAxis
        },
        yAxis: {},
        series: [{
            name: '评论数量',
            type: 'bar',
            data: data.series
        }]
    };
    return <div className="chart">
        <ReactECharts
            showLoading={loading}
            option={option}
            style={{height: 400}}
            opts={{renderer: 'svg'}}
        />
    </div>
};

export default Comments;
