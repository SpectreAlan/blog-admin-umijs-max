import {PageContainer} from '@ant-design/pro-components';
import Article from './charts/article'
import Comments from './charts/comments'
import Visitor from './charts/visitor'
import Records from './charts/records'
import VisitorAnalysis from "@/pages/Home/charts/visitorAnalysis";
import {Radio} from 'antd'
import {useState} from 'react'
import {rangesByDay, IPropsStatistics, rangesByMonth} from './utils'
import './home.less'


const HomePage: React.FC = () => {
    const [selected, setSelected] = useState<number>(0)
    const [range, setRange] = useState<IPropsStatistics>(rangesByDay[0].fun())
    return (
        <PageContainer ghost>
            <div className="home">
                <div className="form">
                    <Radio.Group
                        buttonStyle="solid"
                        value={selected}
                        onChange={(e) => {
                            const val = e.target.value
                            setSelected(val)
                            setRange(rangesByDay[val].fun());
                        }}>
                        {
                            rangesByDay.map((item, index) => <Radio.Button
                                value={index}
                                key={item.title}
                            >{item.title}</Radio.Button>)
                        }
                    </Radio.Group>
                    <Radio.Group
                        buttonStyle="solid"
                        value={selected}
                        onChange={(e) => {
                            const val = e.target.value
                            setSelected(val)
                            setRange(rangesByMonth[val - rangesByDay.length].fun());
                        }}>
                        {
                            rangesByMonth.map((item, index) => <Radio.Button
                                value={index + rangesByDay.length}
                                key={item.title}
                            >{item.title}</Radio.Button>)
                        }
                    </Radio.Group>
                </div>
                <div className="charts">
                    <Visitor {...range}/>
                    <Records {...range}/>
                    <VisitorAnalysis {...range}/>
                    <Article {...range}/>
                    <Comments {...range}/>
                </div>
            </div>
        </PageContainer>
    );
};
export default HomePage;
