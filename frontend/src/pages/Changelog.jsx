import React from 'react'
import { format } from 'date-fns'
import zhCN from 'date-fns/locale/zh-CN'
import enUS from 'date-fns/locale/en-US'
import ja from 'date-fns/locale/ja'
import { useLanguage } from '../context/LanguageContext'
import './Changelog.css'

const changelogCopy = {
  zh: {
    title: '更新日志',
    intro: '这里记录了 REForum 每一次迭代。我们会持续改进社区体验，欢迎关注。',
    footer: '感谢使用 REForum！如有建议，欢迎通过“联系我们”页面反馈。',
  },
  en: {
    title: 'Changelog',
    intro:
      'Every notable change in REForum is documented here. Thanks for following our progress.',
    footer: 'Thanks for being here! Reach out via Contact if you spot issues or have ideas.',
  },
  ja: {
    title: '更新履歴',
    intro: 'REForum のアップデート内容をここにまとめています。これからも改善を続けます。',
    footer: 'いつもご利用ありがとうございます。ご意見は「お問い合わせ」からお寄せください。',
  },
}

const updates = [
  {
    date: '2025-12-02',
    version: '1.5.6',
    translations: {
      zh: {
        title: '板块分类设计简化',
        description: '简化板块分类设计，移除装饰效果，使其与整体设计风格保持一致。',
        features: [
          '移除气泡样式、背景色、边框、阴影等装饰效果',
          '板块分类样式与导航项保持一致，符合整体简洁基调',
          '分类信息改为横向排列，名称和数量在同一行显示',
          '简化交互效果，只保留颜色变化和左侧指示条',
          '优化颜色点尺寸，移除阴影和缩放动画',
        ],
      },
      en: {
        title: 'Category Design Simplification',
        description: 'Simplified category design, removed decorative effects to match overall design style.',
        features: [
          'Removed bubble style, background color, borders, shadows and other decorative effects',
          'Category styles consistent with navigation items, matching overall clean design',
          'Category information changed to horizontal layout with name and count on same line',
          'Simplified interaction effects, only color change and left indicator bar',
          'Optimized color dot size, removed shadows and scale animations',
        ],
      },
      ja: {
        title: 'カテゴリデザインの簡素化',
        description: 'カテゴリデザインを簡素化し、装飾効果を削除して全体的なデザインスタイルと一致させました。',
        features: [
          'バブルスタイル、背景色、ボーダー、シャドウなどの装飾効果を削除',
          'カテゴリスタイルをナビゲーション項目と一致させ、全体的なシンプルなデザインに合わせる',
          'カテゴリ情報を横向きレイアウトに変更し、名前と数を同じ行に表示',
          'インタラクション効果を簡素化し、色の変化と左側のインジケーターバーのみ',
          'カラードットのサイズを最適化し、シャドウとスケールアニメーションを削除',
        ],
      },
    },
  },
  {
    date: '2025-12-02',
    version: '1.5.5',
    translations: {
      zh: {
        title: '标签物理引擎系统重构',
        description: '使用Matter.js物理引擎实现标签的真实物理效果，标签从上方掉落并具有真实的物理属性。',
        features: [
          '集成Matter.js物理引擎，实现真实的物理模拟（重力、碰撞、摩擦、弹性）',
          '标签从容器上方掉落，受重力影响自然下落并堆叠',
          '支持鼠标和触摸拖拽标签，标签之间会发生真实碰撞',
          '简化标签样式，移除色块和装饰，改为简洁的纯文字样式',
          '减小标签占地面积，提高标签密度',
          '在移动端正常显示，不影响其他内容布局',
          '容器样式与整体页面样式统一，使用主题变量',
        ],
      },
      en: {
        title: 'Tag Physics Engine System Refactor',
        description: 'Implemented real physics effects for tags using Matter.js physics engine, tags fall from top with real physical properties.',
        features: [
          'Integrated Matter.js physics engine for real physics simulation (gravity, collision, friction, restitution)',
          'Tags fall from top of container, naturally drop and stack under gravity',
          'Support mouse and touch drag for tags with real collision detection',
          'Simplified tag styles, removed color blocks and decorations, using clean text-only style',
          'Reduced tag footprint, increased tag density',
          'Properly displayed on mobile devices without affecting other content layout',
          'Container styles unified with overall page styles using theme variables',
        ],
      },
      ja: {
        title: 'タグ物理エンジンシステムのリファクタリング',
        description: 'Matter.js物理エンジンを使用してタグのリアルな物理効果を実装し、タグが上から落下し、リアルな物理属性を持ちます。',
        features: [
          'Matter.js物理エンジンを統合し、リアルな物理シミュレーション（重力、衝突、摩擦、弾性）を実現',
          'タグがコンテナの上から落下し、重力の影響で自然に落下して積み重なる',
          'マウスとタッチでタグをドラッグ可能で、タグ間でリアルな衝突が発生',
          'タグスタイルを簡素化し、色ブロックと装飾を削除し、シンプルなテキストのみのスタイルに変更',
          'タグの占有面積を削減し、タグ密度を向上',
          'モバイルデバイスで正常に表示され、他のコンテンツレイアウトに影響しない',
          'コンテナスタイルを全体ページスタイルと統一し、テーマ変数を使用',
        ],
      },
    },
  },
  {
    date: '2025-12-02',
    version: '1.5.4',
    translations: {
      zh: {
        title: 'Header左右边距对称修复',
        description: '修复Header中左侧Logo与左侧边缘的距离和右侧按钮组合与右侧边缘的距离不一致的历史遗留问题。',
        features: [
          '使用 minmax(0, 1fr) 确保Grid布局中左右列严格等宽',
          '移除Logo和按钮组合的额外margin和padding，确保紧贴边缘',
          '添加 width: fit-content 确保元素紧贴各自列的边缘',
          '在所有响应式断点下保持左右对称',
          '这是一个历史遗留问题，多个版本更新迭代都未修复，本次彻底解决',
        ],
      },
      en: {
        title: 'Header Left-Right Margin Symmetry Fix',
        description: 'Fixed historical issue where the distance from left logo to left edge and right button group to right edge were inconsistent.',
        features: [
          'Used minmax(0, 1fr) to ensure strict equal width for left and right columns in Grid layout',
          'Removed extra margin and padding from logo and button group to ensure they align to edges',
          'Added width: fit-content to ensure elements align to their column edges',
          'Maintained left-right symmetry at all responsive breakpoints',
          'This was a historical issue that persisted through multiple version updates, now completely resolved',
        ],
      },
      ja: {
        title: 'ヘッダーの左右マージン対称性の修正',
        description: '左側のロゴと左端の距離、右側のボタングループと右端の距離が一致しない歴史的な問題を修正しました。',
        features: [
          'minmax(0, 1fr) を使用してGridレイアウトで左右の列の幅を厳密に等しく設定',
          'ロゴとボタングループの余分なマージンとパディングを削除し、端に揃えるように調整',
          'width: fit-content を追加して要素が各列の端に揃うように設定',
          'すべてのレスポンシブブレークポイントで左右対称を維持',
          'これは複数のバージョン更新を経ても修正されなかった歴史的な問題でしたが、今回完全に解決しました',
        ],
      },
    },
  },
  {
    date: '2025-12-02',
    version: '1.5.3',
    translations: {
      zh: {
        title: '响应式Header布局优化',
        description: '修复语言切换按钮移到右上角后，在响应式设备上出现的按钮排版错乱问题。',
        features: [
          '优化992px、768px、576px、480px断点的按钮布局和间距',
          '确保按钮在所有断点下都能正确换行和排列，不会重叠或溢出',
          '统一图标按钮和文字按钮的尺寸，保持视觉一致性',
          '优化语言菜单在小屏幕上的定位，确保不会超出视口',
          '改进搜索框在超小屏幕上的显示效果',
        ],
      },
      en: {
        title: 'Responsive Header Layout Optimization',
        description: 'Fixed button layout issues on responsive devices after moving language switcher to top-right corner.',
        features: [
          'Optimized button layout and spacing for 992px, 768px, 576px, and 480px breakpoints',
          'Ensured buttons wrap correctly and align properly at all breakpoints without overlapping or overflow',
          'Unified icon button and text button sizes for visual consistency',
          'Optimized language menu positioning on small screens to prevent viewport overflow',
          'Improved search box display on extra small screens',
        ],
      },
      ja: {
        title: 'レスポンシブヘッダーレイアウトの最適化',
        description: '言語切替ボタンを右上に移動した後、レスポンシブデバイスで発生したボタンのレイアウト問題を修正しました。',
        features: [
          '992px、768px、576px、480pxのブレークポイントでボタンレイアウトと余白を最適化',
          'すべてのブレークポイントでボタンが正しく折り返し、整列し、重なりやオーバーフローが発生しないように調整',
          '視覚的一貫性のため、アイコンボタンとテキストボタンのサイズを統一',
          '小画面での言語メニューの位置を最適化し、ビューポートを超えないように調整',
          '超小画面での検索ボックスの表示を改善',
        ],
      },
    },
  },
  {
    date: '2025-12-02',
    version: '1.5.2',
    translations: {
      zh: {
        title: '标签位置缓存优化',
        description: '修复路由切换时标签位置和动画参数被重置的问题，提升用户体验。',
        features: [
          '使用 useMemo 和 useRef 缓存标签位置，仅在标签数据真正改变时重新生成',
          '动画参数（持续时间、延迟、方向）持久化，避免每次渲染都重新生成',
          '标签签名机制确保相同标签数据使用相同位置',
          '切换页面时标签保持连续浮动，不会中断或重置',
        ],
      },
      en: {
        title: 'Tag Position Cache Optimization',
        description: 'Fixed issue where tag positions and animation parameters were reset on route changes, improving user experience.',
        features: [
          'Used useMemo and useRef to cache tag positions, regenerating only when tag data actually changes',
          'Animation parameters (duration, delay, direction) persist across renders',
          'Tag signature mechanism ensures same tag data uses same positions',
          'Tags maintain continuous floating animation when switching pages without interruption',
        ],
      },
      ja: {
        title: 'タグ位置キャッシュ最適化',
        description: 'ルート切替時にタグ位置とアニメーションパラメータがリセットされる問題を修正し、ユーザー体験を向上させました。',
        features: [
          'useMemo と useRef を使用してタグ位置をキャッシュし、タグデータが実際に変更された場合のみ再生成',
          'アニメーションパラメータ（継続時間、遅延、方向）を永続化し、毎回のレンダリングで再生成を防止',
          'タグ署名メカニズムにより、同じタグデータは同じ位置を使用',
          'ページ切替時もタグが連続的に浮遊し、中断やリセットが発生しない',
        ],
      },
    },
  },
  {
    date: '2025-12-02',
    version: '1.5.1',
    translations: {
      zh: {
        title: '标签区域随机布局优化',
        description: '标签区域改为随机错落分布，带来更自然生动的视觉效果。',
        features: [
          '标签从规则滚动改为随机错落分布，每个标签根据发帖数量重复显示',
          '移除标签数字显示和井号前缀，界面更简洁',
          '隐藏右侧边栏滚动条，保持界面整洁',
          '鼠标悬停时标签继续浮动，不会暂停动画',
          '使用防重叠算法确保标签之间保持间距，不会相互覆盖',
        ],
      },
      en: {
        title: 'Tag Area Random Layout Optimization',
        description: 'Tags area redesigned with random scattered distribution for a more natural and dynamic visual effect.',
        features: [
          'Tags changed from regular scrolling to random scattered distribution, each tag repeats based on post count',
          'Removed tag numbers and hash prefix for cleaner interface',
          'Hidden scrollbar in right sidebar for cleaner appearance',
          'Tags continue floating on hover without pausing animation',
          'Collision detection algorithm ensures tags maintain spacing without overlapping',
        ],
      },
      ja: {
        title: 'タグエリアのランダムレイアウト最適化',
        description: 'タグエリアをランダムに散らばった配置に変更し、より自然で動的な視覚効果を実現しました。',
        features: [
          'タグを規則的なスクロールからランダム配置に変更、投稿数に応じて各タグを繰り返し表示',
          'タグの数字表示とハッシュプレフィックスを削除し、よりシンプルなインターフェースに',
          '右サイドバーのスクロールバーを非表示にし、よりクリーンな見た目に',
          'ホバー時もタグが浮遊し続け、アニメーションが一時停止しない',
          '衝突検出アルゴリズムでタグ間の間隔を確保し、重なりを防止',
        ],
      },
    },
  },
  {
    date: '2025-12-02',
    version: '1.5.0',
    translations: {
      zh: {
        title: 'UI 更新- 动态标签与气泡分类',
        description: '标签区域改为多行错开滚动，分类区域改为气泡浮动效果，带来更生动有趣的视觉体验。',
        features: [
          '标签区域改为多行错开滚动，标签持续循环滚动展示，每个标签根据发帖数量重复显示',
          '分类区域改为气泡浮动效果，每个分类独立浮动动画，位置错落有致',
          '标签滚动支持鼠标悬停暂停，方便查看标签内容',
          '分类气泡采用渐变背景容器，标签显示发帖数量，视觉效果更佳',
          '优化响应式设计，移动端自动切换为静态布局',
          '增强交互效果，悬停时标签变色、气泡放大',
        ],
      },
      en: {
        title: 'UI Update - Dynamic Tags & Floating Categories',
        description: 'Tags area redesigned with multi-row staggered scrolling, categories area redesigned as floating bubbles for a more dynamic visual experience.',
        features: [
          'Tags area changed to multi-row staggered scrolling with continuous loop animation, each tag repeats based on post count',
          'Categories area redesigned as floating bubbles with independent animations and scattered positions',
          'Tag scrolling pauses on hover for better readability',
          'Category bubbles use gradient background container, tags display post count for enhanced visuals',
          'Optimized responsive design, automatically switches to static layout on mobile',
          'Enhanced hover effects with color changes and scale animations',
        ],
      },
      ja: {
        title: 'UI 更新 - 動的タグとフローティングカテゴリー',
        description: 'タグエリアを複数行のずらしたスクロールに変更、カテゴリーエリアをフローティングバブルに変更し、より動的で魅力的な視覚体験を提供します。',
        features: [
          'タグエリアを複数行のずらしたスクロールに変更、連続ループアニメーション、投稿数に応じて各タグを繰り返し表示',
          'カテゴリーエリアをフローティングバブルに変更、独立したアニメーションと散らばった配置',
          'タグスクロールはホバーで一時停止、閲覧性向上',
          'カテゴリーバブルはグラデーション背景コンテナを使用、タグは投稿数を表示、視覚効果向上',
          'レスポンシブデザインを最適化、モバイルで自動的に静的レイアウトに切り替え',
          'ホバー時の色変更とスケールアニメーションでインタラクション強化',
        ],
      },
    },
  },
  {
    date: '2025-12-02',
    version: '1.4.1',
    translations: {
      zh: {
        title: '移动端通知显示优化',
        description: '修复移动设备上通知下拉菜单显示不全的问题。',
        features: [
          '通知下拉菜单在移动端使用固定定位，确保完全显示',
          '优化小屏幕上的通知列表布局和文字大小',
          '调整通知项的内边距和间距，提升可读性',
          '改进通知菜单的最大高度计算，避免被截断',
        ],
      },
      en: {
        title: 'Mobile Notification Display Fix',
        description: 'Fixed notification dropdown display issues on mobile devices.',
        features: [
          'Notification dropdown uses fixed positioning on mobile for full visibility',
          'Optimized notification list layout and text sizes on small screens',
          'Adjusted notification item padding and spacing for better readability',
          'Improved max-height calculation to prevent truncation',
        ],
      },
      ja: {
        title: 'モバイル通知表示の最適化',
        description: 'モバイルデバイスで通知ドロップダウンが完全に表示されない問題を修正しました。',
        features: [
          'モバイルで通知ドロップダウンを固定配置に変更し、完全表示を確保',
          '小画面での通知リストのレイアウトと文字サイズを最適化',
          '通知項目の余白と間隔を調整し、可読性を向上',
          '最大高さの計算を改善し、切り詰めを防止',
        ],
      },
    },
  },
  {
    date: '2025-12-02',
    version: '1.4.0',
    translations: {
      zh: {
        title: 'Inbox 通知功能',
        description: '新增右上角通知系统，实时接收新帖子通知。',
        features: [
          '右上角添加通知图标，显示未读数量徽章',
          '点击查看通知列表，包含发帖人和帖子标题',
          '支持标记单个或全部通知为已读',
          '自动轮询更新未读数量（每30秒）',
          '点击通知可直接跳转到对应帖子',
        ],
      },
      en: {
        title: 'Inbox Notifications',
        description: 'Added notification system in the top-right corner to receive real-time new post notifications.',
        features: [
          'Notification icon in top-right corner with unread badge',
          'Click to view notification list with author and post title',
          'Support marking individual or all notifications as read',
          'Auto-polling updates unread count every 30 seconds',
          'Click notification to jump directly to the related post',
        ],
      },
      ja: {
        title: 'Inbox 通知機能',
        description: '右上に通知システムを追加し、新しい投稿の通知をリアルタイムで受信できます。',
        features: [
          '右上に通知アイコンを追加、未読数のバッジを表示',
          'クリックで通知一覧を表示、投稿者と投稿タイトルを含む',
          '個別またはすべての通知を既読にする機能',
          '未読数を30秒ごとに自動更新',
          '通知をクリックして関連投稿に直接ジャンプ',
        ],
      },
    },
  },
  {
    date: '2025-12-01',
    version: '1.3.2',
    translations: {
      zh: {
        title: '响应式布局优化',
        description: '全面优化移动端和小屏幕设备的显示效果，提升用户体验。',
        features: [
          '优化帖子详情页标题和内容在小屏幕上的显示',
          '改进首页和帖子卡片在移动端的布局和间距',
          '调整错误状态提示的响应式样式',
          '优化按钮和操作元素在窄屏上的排列',
        ],
      },
      en: {
        title: 'Responsive Layout Improvements',
        description: 'Comprehensive mobile and small-screen optimizations for better user experience.',
        features: [
          'Optimized post detail page titles and content on small screens',
          'Improved layout and spacing for home page and post cards on mobile',
          'Adjusted responsive styles for error state messages',
          'Enhanced button and action element arrangement on narrow screens',
        ],
      },
      ja: {
        title: 'レスポンシブレイアウトの最適化',
        description: 'モバイルと小画面デバイスでの表示を全面的に改善しました。',
        features: [
          '投稿詳細ページのタイトルとコンテンツを小画面で最適化',
          'ホームページと投稿カードのモバイルレイアウトと余白を改善',
          'エラー状態メッセージのレスポンシブスタイルを調整',
          '狭い画面でのボタンと操作要素の配置を最適化',
        ],
      },
    },
  },
  {
    date: '2025-12-01',
    version: '1.3.1',
    translations: {
      zh: {
        title: '请求间隔优化与速率限制调整',
        description: '放宽后端速率限制，添加前端防抖与节流机制，解决频繁请求导致的数据加载失败问题。',
        features: [
          '后端速率限制从 15 分钟内 100 个请求提升到 500 个请求',
          '首页和搜索页面添加防抖（300ms）和节流（500ms最小间隔）机制',
          'API 请求超时时间从 5 秒增加到 10 秒，给后端更多处理时间',
          '优化 429 速率限制错误的处理，提供更友好的错误提示',
        ],
      },
      en: {
        title: 'Request Throttling & Rate Limit Adjustments',
        description:
          'Relaxed backend rate limits and added frontend debouncing/throttling to prevent data loading failures from rapid requests.',
        features: [
          'Backend rate limit increased from 100 to 500 requests per 15 minutes',
          'Added debounce (300ms) and throttle (500ms min interval) on Home and Search pages',
          'API timeout extended from 5 to 10 seconds for better backend processing',
          'Improved 429 rate limit error handling with clearer user feedback',
        ],
      },
      ja: {
        title: 'リクエスト間隔の最適化とレート制限の調整',
        description:
          'バックエンドのレート制限を緩和し、フロントエンドにデバウンス/スロットルを追加して、頻繁なリクエストによるデータ読み込み失敗を解決しました。',
        features: [
          'バックエンドのレート制限を15分間100リクエストから500リクエストに引き上げ',
          'ホームと検索ページにデバウンス（300ms）とスロットル（最小間隔500ms）を実装',
          'API リクエストのタイムアウトを5秒から10秒に延長し、バックエンドの処理時間を確保',
          '429 レート制限エラーの処理を改善し、より分かりやすいエラーメッセージを提供',
        ],
      },
    },
  },
  {
    date: '2025-12-01',
    version: '1.3.0',
    translations: {
      zh: {
        title: '多语言界面与语言切换器',
        description: '新增底部语言按钮，全站 UI 文案支持中文/英文/日文切换（帖子正文除外）。',
        features: [
          '左下角悬浮语言按钮支持点击或悬停展开，带有动态动画并记住选择',
          '导航、侧栏、搜索、发帖等界面文案同步切换语言',
          '用户协议、隐私政策、更新日志、问题修复页面提供三语内容',
        ],
      },
      en: {
        title: 'Multilingual UI & Language Switcher',
        description:
          'Introduced a floating language button so the entire UI (except user posts) is available in Chinese, English, and Japanese.',
        features: [
          'Bottom-left switcher opens with hover/click animation and remembers your preference',
          'Navigation, search, posting, and dialogs now translate instantly',
          'Legal pages and changelog/fixes sections ship with full trilingual content',
        ],
      },
      ja: {
        title: '多言語 UI とランゲージスイッチャー',
        description:
          '左下のボタンから UI 表示を中国語・英語・日本語に切り替えられるようになりました（投稿本文を除く）。',
        features: [
          'ホバー/クリックで展開する円形ボタンが選択した言語を記憶',
          'ナビゲーションや投稿フォームなどの文言が即時に切り替わる',
          '利用規約・プライバシー・更新履歴・修正一覧も三言語対応',
        ],
      },
    },
  },
  {
    date: '2025-11-13',
    version: '1.2.5',
    translations: {
      zh: {
        title: '问题修复页排版统一',
        description: '针对不同屏幕统一问题修复页面的卡片布局。',
        features: [
          '采用响应式网格，保证桌面与移动端间距一致',
          '规范标题、正文、要点的行高与留白',
          '移除冗余描述，让卡片聚焦修复内容',
        ],
      },
      en: {
        title: 'Fixes Page Layout Refresh',
        description: 'Normalized the Fixes page cards so they read well on any device.',
        features: [
          'Responsive grid keeps spacing consistent between desktop and mobile',
          'Unified typography scale for titles, body text, and bullet lists',
          'Removed noisy “impact” paragraphs to highlight the actual fix',
        ],
      },
      ja: {
        title: '修正一覧ページのレイアウト統一',
        description: 'デバイスに依存しない読みやすいカード配置に調整しました。',
        features: [
          'レスポンシブグリッドでデスクトップとモバイルの余白を統一',
          'タイトルや本文、箇条書きの行間を再設計',
          '冗長な説明を削除し、修正内容そのものを強調',
        ],
      },
    },
  },
  {
    date: '2025-11-13',
    version: '1.2.4',
    translations: {
      zh: {
        title: '夜间模式卡片与下拉可读性修复',
        description: '夜间主题下的问题修复页面与发帖页下拉选择器可读性增强。',
        features: [
          '卡片、日期条、备注等组件继承主题变量，保证对比度',
          '发帖页板块下拉选项统一字体颜色，深色背景仍清晰',
        ],
      },
      en: {
        title: 'Dark Mode Readability Fix',
        description: 'Improved contrast for Fixes cards and the create-post dropdown in dark mode.',
        features: [
          'Cards, badges, and helper texts now use theme-aware tokens',
          'Category dropdown inherits the correct foreground color in dark mode',
        ],
      },
      ja: {
        title: 'ダークモードでの視認性改善',
        description: '修正ページと投稿ページのドロップダウンを暗色テーマに最適化しました。',
        features: [
          'カードや日付ラベルがテーマカラーを継承し十分なコントラストを確保',
          'カテゴリー選択の文字色を統一し、暗背景でも読みやすく調整',
        ],
      },
    },
  },
  {
    date: '2025-11-13',
    version: '1.2.3',
    translations: {
      zh: {
        title: '夜间模式表单可读性优化',
        description: '发帖页在深色模式下的输入体验更清晰。',
        features: [
          '输入框、下拉框文字切换为夜间主题主色',
          '占位提示采用次级文本色，提示信息不再模糊',
          '统一表单控件的响应式样式',
        ],
      },
      en: {
        title: 'Dark Theme Form Polish',
        description: 'Posting forms now stay legible under the dark palette.',
        features: [
          'Inputs and selects adopt primary foreground colors in dark mode',
          'Placeholder text uses the secondary tone for better contrast',
          'Responsive styles synced between light/dark themes',
        ],
      },
      ja: {
        title: 'ダークテーマのフォーム改善',
        description: '暗色モードでも投稿フォームの文字が読みやすくなりました。',
        features: [
          '入力欄とセレクト欄の文字色をダークテーマ用に最適化',
          'プレースホルダーを副次テキスト色に変更し視認性を確保',
          'フォーム全体のレスポンシブ挙動を統一',
        ],
      },
    },
  },
  {
    date: '2025-11-13',
    version: '1.2.2',
    translations: {
      zh: {
        title: '导航按钮响应式修复',
        description: '移动端顶部导航的拥挤问题得到解决。',
        features: [
          '按钮在中小屏可自动换行并保持居中',
          '夜间模式按钮在窄屏仅显示图标节省空间',
          '576px 以下自动收窄但保留搜索入口',
        ],
      },
      en: {
        title: 'Responsive Nav Buttons',
        description: 'Fixed cramped top navigation on phones.',
        features: [
          'Buttons wrap gracefully and stay centered on small screens',
          'Night-mode toggle collapses into an icon when space is tight',
          'Search entry remains reachable even under 576px width',
        ],
      },
      ja: {
        title: 'ナビゲーションボタンのレスポンシブ対応',
        description: 'モバイルでボタンが詰まる問題を解消しました。',
        features: [
          '中小画面でボタンが自動的に折り返し中央揃えに',
          'ダークモード切替は幅が狭い時にアイコン表示へ移行',
          '幅576px未満でも検索入力をキープ',
        ],
      },
    },
  },
  {
    date: '2025-11-13',
    version: '1.2.1',
    translations: {
      zh: {
        title: '资料页移动端布局优化',
        description: '用户资料页在窄屏下更加整洁。',
        features: [
          '头部信息在小屏自动堆叠并居中',
          '统计信息支持换行排列，避免拥挤',
          '删除按钮位置微调，不遮挡内容',
        ],
      },
      en: {
        title: 'Profile Layout Tune-Up',
        description: 'User profiles now scale nicely on narrow devices.',
        features: [
          'Header info stacks and centers on mobile',
          'Stats cards wrap into new rows instead of cramping',
          'Delete buttons repositioned to avoid covering posts',
        ],
      },
      ja: {
        title: 'プロフィールページのモバイル最適化',
        description: '狭い画面でもプロフィール情報が整って表示されます。',
        features: [
          'ヘッダー情報が自動で縦並び＆中央揃えに',
          '統計カードが折り返し表示され、圧迫感を解消',
          '削除ボタンの位置を調整し、投稿内容を遮らないように改善',
        ],
      },
    },
  },
  {
    date: '2025-11-13',
    version: '1.2.0',
    translations: {
      zh: {
        title: '一键夜间模式',
        description: '支持在顶部快速切换夜间/日间主题。',
        features: [
          '新增夜间模式按钮并记住最近一次选择',
          '夜间模式同步优化背景、文字、卡片对比度',
          '未登录用户也能享受相同体验',
        ],
      },
      en: {
        title: 'One-Tap Dark Mode',
        description: 'Added a dedicated dark-mode toggle next to the publish button.',
        features: [
          'Remembers your last choice and applies it globally',
          'Adjusted background, text, and cards for better nighttime contrast',
          'Works for signed-out visitors as well',
        ],
      },
      ja: {
        title: 'ワンタップのダークモード',
        description: '投稿ボタン横にテーマ切替スイッチを追加しました。',
        features: [
          '前回の選択を記憶し、全ページに適用',
          '夜間向けに背景・文字・カードのコントラストを再調整',
          '未ログイン状態でも同じ体験を提供',
        ],
      },
    },
  },
  {
    date: '2025-11-13',
    version: '1.1.1',
    translations: {
      zh: {
        title: '搜索结果命中率修复',
        description: '修复搜索统计缺少关联导致的空结果问题。',
        features: [
          '统一列表查询与统计用的 JOIN 语句',
          '维持标题/内容/作者用户名模糊匹配',
        ],
      },
      en: {
        title: 'Search Accuracy Fix',
        description: 'Resolved an issue where the search counter ignored author joins.',
        features: [
          'The same JOIN chain now powers both listing and counting',
          'Kept fuzzy matching for title, body, and author name',
        ],
      },
      ja: {
        title: '検索ヒット率の修正',
        description: '検索結果が常にゼロになる不具合を修正しました。',
        features: [
          '一覧取得と件数取得で同じ JOIN 条件を使用',
          'タイトル/本文/ユーザー名のあいまい検索を維持',
        ],
      },
    },
  },
  {
    date: '2025-11-13',
    version: '1.1.0',
    translations: {
      zh: {
        title: '新增「问题修复」栏目',
        description: '在侧栏加入问题修复入口，集中展示近期缺陷修复。',
        features: [
          '为每项修复提供背景与影响范围',
          '首批收录图片地址异常、删除帖子后标签不刷新等问题',
        ],
      },
      en: {
        title: 'Fixes Section',
        description: 'Added a “Fixes” entry to the sidebar to collect bug summaries.',
        features: [
          'Each fix documents the context and scope',
          'First batch covers image URL issues and stale tags after deletions',
        ],
      },
      ja: {
        title: '「問題修正」セクションを追加',
        description: 'サイドバーに最近の修正一覧へのリンクを設置しました。',
        features: [
          '各修正に背景と影響範囲を明記',
          '画像URL異常や削除後にタグが残る問題などを収録',
        ],
      },
    },
  },
  {
    date: '2025-11-12',
    version: '1.0.0',
    translations: {
      zh: {
        title: '搜索功能上线',
        description: '可以通过搜索框快速找到感兴趣的帖子。',
        features: [
          '支持按标题、内容、作者用户名搜索',
          '搜索页显示匹配数量并支持分页',
          '提供“最新 / 热门”排序',
        ],
      },
      en: {
        title: 'Search Released',
        description: 'You can now discover posts via the global search bar.',
        features: [
          'Search by title, body, or author handle',
          'Result page shows total counts and supports pagination',
          'Sort results by latest or hottest',
        ],
      },
      ja: {
        title: '検索機能を公開',
        description: '気になる投稿を検索バーからすぐ探せるようになりました。',
        features: [
          'タイトル・本文・ユーザー名で検索可能',
          '検索結果の総件数表示とページネーションに対応',
          '「最新順」「人気順」で並べ替え可能',
        ],
      },
    },
  },
  {
    date: '2025-11-12',
    version: '0.9.0',
    translations: {
      zh: {
        title: '图片上传功能',
        description: '发帖时可以上传最多 10 张图片，支持拖拽与预览。',
        features: [
          '拖拽或选择文件上传，实时预览',
          '支持 JPEG / PNG / GIF / WebP，单张 5MB 内',
          '上传后可移除不需要的图片',
        ],
      },
      en: {
        title: 'Image Uploads',
        description: 'Posts can now include up to ten images with drag-and-drop support.',
        features: [
          'Instant preview while selecting or dragging files',
          'Accepts JPEG, PNG, GIF, WebP up to 5 MB each',
          'Remove uploaded images before publishing',
        ],
      },
      ja: {
        title: '画像アップロード機能',
        description: '投稿時に最大10枚の画像を添付できるようになりました。',
        features: [
          'ドラッグ＆ドロップと即時プレビューに対応',
          'JPEG/PNG/GIF/WebP（各5MBまで）をサポート',
          '不要になった画像はアップロード後でも削除可能',
        ],
      },
    },
  },
  {
    date: '2025-11-12',
    version: '0.8.0',
    translations: {
      zh: {
        title: '帖子点赞功能',
        description: '支持点赞与取消点赞帖子。',
        features: [
          '实时显示点赞数量',
          '已点赞帖子显示红色心形图标',
          '阻止重复点赞请求',
        ],
      },
      en: {
        title: 'Post Likes',
        description: 'Cheer on your favorite posts with a tap.',
        features: [
          'Realtime like counts with optimistic updates',
          'Loved posts display a filled red heart',
          'Server guards against accidental double taps',
        ],
      },
      ja: {
        title: '投稿への「いいね」機能',
        description: '気に入った投稿にワンタップで反応できます。',
        features: [
          'いいね数がリアルタイムに更新',
          'いいね済みは赤いハートで表示',
          '連続タップしても重複登録されないよう制御',
        ],
      },
    },
  },
  {
    date: '2025-11-12',
    version: '0.7.0',
    translations: {
      zh: {
        title: '帖子管理功能',
        description: '在个人主页可以删除自己发布的帖子。',
        features: [
          '删除前弹出确认对话框',
          '删除后自动刷新帖子统计',
          '更安全的操作体验',
        ],
      },
      en: {
        title: 'Post Management',
        description: 'Creators can now delete their own posts from the profile page.',
        features: [
          'Confirmation dialog prevents mistakes',
          'Statistics refresh immediately after deletion',
          'Improved safety around destructive actions',
        ],
      },
      ja: {
        title: '投稿管理機能',
        description: 'プロフィールから自分の投稿を削除できるようになりました。',
        features: [
          '削除前に確認ダイアログを表示',
          '削除後は統計情報を即時更新',
          '誤操作を防ぐための保護を追加',
        ],
      },
    },
  },
  {
    date: '2025-11-12',
    version: '0.6.0',
    translations: {
      zh: {
        title: '邮箱验证注册',
        description: '注册流程增加邮箱验证码，防止恶意注册。',
        features: [
          '验证码有效期 5 分钟，60 秒内限一次发送',
          '注册前必须完成邮箱验证',
        ],
      },
      en: {
        title: 'Email Verification',
        description: 'Sign-up now requires a short-lived verification code.',
        features: [
          'Codes expire after 5 minutes and throttle to 1 per 60 seconds',
          'Prevents automated/abusive registrations',
        ],
      },
      ja: {
        title: 'メール認証付き登録',
        description: '登録時にワンタイムコードを入力する方式に変更しました。',
        features: [
          'コードの有効期限は5分、再送は60秒ごとに制限',
          '不正登録を抑制するための仕組み',
        ],
      },
    },
  },
  {
    date: '2025-11-12',
    version: '0.5.0',
    translations: {
      zh: {
        title: '界面优化',
        description: '启用全新的现代化界面与动画。',
        features: [
          '升级字体与间距，提升可读性',
          '响应式布局覆盖主要页面',
          '交互动画更顺滑',
        ],
      },
      en: {
        title: 'UI Refresh',
        description: 'Rolled out a modern visual system with smoother motion.',
        features: [
          'Typography and spacing tuned for readability',
          'Responsive layouts applied to all key pages',
          'Polished interaction animations',
        ],
      },
      ja: {
        title: 'UI の刷新',
        description: 'モダンなビジュアルとアニメーションに一新しました。',
        features: [
          'フォントと余白を再設計し読みやすさを向上',
          '主要ページをレスポンシブ対応',
          'アニメーションを滑らかに調整',
        ],
      },
    },
  },
  {
    date: '2025-11-12',
    version: '0.4.0',
    translations: {
      zh: {
        title: '浏览统计优化',
        description: '更准确地统计帖子浏览量。',
        features: [
          '同一用户或 IP 24 小时只记一次',
          '防止刷量，数据更真实',
        ],
      },
      en: {
        title: 'View Counter Accuracy',
        description: 'Page views now represent unique visitors per 24 hours.',
        features: [
          'Same user/IP counts once per day',
          'Protects against artificial inflation',
        ],
      },
      ja: {
        title: '閲覧数の精度向上',
        description: '投稿の閲覧数をより正確に計測します。',
        features: [
          '同一ユーザー/同一IPは24時間に1回だけカウント',
          '不正な水増しを防ぎ、実態に近い数値を表示',
        ],
      },
    },
  },
  {
    date: '2025-11-12',
    version: '0.3.0',
    translations: {
      zh: {
        title: '用户协议 & 隐私政策',
        description: '补齐法务条款，保障用户权利。',
        features: [
          '上线用户协议与隐私政策页面',
          '注册流程需同意条款',
        ],
      },
      en: {
        title: 'Terms & Privacy',
        description: 'Published the legal docs that govern REForum.',
        features: [
          'Dedicated Terms of Service and Privacy Policy pages',
          'Sign-up flow requires explicit consent',
        ],
      },
      ja: {
        title: '利用規約とプライバシーポリシー',
        description: 'ユーザー保護のための規約ページを整備しました。',
        features: [
          '利用規約とプライバシーポリシーを公開',
          '登録時に同意が必須に',
        ],
      },
    },
  },
]

