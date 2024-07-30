import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
    title: string;
    Svg: React.ComponentType<React.ComponentProps<'svg'>>;
    description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
    {
        title: '原生',
        Svg: require('@site/static/img/php2-svgrepo-com.svg').default,
        description: (
            <>
                基于PHP原生协程实现,100%的PHP代码率, 无需第三方扩展, 无需额外的学习成本
            </>
        ),
    },
    {
        title: '生态',
        Svg: require('@site/static/img/composer-svgrepo-com.svg').default,
        description: (
            <>
                保持所有组件的原生性, 提供丰富的生态支持, 与所有composer包兼容, 无需担心生态问题
            </>
        ),
    },
    {
        title: '集成',
        Svg: require('@site/static/img/easy-installation.svg').default,
        description: (
            <>
                传统的PHP框架支持高度集成, 无缝支持Laravel, Symfony, ThinkPHP, Yii等主流框架, 无需改动原有代码
            </>
        ),
    },
];

function Feature({title, Svg, description}: FeatureItem) {
    return (
        <div className={clsx('col col--4')}>
            <div className="text--center">
                <Svg className={styles.featureSvg} role="img"/>
            </div>
            <div className="text--center padding-horiz--md">
                <Heading as="h3">{title}</Heading>
                <p>{description}</p>
            </div>
        </div>
    );
}

export default function HomepageFeatures(): JSX.Element {
    return (
        <section className={styles.features}>
            <div className="container">
                <div className="row">
                    {FeatureList.map((props, idx) => (
                        <Feature key={idx} {...props} />
                    ))}
                </div>
            </div>
        </section>
    );
}
