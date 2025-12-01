import React from 'react'
import { useLanguage } from '../context/LanguageContext'
import './Fixes.css'

const fixes = [
  {
    date: '2025-12-01',
    translations: {
      zh: {
        title: '频繁请求导致后端数据加载失败',
        description: '修复用户快速操作（切换排序、搜索、切换分类等）时，请求过于频繁导致后端数据加载不出来的问题。',
        details: [
          '放宽后端速率限制，从 15 分钟内 100 个请求增加到 500 个请求',
          '首页和搜索页面添加防抖（300ms）和节流（500ms最小间隔）机制',
          'API 请求超时时间从 5 秒增加到 10 秒，给后端更多处理时间',
          '优化 429 速率限制错误的处理，提供更友好的错误提示',
        ],
      },
      en: {
        title: 'Rapid Requests Causing Data Loading Failures',
        description: 'Fixed an issue where rapid user actions (sorting, searching, category switching) caused backend data loading failures due to too many requests.',
        details: [
          'Relaxed backend rate limit from 100 to 500 requests per 15 minutes',
          'Added debounce (300ms) and throttle (500ms min interval) on Home and Search pages',
          'Extended API timeout from 5 to 10 seconds for better backend processing',
          'Improved 429 rate limit error handling with clearer user feedback',
        ],
      },
      ja: {
        title: '頻繁なリクエストによるデータ読み込み失敗',
        description: 'ユーザーが素早く操作（並び替え、検索、カテゴリー切替など）した際、リクエストが多すぎてデータが読み込めなくなる問題を修正しました。',
        details: [
          'バックエンドのレート制限を15分間100リクエストから500リクエストに緩和',
          'ホームと検索ページにデバウンス（300ms）とスロットル（最小間隔500ms）を実装',
          'API リクエストのタイムアウトを5秒から10秒に延長し、バックエンドの処理時間を確保',
          '429 レート制限エラーの処理を改善し、より分かりやすいエラーメッセージを提供',
        ],
      },
    },
  },
  {
    date: '2025-11-13',
    translations: {
      zh: {
        title: '问题修复列表排版统一',
        description: '针对不同屏幕宽度统一卡片间距与内容对齐。',
        details: [
          '列表改用响应式网格，桌面与移动端保持整齐排列',
          '梳理标题、描述、要点之间的行高与留白',
        ],
      },
      en: {
        title: 'Fixes Page Layout Alignment',
        description: 'Standardized spacing and alignment across breakpoints.',
        details: [
          'Responsive grid keeps cards tidy on desktop and mobile',
          'Reworked typography rhythm for headings, copy, and bullets',
        ],
      },
      ja: {
        title: '修正一覧のレイアウト統一',
        description: '画面幅ごとのカード間隔と整列を統一しました。',
        details: [
          'レスポンシブグリッドでデスクトップとモバイルの整列を維持',
          '見出し・本文・箇条書きの行間と余白を調整',
        ],
      },
    },
  },
  {
    date: '2025-11-13',
    translations: {
      zh: {
        title: '夜间模式下修复页和下拉菜单不可见',
        description: '提升夜间主题下卡片及发帖页下拉框的对比度。',
        details: [
          '修复卡片、标签等采用主题变量，暗色下仍清晰',
          '发帖页板块下拉继承正确的文字颜色',
        ],
      },
      en: {
        title: 'Dark Mode Contrast',
        description: 'Improved readability for Fixes cards and post dropdowns.',
        details: [
          'Cards and helper texts use theme-aware tokens',
          'Category dropdown inherits the dark-appropriate color',
        ],
      },
      ja: {
        title: 'ダークモードのコントラスト改善',
        description: '修正カードと投稿ページのドロップダウンを読みやすくしました。',
        details: [
          'カードや補助テキストがテーマカラーを継承',
          'カテゴリー選択の文字色を暗色テーマ用に統一',
        ],
      },
    },
  },
  {
    date: '2025-11-13',
    translations: {
      zh: {
        title: '夜间模式表单文字发灰',
        description: '发帖页输入框和提示文字在夜间模式下更清晰。',
        details: [
          '标题、内容、标签输入统一使用夜间主色/次色',
          '下拉选择器前景色同步更新，避免暗底暗字',
        ],
      },
      en: {
        title: 'Dark Theme Form Contrast',
        description: 'Ensured inputs remain legible in dark mode.',
        details: [
          'Primary/secondary text colors applied to all inputs',
          'Select components adopt the same contrast rules',
        ],
      },
      ja: {
        title: 'ダークテーマのフォーム視認性',
        description: '夜間モードでも入力内容とプレースホルダーが判読できます。',
        details: [
          'タイトル/本文/タグ入力の色をダークテーマ基準に変更',
          'セレクトの前景色も統一し暗背景で読みやすく調整',
        ],
      },
    },
  },
  {
    date: '2025-11-13',
    translations: {
      zh: {
        title: '导航按钮在小屏挤成竖排',
        description: '修复移动端顶部按钮拥挤与换行异常。',
        details: [
          '夜间模式和发布按钮增加外边距控制，防止竖排',
          '中小屏允许按钮换行并居中，极窄屏仅显示图标',
        ],
      },
      en: {
        title: 'Navigation Button Overflow',
        description: 'Prevented header buttons from stacking awkwardly on phones.',
        details: [
          'Added whitespace rules so labels stay horizontal',
          'Buttons wrap and center gracefully; tiny screens show icons only',
        ],
      },
      ja: {
        title: 'ナビゲーションボタンの詰まりを解消',
        description: 'モバイルでボタンが縦並びになる問題を修正しました。',
        details: [
          '夜間モードと投稿ボタンに余白を追加し縦並びを防止',
          '中小画面では自動折り返し＆中央揃え、極小画面はアイコンのみ表示',
        ],
      },
    },
  },
  {
    date: '2025-11-13',
    translations: {
      zh: {
        title: '移动端资料页排版错乱',
        description: '资料页在窄屏设备上重新布局。',
        details: [
          '头像与统计信息支持换行并自动居中',
          '删除按钮位置调整，避免遮挡帖子',
        ],
      },
      en: {
        title: 'Profile Layout on Mobile',
        description: 'Reflowed the profile header and stats for narrow screens.',
        details: [
          'Avatar blocks and stats wrap into stacked rows',
          'Delete action moved to a safe, unobtrusive spot',
        ],
      },
      ja: {
        title: 'プロフィールのモバイルレイアウト',
        description: '狭い画面でプロフィール情報が崩れる問題を修正。',
        details: [
          'アバターと統計情報が折り返し中央揃えで表示されるように調整',
          '削除ボタンの位置を変更して投稿内容を遮らないように改善',
        ],
      },
    },
  },
  {
    date: '2025-11-13',
    translations: {
      zh: {
        title: '搜索结果无法匹配关键词',
        description: '补齐搜索统计缺失的用户表关联。',
        details: [
          '统一列表查询与统计的 JOIN/WHERE 语句',
          '仍支持标题、内容、作者用户名的模糊匹配',
        ],
      },
      en: {
        title: 'Search Counter Join Fix',
        description: 'Search results no longer return empty when users exist.',
        details: [
          'Listing and count queries now share the same JOIN',
          'Title/body/author fuzzy filters stay intact',
        ],
      },
      ja: {
        title: '検索結果が常にゼロになる不具合',
        description: '統計クエリにユーザーテーブルを再結合しました。',
        details: [
          '一覧と件数取得で同じ JOIN/WHERE を使用',
          'タイトル・本文・ユーザー名のあいまい検索を維持',
        ],
      },
    },
  },
  {
    date: '2025-11-13',
    translations: {
      zh: {
        title: '图片跨域策略导致无法显示',
        description: '修复安全策略过严造成的图片加载失败。',
        details: [
          '调整后端安全头，允许跨源资源加载',
          'Nginx 转发路径统一使用带尾斜杠的 proxy_pass',
        ],
      },
      en: {
        title: 'Cross-Origin Images',
        description: 'Relaxed headers so uploaded images load reliably.',
        details: [
          'Set crossOriginResourcePolicy to cross-origin and disabled COEP',
          'Normalized Nginx proxy_pass endings for / and /uploads/',
        ],
      },
      ja: {
        title: '画像のクロスオリジン制限',
        description: 'セキュリティヘッダーの調整で画像が表示されるようになりました。',
        details: [
          'crossOriginResourcePolicy を cross-origin に設定し COEP を無効化',
          'Nginx の proxy_pass を末尾スラッシュ付きに統一',
        ],
      },
    },
  },
  {
    date: '2025-11-13',
    translations: {
      zh: {
        title: '图片地址拼接成 https://uploads/',
        description: '修复生产环境下图片 URL 拼接错误。',
        details: [
          '统一使用后端域名 origin 来拼接图片路径',
          '区分开发代理与生产 API 基址',
        ],
      },
      en: {
        title: 'Broken Image URLs',
        description: 'Fixed production links that started with https://uploads/.',
        details: [
          'Always join image paths with the backend origin',
          'Separated dev proxy logic from production base URLs',
        ],
      },
      ja: {
        title: '画像URLが https://uploads/ になる',
        description: '本番環境での URL 組み立て不具合を修正しました。',
        details: [
          'バックエンドのオリジンを用いて画像パスを結合',
          '開発用プロキシと本番APIベースURLを切り分け',
        ],
      },
    },
  },
  {
    date: '2025-11-12',
    translations: {
      zh: {
        title: '删除帖子后标签仍显示',
        description: '删除帖子会主动刷新标签列表，过滤无帖子标签。',
        details: [
          '删除帖子后分发 postDeleted 事件',
          '右侧栏监听事件并重新拉取标签数据',
        ],
      },
      en: {
        title: 'Stale Tags After Deletion',
        description: 'Tags refresh instantly once a post is removed.',
        details: [
          'Profile deletion emits a postDeleted event',
          'Right sidebar refetches tags and drops zero-count ones',
        ],
      },
      ja: {
        title: '投稿削除後もタグが残る問題',
        description: '投稿を削除するとタグ一覧が自動更新されるようになりました。',
        details: [
          'プロフィールで削除すると postDeleted イベントを発火',
          '右サイドバーが再取得し、0件になったタグを除外',
        ],
      },
    },
  },
]