const formatLocale = {
  zh: zhCN,
  en: enUS,
  ja,
}

const formatPattern = {
  zh: 'yyyy年MM月dd日',
  en: 'MMM dd, yyyy',
  ja: 'yyyy年MM月dd日',
}

const Changelog = () => {
  const { language } = useLanguage()
  const copy = changelogCopy[language] || changelogCopy.zh
  const locale = formatLocale[language] || zhCN
  const datePattern = formatPattern[language] || formatPattern.zh

  const localizedUpdates = updates.map((entry) => {
    const translation = entry.translations[language] || entry.translations.zh
    return {
      date: entry.date,
      version: entry.version,
      ...translation,
    }
  })

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), datePattern, { locale })
    } catch {
      return dateString
    }
  }

  return (
    <div className="changelog-page">
      <div className="changelog-header">
        <h1>{copy.title}</h1>
        <p className="changelog-intro">{copy.intro}</p>
      </div>

      <div className="changelog-list">
        {localizedUpdates.map((update) => (
          <div key={`${update.version}-${update.date}`} className="changelog-item">
            <div className="changelog-item-header">
              <div className="changelog-item-title-section">
                <h2 className="changelog-item-title">{update.title}</h2>
                <span className="changelog-item-version">v{update.version}</span>
              </div>
              <span className="changelog-item-date">{formatDate(update.date)}</span>
            </div>
            <p className="changelog-item-description">{update.description}</p>
            <ul className="changelog-item-features">
              {update.features.map((feature, featureIndex) => (
                <li key={featureIndex}>{feature}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="changelog-footer">
        <p>{copy.footer}</p>
      </div>
    </div>
  )
}

export default Changelog

