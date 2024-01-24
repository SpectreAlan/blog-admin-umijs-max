import {useRequest} from '@umijs/max';
import {IPropsStatistics} from '../utils'
import {useEffect, useState} from "react";
import VirtualList from 'rc-virtual-list';
import {List} from 'antd';


const ContainerHeight = 380;
const Visitor: React.FC<IPropsStatistics> = (params) => {
    const [current, setCurrent] = useState(1)
    const [total, setTotal] = useState(0)
    const [list, setList] = useState<Visitor.VisitorItem[]>([])
    const {loading, run} = useRequest({
        url: '/visitor',
        method: 'GET',
        params: {...params, current}
    }, {
        manual: true,
        onSuccess: (res) => {
            setList([...list, ...res.list])
            setTotal(res.total)
        }
    });

    useEffect(() => {
        setList([])
        setCurrent(1)
        setTotal(0)
        run()
    }, [params])
    const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
        if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop === ContainerHeight && list.length !== total) {
            setCurrent(current => current + 1)
            run()
        }
    };
    return <div className="chart">
        <div className="records">
            <h3>访客记录</h3>
            <List loading={loading}>
                <VirtualList
                    data={list}
                    height={ContainerHeight}
                    itemHeight={47}
                    itemKey="id"
                    onScroll={onScroll}
                >
                    {(item: Visitor.VisitorItem) => (
                        <List.Item key={item.id}>
                            <span className="ip">{item.ip}</span>
                            <span className="country">{item.country}</span>
                            <span className="province">{item.province}</span>
                            <span className="city">{item.city}</span>
                            <span className="device">{item.device}({item.os})</span>
                        </List.Item>
                    )}
                </VirtualList>
            </List>
        </div>
    </div>
};

export default Visitor;
