import {PageContainer} from '@ant-design/pro-components';
import {useModel} from '@umijs/max';
import styles from './index.less';
import {request, useRequest} from 'umi';
import {useEffect} from 'react'


const HomePage: React.FC = () => {
    const {name} = useModel('global');
    const { data, error, loading } = useRequest('/api/blog/list');
    console.log(data);
    console.log(loading);
    console.log('-------------');
    return (
        <PageContainer ghost>
            <div className={styles.container}>
                {loading ? 'loading' : JSON.stringify(data)}
            </div>
        </PageContainer>
    );
};

export default HomePage;
