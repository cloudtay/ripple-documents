import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
    title: 'Ripple',
    tagline: 'PHP协程引擎',
    favicon: 'img/favicon.ico',

    // Set the production url of your site here
    url: 'https://ripple.cloudtay.com',
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: '/documents/',
    trailingSlash: false,

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: 'facebook', // Usually your GitHub org/user name.
    projectName: 'docusaurus', // Usually your repo name.

    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',

    // Even if you don't use internationalization, you can use this field to set
    // useful metadata like html lang. For example, if your site is Chinese, you
    // may want to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: 'zh',
        locales: ['zh'],
        localeConfigs: {
            zh: {
                label: '中文',
                htmlLang: 'zh-CN',
                path: 'zh',
            },
        }
    },

    presets: [
        [
            'classic',
            {
                docs: {
                    sidebarPath: './sidebars.ts',
                    // Please change this to your repo.
                    // Remove this to remove the "edit this page" links.
                    editUrl:
                        'https://github.com/cloudtay/ripple-documents/tree/main/',
                },
                blog: {
                    showReadingTime: true,
                    // Please change this to your repo.
                    // Remove this to remove the "edit this page" links.
                    editUrl:
                        'https://github.com/cloudtay/ripple-documents/tree/main/',
                },
                theme: {
                    customCss: './src/css/custom.css',
                },
            } satisfies Preset.Options,
        ],
    ],

    themeConfig: {
        // Replace with your project's social card
        image: 'img/docusaurus-social-card.jpg',
        navbar: {
            title: '',
            logo: {
                alt: 'ripple',
                src: 'img/logo.png',
            },
            items: [
                {
                    to: 'https://ripple.cloudtay.com',
                    label: 'FAQ',
                    position: 'left',
                    target: '_self'
                },
                {
                    type: 'localeDropdown',
                    position: 'right',
                },
                {
                    href: 'https://github.com/cloudtay/ripple',
                    label: 'Source Code',
                    position: 'right',
                },
            ],
        },
        footer: {
            style: 'dark',
            links: [
                {
                    title: '相关链接',
                    items: [
                        {
                            label: '源代码',
                            to: 'https://github.com/cloudtay/ripple',
                        },
                    ],
                },
            ],
            copyright: `Copyright © ${new Date().getFullYear()} ripple, Inc. Built with Docusaurus.`,
        },
        prism: {
            theme: prismThemes.github,
            darkTheme: prismThemes.dracula,
            additionalLanguages: ['php','bash'],
        },
        metadata: [
            {
                name: 'keywords',
                content: 'ripple,PHP,协程,PHP协程,PHP异步,PHP高并发,PHP高性能,PHP协程引擎,PHP协程框架, coroutine, PHP coroutine, PHP asynchronous, PHP high concurrency, PHP high performance, PHP coroutine engine, PHP coroutine framework',
            },
            {
                name: 'keywords:en',
                content: 'coroutine, PHP coroutine, PHP asynchronous, PHP high concurrency, PHP high performance, PHP coroutine engine, PHP coroutine framework',
            },
            {
                name: 'description',
                content: 'ripple是一个现代化的、高性能的原生PHP协程框架，旨在解决PHP在高并发、复杂网络通信和数据操作方面的挑战。 该框架采用创新的架构和高效的编程模型，为现代 Web 和 Web 应用程序提供强大而灵活的后端支持。 通过使用 ripple，你将体验到从系统全局视图管理任务并高效处理网络流量和数据的优势。',
            },
            {
                name: 'description:en',
                content: 'ripple is a modern, high-performance native PHP coroutine framework designed to solve PHPs challenges in high concurrency, complex network communication and data operations. The framework uses an innovative architecture and efficient programming model to provide powerful and flexible backend support for modern web and web applications. By using ripple, you will experience the advantages of managing tasks from a global view of the system and efficiently handling network traffic and data.',
            }
        ]
    } satisfies Preset.ThemeConfig,

    plugins: [
        [
            require.resolve('@easyops-cn/docusaurus-search-local'),
            {
                hashed: true,
                language: ['zh']
            }
        ]
    ]
};

export default config;
