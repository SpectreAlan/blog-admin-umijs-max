import {useRequest} from '@umijs/max';
import {IPropsStatistics} from '../utils'
import {useEffect, useState} from "react";
import VirtualList from 'rc-virtual-list';
import {List, Row, Col} from 'antd';


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
                            <Row>
                                <Col xs={{span: 8}} sm={{span: 8}} md={{span: 4}}>{item.ip}</Col>
                                <Col xs={{span: 8}} sm={{span: 8}} md={{span: 5}}>{item.createdAt}</Col>
                                <Col xs={{span: 0}} sm={{span: 0}} md={{span: 5}}>{item.country}</Col>
                                <Col xs={{span: 8}} sm={{span: 8}} md={{span: 5}}>{item?.city ?? '-'}</Col>
                                <Col
                                    xs={{span: 0}} sm={{span: 0}}
                                    md={{span: 5}}>{item.device}{item?.os.length > 1 ? ` (${item.os})` : '-'}</Col>
                            </Row>
                        </List.Item>
                    )}
                </VirtualList>
            </List>
        </div>
    </div>
};

export default Visitor;