const pageCopy = {
  zh: {
    title: '问题修复',
    subtitle: '这里记录近期的缺陷修复，便于快速了解背景与处理方式。',
  },
  en: {
    title: 'Fixes',
    subtitle: 'Recent bug fixes with short context and remediation notes.',
  },
  ja: {
    title: '問題修正',
    subtitle: '直近の修正内容と背景を簡潔にまとめています。',
  },
}

const Fixes = () => {
  const { language } = useLanguage()
  const copy = pageCopy[language] || pageCopy.zh

  const localizedFixes = fixes.map((item) => {
    const translation = item.translations[language] || item.translations.zh
    return {
      date: item.date,
      ...translation,
    }
  })

  return (
    <div className="fixes-page">
      <h1 className="fixes-title">{copy.title}</h1>
      <p className="fixes-subtitle">{copy.subtitle}</p>

      <div className="fixes-list">
        {localizedFixes.map((fix) => (
          <article className="fix-card" key={`${fix.date}-${fix.title}`}>
            <div className="fix-header">
              <span className="fix-date">{fix.date}</span>
              <h2 className="fix-name">{fix.title}</h2>
            </div>
            <p className="fix-desc">{fix.description}</p>
            {fix.details?.length > 0 && (
              <ul className="fix-details">
                {fix.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>
    </div>
  )
}

export default Fixes


