import {useRequest} from '@umijs/max';
import {IPropsStatistics} from '../utils'
import {useEffect} from "react";
import Radar from './radar'
import Pie from './pie'

const VisitorAnalysis: React.FC<IPropsStatistics> = (params) => {
    const {data = {country: {'中国': 0}, city: {}, province: {}, os: {iPhone: 0}}, loading, run} = useRequest({
        url: '/visitor/analysis',
        method: 'GET',
        params
    }, {manual: true});

    useEffect(() => {
        run()
    }, [params])

    return <>
        <Radar loading={loading} data={data}/>
        <Pie loading={loading} data={data}/>
    </>
};

export default VisitorAnalysis;
