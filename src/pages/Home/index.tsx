import {PageContainer} from '@ant-design/pro-components';
import styles from './index.less';
import {  useRequest} from '@umijs/max';


const HomePage: React.FC = () => {
    const { data, loading } = useRequest('/article');
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
