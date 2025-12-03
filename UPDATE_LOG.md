# REForum 更新日志

## 更新内容总览

本文档记录了 REForum 论坛系统的所有功能更新和修复。

---

## 最新更新：移动端工具集与侧边栏手风琴优化

### 更新日期
2025-12-03

### 版本号
v1.7.0

### 更新内容
- ✅ **移动端工具集入口重构**：将“工具集”按钮固定到移动端视口底部正中位置（类似指纹识别区），无论页面滚动到哪里都保持悬浮不动
- ✅ **工具集弹窗交互优化**：点击一次底部按钮在其上方弹出工具集，再次点击同一个按钮或点击遮罩/叉号，会带有下滑动画地关闭弹窗
- ✅ **工具列表排版统一**：在工具集弹窗中，所有工具行（主题颜色、夜间模式、语言、通知、发布、用户菜单）统一为“左侧文字说明、右侧图标”两列对齐，并保证行间距一致
- ✅ **移动端主题/通知弹窗居中**：主题颜色取色器与通知列表在移动端以居中模态形式弹出，背景虚化，不再出现内容超出屏幕或显示不全的问题
- ✅ **侧边栏手风琴与图标风格统一**：左侧菜单与分类使用统一风格的图标和更扁平的行样式，去掉多余悬浮背景，但保留清晰的悬停与选中状态

### 修改文件
- `frontend/src/components/Header.jsx` - 工具集开关逻辑、移动端 actions 弹窗行为和动画状态管理
- `frontend/src/components/Header.css` - 底部悬浮按钮定位、工具集弹窗（打开/关闭）动画、按钮行对齐与间距、关闭按钮位置修正
- `frontend/src/components/ThemeColorPicker.jsx`、`frontend/src/components/ThemeColorPicker.css` - 主题色按钮在工具集中的排版与移动端模态样式
- `frontend/src/components/Inbox.jsx`、`frontend/src/components/Inbox.css` - 通知按钮在工具集中的排版与移动端通知模态样式
- `frontend/src/components/Sidebar.jsx`、`frontend/src/components/Sidebar.css` - 左侧导航与分类手风琴结构、图标与行样式的统一

### 技术实现
- **视口级悬浮按钮**：使用 `createPortal` 将工具集按钮挂载到 `document.body`，配合 `position: fixed; left: 50%; transform: translateX(-50%); bottom: ...`，确保始终相对视口固定
- **开关动画状态**：增加 `isClosingActions` 状态，分别为打开和关闭过程附加不同动画 class，使工具集窗口有流畅的上滑展开与下滑收起效果
- **工具行排版统一**：所有带文字的工具按钮在移动端变体中都使用统一的 flex 布局，label 加 `flex: 1`，图标自适应靠右，保证纵向看齐
- **模态与滚动管理**：移动端语言、主题、通知弹窗统一通过 `createPortal` + `body overflow` 锁定处理，防止背景滚动穿透
- **侧边栏手风琴样式重构**：压缩装饰性背景与阴影，仅保留必要的对齐、间距与悬停反馈，使菜单与分类在视觉上更加简洁统一

### 对用户的影响
- 移动端用户在任何滚动位置都能快速打开工具集，且按钮位置稳定、手感一致
- 工具集内部各个按钮对齐整齐、间距统一，图标列与描述列视觉上在同一垂直线，阅读和点击都更舒服
- 主题颜色、通知与语言弹窗在小屏幕上不会再被裁切，操作区域始终完整可见
- 左侧导航和分类层级更清晰，图标风格一致，整体视觉更加简洁现代

---

## 历史更新：顶部搜索与时间展示重构

### 更新日期
2025-12-03

### 版本号
v1.6.1

### 更新内容
- ✅ **搜索与Logo同列**：重排 Header 结构，将搜索框移动到 Logo 右侧，形成统一的品牌区域
- ✅ **居中时间模块**：新增年月日 + 实时数字时钟展示，并根据当前语言自动切换日期格式
- ✅ **视觉统一**：统一年月日字号、色彩与字体，时间段采用等宽字体与更现代的数字显示样式
- ✅ **响应式修复**：全面梳理 992px / 768px / 576px / 480px 各断点，修复搜索、按钮和时间在小屏上的错位与溢出

### 修改文件
- `frontend/src/components/Header.jsx` - 新增时间状态并重构布局
- `frontend/src/components/Header.css` - 更新栅格、时间样式与断点
- `frontend/src/pages/Changelog.jsx` - 新增 v1.6.1 版本记录
- `frontend/CHANGELOG.md`、`BUG_TRACKER.md`、`UPDATE_LOG.md` - 同步文档

### 技术实现
- **实时时间状态**：在 Header 组件中添加 `currentTime` 状态，使用 `setInterval` 每秒刷新，并依据语言映射选择 locale
- **结构重排**：将 Logo 与搜索表单包裹在 `.header-left` 中，新增 `.header-center` 单元专门展示日期与时间
- **样式设计**：时间行采用大写字母 + 细字宽距，时间数字使用 JetBrains Mono 等等宽字体，保持科技感
- **断点治理**：桌面端维持三列网格，小屏时改为纵向堆叠，并为日期块和按钮提供单独的字体/间距调整

### 对用户的影响
- 页面顶栏信息更加清晰：品牌、搜索、时间/日期一目了然
- 多语言用户看到符合语言习惯的日期格式
- 在平板和手机上，搜索与按钮不再挤压或错位，时间始终居中显示
- Header 视觉体验更现代，与整体主题保持一致

---

## 历史更新：多语言支持全面优化

### 更新日期
2025-12-03

### 版本号
v1.5.8

### 更新内容
- ✅ **默认语言改为英文**：网页默认显示为英文界面，提升国际化体验
- ✅ **板块分类多语言支持**：板块分类名称根据选择的语言显示对应翻译（中文、英文、日文）
- ✅ **错误提示多语言化**：所有错误提示信息（加载失败、服务器错误、登录失败等）均支持多语言显示
- ✅ **右侧标签容器提示多语言**：右侧"装满会发生什么"提示文本支持多语言切换
- ✅ **统一错误处理机制**：优化错误消息的翻译处理逻辑，确保所有用户可见的错误信息都能正确翻译

### 修改文件
- `frontend/src/context/LanguageContext.jsx` - 添加分类名称和错误提示的翻译，默认语言改为英文
- `frontend/src/components/Sidebar.jsx` - 使用分类名称翻译函数
- `frontend/src/components/RightSidebar.jsx` - 使用翻译键显示提示文本
- `frontend/src/pages/CreatePost.jsx` - 使用分类名称翻译
- `frontend/src/pages/PostDetail.jsx` - 使用分类名称翻译
- `frontend/src/components/PostCard.jsx` - 使用分类名称翻译
- `frontend/src/pages/Home.jsx` - 所有错误提示使用翻译
- `frontend/src/components/ErrorBoundary.jsx` - 错误边界组件支持多语言
- `frontend/src/context/AuthContext.jsx` - 登录/注册错误消息使用翻译键
- `frontend/src/components/LoginModal.jsx` - 错误消息翻译处理
- `frontend/src/components/RegisterModal.jsx` - 错误消息翻译处理
- `frontend/src/pages/Changelog.jsx` - 更新版本日志（v1.5.8）
- `UPDATE_LOG.md` - 记录本次更新

### 技术实现
- **分类名称翻译映射**：在 LanguageContext 中为每个分类名称创建翻译键（`category.分类名`），支持中文、英文、日文三种语言
- **错误提示翻译系统**：添加完整的错误提示翻译键（`error.*`），涵盖所有用户可见的错误场景
- **翻译函数扩展**：新增 `getCategoryName()` 函数，自动根据当前语言返回对应的分类名称翻译
- **错误消息处理**：在组件层面检查错误消息是否为翻译键，如果是则自动翻译，否则直接显示
- **默认语言配置**：修改 `getInitialLanguage()` 函数，默认返回 `'en'` 而不是 `'zh'`

### 对用户的影响
- 新用户首次访问时看到的是英文界面，更符合国际化标准
- 板块分类名称会根据语言设置自动切换，提升多语言用户体验
- 所有错误提示都能以用户选择的语言显示，减少理解障碍
- 整体多语言支持更加完善和统一

---

## 历史更新：侧边栏添加隐私政策链接

### 更新日期
2025-12-03

### 版本号
v1.5.9

### 更新内容
- ✅ **侧边栏导航增强**：在左侧边栏导航中新增“隐私政策”链接
- ✅ **多语言支持**：链接文本支持中文、英文、日文显示
- ✅ **图标优化**：使用盾牌图标（FaShieldAlt）突出隐私属性
- ✅ **导航顺序调整**：将隐私政策链接放在“联系我们”与“更新日志”之间，符合用户路径

### 修改文件
- `frontend/src/components/Sidebar.jsx` - 添加隐私政策导航项
- `frontend/src/context/LanguageContext.jsx` - 新增 `sidebar.privacy` 翻译键
- `frontend/src/pages/Changelog.jsx` - 更新版本概览（v1.5.9）
- `UPDATE_LOG.md` - 记录本次更新

### 技术实现
- **图标导入**：从 `react-icons/fa` 引入 `FaShieldAlt`
- **路由复用**：指向现有 `/privacy` 页面，无需新增路由
- **样式统一**：沿用 `nav-item` 样式，确保与其他导航项风格一致

### 对用户的影响
- 用户可在任意页面方便访问隐私政策
- 链接文本自动根据所选语言切换
- 导航信息架构更完整，符合用户预期

---

## 历史更新：板块分类设计简化

### 更新日期
2025-12-02

### 版本号
v1.5.6

### 更新内容
- ✅ **简化板块分类设计**：移除气泡样式、背景色、边框、阴影等装饰效果
- ✅ **统一设计风格**：板块分类样式与导航项保持一致，符合整体简洁基调
- ✅ **优化布局**：分类信息改为横向排列，名称和数量在同一行显示
- ✅ **简化交互效果**：移除复杂的动画效果，只保留颜色变化和左侧指示条
- ✅ **优化颜色点**：缩小颜色点尺寸，移除阴影和缩放动画

### 修改文件
- `frontend/src/components/Sidebar.css` - 简化板块分类样式
- `frontend/src/pages/Changelog.jsx` - 更新版本日志（v1.5.6）
- `UPDATE_LOG.md` - 记录本次更新

### 技术实现
- **移除装饰**：移除 `background`、`border`、`box-shadow` 等装饰属性
- **统一风格**：使用与导航项相同的样式变量和过渡效果
- **布局优化**：使用 `flex-direction: row` 和 `justify-content: space-between` 实现横向布局
- **交互简化**：只保留 `color` 过渡效果，移除 `transform` 和 `box-shadow` 动画

### 对用户的影响
- 板块分类设计更加简洁，符合整体设计基调
- 视觉上更加统一，与导航项风格一致
- 减少了视觉干扰，提升用户体验

---

## 历史更新：标签物理引擎系统重构

### 更新日期
2025-12-02

### 版本号
v1.5.5

### 更新内容
- ✅ **Matter.js物理引擎集成**：使用Matter.js物理引擎实现标签的真实物理效果
- ✅ **标签物理掉落**：标签从容器上方掉落，具有重力、碰撞、摩擦等真实物理属性
- ✅ **标签可拖拽**：支持鼠标和触摸拖拽标签，标签之间会发生真实碰撞
- ✅ **标签样式简化**：移除色块和装饰，改为简洁的纯文字样式
- ✅ **标签密度优化**：减小标签占地面积，提高标签密度
- ✅ **响应式适配**：在移动端正常显示，不影响其他内容布局
- ✅ **容器样式统一**：容器样式与整体页面样式统一，使用主题变量

### 修改文件
- `frontend/src/components/RightSidebar.jsx` - 重构为使用Matter.js物理引擎
- `frontend/src/components/RightSidebar.css` - 简化标签样式，统一容器样式
- `frontend/src/App.css` - 优化响应式布局
- `frontend/package.json` - 添加matter-js依赖
- `frontend/src/pages/Changelog.jsx` - 更新版本日志（v1.5.5）
- `UPDATE_LOG.md` - 记录本次更新

### 技术实现
- **物理引擎**：集成Matter.js，实现真实的物理模拟（重力、碰撞、摩擦、弹性）
- **标签掉落**：标签从容器上方随机位置掉落，受重力影响自然下落并堆叠
- **拖拽交互**：使用Matter.MouseConstraint实现标签拖拽功能
- **响应式适配**：使用防抖优化resize事件，确保物理引擎在窗口大小变化时正确调整
- **样式统一**：使用CSS变量（var(--background)、var(--text-primary)等）与整体页面样式统一

### 对用户的影响
- 标签展示更加生动有趣，具有真实的物理效果
- 标签可以拖拽，增加了交互性
- 标签样式更加简洁，不会干扰主要内容
- 在移动端也能正常显示，不影响其他内容

---

## 历史更新：Header左右边距对称修复

### 更新日期
2025-12-02

### 版本号
v1.5.4

### 更新内容
- ✅ **左右边距对称**：修复Header中左侧Logo与左侧边缘的距离和右侧按钮组合与右侧边缘的距离不一致的历史遗留问题
- ✅ **Grid布局优化**：使用 `minmax(0, 1fr)` 确保Grid布局中左右列严格等宽
- ✅ **元素对齐优化**：移除Logo和按钮组合的额外margin和padding，确保紧贴边缘
- ✅ **全断点适配**：在所有响应式断点下保持左右对称
- ✅ **历史问题修复**：这是一个历史遗留问题，多个版本更新迭代都未修复，本次彻底解决

### 修改文件
- `frontend/src/components/Header.css` - 优化Grid布局，确保左右对称
- `frontend/src/pages/Fixes.jsx` - 添加修复记录（v1.5.4）
- `frontend/src/pages/Changelog.jsx` - 更新版本日志（v1.5.4）
- `BUG_TRACKER.md` - 记录本次修复（Bug #007）
- `UPDATE_LOG.md` - 记录本次更新

### 技术实现
- **Grid布局优化**：将 `grid-template-columns: 1fr auto 1fr` 改为 `minmax(0, 1fr) auto minmax(0, 1fr)`，确保左右列严格等宽
- **间距清理**：Logo和按钮组合设置 `margin: 0; padding: 0;`，移除所有可能影响对齐的额外间距
- **元素对齐**：添加 `width: fit-content` 确保Logo和按钮组合紧贴各自列的边缘
- **对称保证**：Logo使用 `justify-self: start`，按钮组合使用 `justify-self: end`，配合等宽的Grid列实现完美对称

### 对用户的影响
- Header左右视觉平衡，提升整体美观度
- 在所有设备上（桌面端、平板、手机）都保持左右对称
- 解决了长期存在的视觉不平衡问题

---

## 历史更新：响应式Header布局优化

### 更新日期
2025-12-02

### 版本号
v1.5.3

### 更新内容
- ✅ **响应式按钮布局优化**：修复语言切换按钮移到右上角后，在响应式设备上出现的按钮排版错乱问题
- ✅ **多断点适配**：优化992px、768px、576px、480px断点的按钮布局和间距
- ✅ **按钮换行优化**：确保按钮在所有断点下都能正确换行和排列，不会重叠或溢出
- ✅ **图标按钮统一**：统一图标按钮和文字按钮的尺寸，保持视觉一致性
- ✅ **语言菜单定位**：优化语言菜单在小屏幕上的定位，确保不会超出视口
- ✅ **搜索框优化**：改进搜索框在超小屏幕上的显示效果

### 修改文件
- `frontend/src/components/Header.css` - 优化所有响应式断点的布局
- `frontend/src/pages/Fixes.jsx` - 添加修复记录（v1.5.3）
- `BUG_TRACKER.md` - 记录本次响应式布局修复
- `UPDATE_LOG.md` - 记录本次更新

### 技术实现
- **Flex布局优化**：使用 `flex: 0 0 auto` 防止按钮被压缩，添加 `white-space: nowrap` 防止文字换行
- **断点适配**：为992px、768px、576px、480px四个断点分别优化布局
- **尺寸统一**：统一图标按钮的最小宽度和字体大小，确保视觉一致性
- **菜单定位**：使用 `right: 0; left: auto` 确保下拉菜单正确定位

### 对用户的影响
- 移动端和小屏幕用户在使用Header按钮时，布局更加整齐美观
- 按钮不会重叠或溢出，提升操作体验
- 语言切换菜单在小屏幕上正确定位，不会超出视口
- 所有按钮在所有设备上都能正常显示和使用

---

## 历史更新：标签位置缓存优化

### 更新日期
2025-12-02

### 版本号
v1.5.2

### 更新内容
- ✅ **标签位置持久化**：修复路由切换时标签位置和动画参数被重置的问题
- ✅ **位置缓存机制**：使用 useMemo 和 useRef 缓存标签位置，仅在标签数据真正改变时重新生成
- ✅ **动画参数持久化**：动画参数（持续时间、延迟、方向）存储在缓存中，避免每次渲染都重新生成
- ✅ **标签签名机制**：基于标签ID和postCount生成签名，确保相同标签数据使用相同位置
- ✅ **流畅切换体验**：切换页面时标签保持连续浮动，不会中断或重置

### 修改文件
- `frontend/src/components/RightSidebar.jsx` - 添加位置和动画参数缓存机制
- `frontend/src/pages/Changelog.jsx` - 更新版本日志（v1.5.2）
- `UPDATE_LOG.md` - 记录本次标签位置缓存优化

### 技术实现
- **标签签名**：使用 `useMemo` 基于标签ID和postCount生成签名字符串
- **位置缓存**：使用 `useRef` 存储位置数据和动画参数，避免路由切换时重置
- **条件更新**：仅在标签签名改变时才重新生成位置，否则使用缓存
- **动画持久化**：每个标签的动画参数存储在 `positionsCacheRef.current.animations` 中

### 对用户的影响
- 切换页面时标签位置保持不变，视觉体验更连贯
- 标签动画不会因路由切换而中断，保持流畅的浮动效果
- 仅在标签数据真正改变时才重新布局，性能更优

---

## 历史更新：标签区域随机布局优化

### 更新日期
2025-12-02

### 版本号
v1.5.1

### 更新内容
- ✅ **标签随机错落布局**：将标签从规则的多行滚动改为随机错落分布，每个标签根据发帖数量重复显示
- ✅ **移除数字显示**：标签不再显示发帖数量，界面更简洁
- ✅ **移除井号前缀**：标签名称不再显示 `#` 符号，直接显示标签名称
- ✅ **隐藏滚动条**：右侧边栏滚动条完全隐藏，保持界面整洁
- ✅ **持续浮动动画**：鼠标悬停时标签继续浮动，不会暂停动画
- ✅ **防重叠算法**：使用碰撞检测确保标签之间保持最小间距，不会相互覆盖

### 修改文件
- `frontend/src/components/RightSidebar.jsx` - 重构标签布局逻辑，实现随机位置生成和防重叠算法
- `frontend/src/components/RightSidebar.css` - 更新样式，实现随机浮动动画和隐藏滚动条
- `frontend/src/pages/Changelog.jsx` - 更新版本日志（v1.5.1）
- `UPDATE_LOG.md` - 记录本次标签区域优化

### 技术实现
- **随机位置生成**：使用碰撞检测算法为每个标签生成随机位置，确保不重叠
- **防重叠算法**：计算标签之间的欧几里得距离，保持最小间距（70px）
- **浮动动画**：每个标签有独立的动画参数（持续时间、延迟、方向），形成自然的浮动效果
- **视觉层次**：不同标签使用不同字体大小和透明度，增加视觉层次感
- **滚动条隐藏**：使用 `scrollbar-width: none` 和 `::-webkit-scrollbar` 隐藏所有浏览器的滚动条

### 视觉效果
- **标签分布**：标签随机分布在右侧栏，不再规则排列
- **浮动效果**：每个标签独立浮动，轻微移动和缩放，形成生动的视觉效果
- **简洁界面**：移除数字和井号，标签显示更简洁
- **无滚动条**：界面更整洁，没有滚动条干扰

### 对用户的影响
- 标签区域更加生动有趣，随机分布带来新鲜感
- 界面更简洁，移除不必要的数字和符号
- 标签持续浮动，增加视觉吸引力
- 防重叠算法确保标签清晰可读，不会相互遮挡

---

## 历史更新：UI 更新- 动态标签与气泡分类

### 更新日期
2025-12-02

### 版本号
v1.5.0

### 更新内容
- ✅ **标签区域多行滚动**：将标签区域改造为多行错开滚动效果，标签持续循环滚动展示，每个标签根据发帖数量重复显示
- ✅ **分类区域气泡浮动**：将分类区域改造为气泡浮动效果，每个分类独立浮动动画，位置错落有致
- ✅ **交互体验优化**：标签滚动支持鼠标悬停暂停，方便用户查看标签内容
- ✅ **视觉效果增强**：分类气泡采用渐变背景容器，标签显示发帖数量，整体视觉效果更佳
- ✅ **响应式设计优化**：移动端自动切换为静态布局，确保在小屏幕上的可用性
- ✅ **悬停效果增强**：标签悬停时变色并上浮，气泡悬停时放大并提升阴影

### 修改文件
- `frontend/src/components/RightSidebar.jsx` - 重构标签和分类显示逻辑，添加滚动和浮动效果
- `frontend/src/components/RightSidebar.css` - 添加标签滚动动画、气泡浮动动画和响应式样式
- `frontend/src/pages/Changelog.jsx` - 更新版本日志（v1.5.0）
- `UPDATE_LOG.md` - 记录本次 UI 视觉升级

### 技术实现
- **标签滚动动画**：使用 CSS `@keyframes` 实现 30 秒循环滚动，标签内容重复显示实现无缝循环
- **气泡浮动动画**：为每个分类项设置独立的动画延迟和持续时间，创建自然的浮动效果
- **响应式适配**：在 992px 以下断点，气泡改为相对定位并取消动画，确保移动端正常显示
- **性能优化**：使用 CSS 动画而非 JavaScript，确保流畅的动画效果
- **交互优化**：标签滚动在鼠标悬停时暂停，提升用户体验

### 视觉效果
- **标签区域**：
  - 悬浮卡片样式，带边框和阴影
  - 标签持续从右向左滚动
  - 悬停时标签变色（主色调）并上浮
  - 标签计数徽章样式优化
  
- **分类区域**：
  - 气泡样式，带阴影和边框
  - 每个分类独立浮动，位置错落有致
  - 渐变背景容器，增强视觉层次
  - 悬停时气泡放大并提升阴影
  - 激活状态高亮显示

### 响应式设计
- **桌面端（>992px）**：完整显示滚动标签和浮动气泡效果
- **平板端（768px-992px）**：气泡改为相对定位，取消动画，保持静态布局
- **移动端（<768px）**：优化间距和字体大小，确保在小屏幕上的可读性

### 对用户的影响
- 标签和分类区域更加生动有趣，提升视觉吸引力
- 标签滚动展示更多内容，无需手动滚动即可查看所有标签
- 分类气泡浮动效果增加趣味性，同时保持功能完整性
- 移动端自动适配，确保在不同设备上都有良好的体验
- 交互反馈更明显，提升用户操作的愉悦感

---

## 历史更新：Inbox 通知功能

### 新增内容
- ✅ **Inbox 通知系统**：右上角新增通知图标，实时接收新帖子通知
- ✅ **通知列表**：点击图标显示通知列表，包含发帖人和帖子标题
- ✅ **未读徽章**：显示未读通知数量，超过99显示"99+"
- ✅ **标记已读**：支持标记单个或全部通知为已读
- ✅ **自动轮询**：每30秒自动更新未读通知数量
- ✅ **跳转功能**：点击通知可直接跳转到对应帖子

### 修改文件
- `backend/migrations/add_notifications_table.sql` - 创建通知数据表
- `backend/models/Notification.js` - 通知模型，包含创建、查询、标记已读等功能
- `backend/controllers/notificationController.js` - 通知控制器
- `backend/routes/notifications.js` - 通知路由
- `backend/controllers/postController.js` - 创建帖子时自动生成通知
- `backend/app.js` - 注册通知路由
- `frontend/src/components/Inbox.jsx` - Inbox 组件
- `frontend/src/components/Inbox.css` - Inbox 样式
- `frontend/src/components/Header.jsx` - 集成 Inbox 组件
- `frontend/src/services/api.js` - 添加通知 API
- `frontend/src/context/LanguageContext.jsx` - 添加通知相关多语言支持
- `openapi.yaml` - 添加通知 API 文档

### 技术实现
- **数据库设计**：创建 `notifications` 表，支持通知类型、关联帖子、关联用户等字段
- **通知生成**：创建帖子时异步为所有其他用户生成通知，不阻塞响应
- **实时更新**：前端使用轮询机制（30秒间隔）自动更新未读数量
- **响应式设计**：通知下拉列表支持移动端显示
- **多语言支持**：通知界面支持中文、英文、日文

### API 端点
- `GET /api/notifications` - 获取通知列表（支持分页和筛选）
- `GET /api/notifications/unread-count` - 获取未读通知数量
- `PUT /api/notifications/:notificationId/read` - 标记单个通知为已读
- `PUT /api/notifications/read-all` - 标记所有通知为已读
- `DELETE /api/notifications/:notificationId` - 删除通知

### 数据库迁移
运行以下 SQL 脚本创建通知表：
```bash
psql -U your_username -d reforum -f backend/migrations/add_notifications_table.sql
```

### 对用户的影响
- 登录用户可以在右上角看到通知图标
- 当有新帖子发布时，所有其他用户会收到通知
- 用户可以方便地查看和管理通知
- 点击通知可直接跳转到相关帖子，提升用户体验

---

## 最新更新：响应式布局优化

### 优化内容
- ✅ **移动端布局优化**：全面优化移动端和小屏幕设备的显示效果，提升用户体验
- ✅ **帖子详情页响应式**：优化标题、内容、操作按钮在小屏幕上的显示和排列
- ✅ **首页和卡片优化**：改进首页和帖子卡片在移动端的布局、间距和元素排列
- ✅ **错误状态响应式**：调整错误提示在窄屏上的显示样式，文字大小和间距适配

### 修改文件
- `frontend/src/pages/PostDetail.css` - 添加移动端响应式样式，优化标题大小和布局
- `frontend/src/pages/Home.css` - 优化首页在移动端的布局和错误状态显示
- `frontend/src/components/PostCard.css` - 改进帖子卡片在移动端的显示效果
- `frontend/src/App.css` - 优化应用容器在小屏幕上的间距
- `frontend/src/pages/Changelog.jsx` - 更新版本日志
- `frontend/src/pages/Fixes.jsx` - 记录响应式修复
- `docs/UPDATE_LOG.md` - 记录本次响应式优化

### 技术实现
- **媒体查询优化**：添加 768px 和 480px 断点的响应式样式
- **字体大小调整**：标题、正文在小屏幕上使用更合适的字体大小
- **布局改进**：使用 flex-wrap 和合理的间距，避免元素溢出
- **间距优化**：在不同屏幕尺寸下使用适配的内边距和外边距

### 对用户的影响
- 移动端用户浏览帖子时，标题和内容显示更合理，不会过大或过小
- 首页和帖子列表在手机上布局更紧凑，信息展示更清晰
- 错误提示在移动端显示更友好，不会因为屏幕小而导致文字拥挤
- 操作按钮和统计信息在小屏幕上排列更合理，避免横向溢出

---

## 最新更新：请求间隔优化与速率限制调整

### 优化内容
- ✅ **后端速率限制放宽**：将速率限制从 15 分钟内 100 个请求提升到 500 个请求，降低正常使用时被误拦截的概率
- ✅ **前端防抖/节流机制**：在首页和搜索页面添加防抖（300ms）和节流（500ms最小间隔）机制，避免频繁请求导致后端数据加载失败
- ✅ **请求超时时间延长**：将 API 请求超时时间从 5 秒增加到 10 秒，给后端更多处理时间
- ✅ **错误处理优化**：在响应拦截器中优化 429 速率限制错误的处理，提供更友好的错误提示

### 修改文件
- `backend/app.js` - 放宽速率限制，从 15 分钟内 100 个请求增加到 500 个请求
- `frontend/src/utils/debounce.js` - 新建防抖/节流工具函数
- `frontend/src/pages/Home.jsx` - 添加请求防抖和节流机制，最小请求间隔 500ms
- `frontend/src/pages/Search.jsx` - 添加请求防抖和节流机制，最小请求间隔 500ms
- `frontend/src/services/api.js` - 增加请求超时时间至 10 秒，优化 429 错误处理
- `UPDATE_LOG.md` - 记录本次请求间隔优化

### 技术实现
- **防抖（Debounce）**：在用户快速操作时，等待 300ms 无新操作后才发起请求
- **节流（Throttle）**：确保两次请求之间至少有 500ms 的间隔，避免请求过于频繁
- **速率限制**：后端使用 express-rate-limit 中间件，限制每个 IP 15 分钟内最多 500 个请求

### 对用户的影响
- 多次快速操作（如切换排序、搜索、切换分类）不会再导致后端数据加载不出来
- 降低请求频率，减轻服务器负载，提升系统稳定性
- 更友好的错误提示，当触发速率限制时能清楚了解需要等待的时间

---

## 最新更新：多语言界面与语言切换器

### 新增内容
- ✅ **三语界面**：除用户发布的帖子正文外，导航、侧栏、搜索、发帖、弹窗以及各静态页面均支持中文/英文/日文三种语言
- ✅ **悬浮语言按钮**：左下角新增圆形语言切换器，支持悬停/点击展开动画，并记住最近一次的语言偏好
- ✅ **法务与信息页翻译**：用户协议、隐私政策、关于我们、联系我们、更新日志、问题修复等页面提供独立的多语言内容

### 修改文件（节选）
- `frontend/src/context/LanguageContext.jsx` - 扩展翻译字典，覆盖导航、右侧栏、搜索、发帖、评论等文案
- `frontend/src/components/Sidebar.jsx`、`RightSidebar.jsx`、`CommentList.jsx`、`LanguageSwitcher.jsx` 等 - 接入语言上下文
- `frontend/src/pages/Home.jsx`、`Search.jsx`、`CreatePost.jsx`、`PostDetail.jsx` - 动态切换按钮、提示与表单文案
- `frontend/src/pages/About.jsx`、`Contact.jsx`、`Changelog.jsx`、`Fixes.jsx`、`Terms.jsx`、`Privacy.jsx` - 重构为多语言内容
- `UPDATE_LOG.md` - 记录本次多语言改造

### 对用户的影响
- 访客可直接在页面底部切换语言，界面文本实时更新，阅读体验更连贯
- 多语言版本的法务与帮助内容降低了国际用户的理解成本

---

## 最新更新：问题修复页排版优化

### 修复内容
- ✅ **列表布局统一**：问题修复页面改用自适应网格，桌面与移动端间距、对齐方式保持一致
- ✅ **卡片内容精简**：移除“对你的影响”段落，突出修复描述与关键改动
- ✅ **文字排版优化**：调整标题、正文、要点间距，阅读体验更舒服

### 修改文件
- `frontend/src/pages/Fixes.jsx` - 新增排版修复记录，移除“对你的影响”字段
- `frontend/src/pages/Fixes.css` - 调整卡片网格与排版样式
- `frontend/src/pages/Changelog.jsx` - 更新版本日志
- `UPDATE_LOG.md` - 记录本次排版优化

### 对用户的影响
- 浏览问题修复页面时信息更集中，布局在各类设备上更一致

---

## 最新更新：夜间模式卡片与下拉可读性修复

### 修复内容
- ✅ **问题修复页面**：卡片、日期标签、说明等元素改用主题色变量，在夜间模式下可读性保持一致
- ✅ **发帖板块下拉**：下拉选项沿用主题文字颜色，深色背景中也能看清楚

### 修改文件
- `frontend/src/pages/Fixes.css` - 调整问题修复页面的用色，适配深浅色主题
- `frontend/src/pages/CreatePost.css` - 优化板块下拉选项的前景色
- `frontend/src/pages/Fixes.jsx` - 记录夜间可读性修复
- `frontend/src/pages/Changelog.jsx` - 更新版本日志

### 对用户的影响
- 夜间模式浏览问题修复页面或选择发帖板块时，文字不再发白或消失，可读性显著提升

---

## 最新更新：夜间模式表单可读性优化

### 修复内容
- ✅ **输入框文字颜色**：夜间主题下的标题、内容输入框文字改为浅色，高对比可读
- ✅ **占位提示与下拉框**：占位符使用次级文本色，下拉框文本与主题同步，避免暗底暗字

### 修改文件
- `frontend/src/pages/CreatePost.css` - 调整输入控件的字体颜色与占位符颜色
- `frontend/src/pages/Fixes.jsx` - 记录夜间模式表单可读性修复
- `frontend/src/pages/Changelog.jsx` - 更新版本日志

### 对用户的影响
- 夜间模式编辑帖子时，表单内容清晰易读，填写体验更舒适

---

## 最新更新：导航按钮响应式修复

### 修复内容
- ✅ **导航按钮排版**：顶部导航的夜间模式、发布、用户按钮在小屏重新排版，不再竖向堆叠
- ✅ **主题按钮文字**：按钮内容保持单行显示，小屏仅保留图标，避免文字竖排
- ✅ **整体布局适配**：导航容器在中小屏自动居中、换行，保持搜索框和按钮的可用空间

### 修改文件
- `frontend/src/components/Header.css` - 调整按钮排版、添加响应式断点样式
- `frontend/src/pages/Fixes.jsx` - 记录导航排版修复
- `frontend/src/pages/Changelog.jsx` - 更新版本日志

### 对用户的影响
- 手机和平板访问时，顶部导航按钮排列整齐、文字清晰，切换主题与发布帖子操作更方便

---

## 最新更新：资料页移动端布局优化

### 修复内容
- ✅ **资料页响应式优化**：在手机和平板设备上，头像、统计信息与文案按列排布并居中显示
- ✅ **统计数据换行**：统计项在窄屏支持自动换行，避免文字拥挤或重叠
- ✅ **操作按钮位置调整**：删除按钮在小屏上保持合适边距，不遮挡帖子内容

### 修改文件
- `frontend/src/pages/UserProfile.css` - 新增响应式布局样式，优化统计区域与按钮位置
- `frontend/src/pages/Fixes.jsx` - 记录本次修复
- `frontend/src/pages/Changelog.jsx` - 更新版本日志

### 对用户的影响
- 移动端访问个人资料页时，内容排版更紧凑、易读，操作区域不再遮挡主要内容

---

## 最新更新：夜间模式开关

### 新增内容
- ✅ **夜间模式按钮**：在顶部导航的“发布”按钮旁新增夜间模式开关
- ✅ **主题记忆**：自动记住上次选择，刷新或切换页面后保持当前主题
- ✅ **局部优化**：夜间模式下优化导航栏、卡片、下拉菜单等对比度

### 修改文件
- `frontend/src/components/Header.jsx` - 添加夜间模式切换按钮、主题状态管理
- `frontend/src/components/Header.css` - 调整导航栏样式、增加夜间模式按钮样式
- `frontend/src/index.css` - 定义日间/夜间两套主题变量

### 使用说明
- 在导航栏点击“夜间模式/日间模式”按钮即可切换主题
- 切换后主题会立即生效，并保存在浏览器本地

---

## 最新更新：搜索结果命中率修复

### 修复内容
- ✅ **搜索结果命中率**：修复后端搜索接口在统计总数时缺少用户表关联，导致任何关键词都返回空列表的问题
- ✅ **查询一致性**：列表查询与总数统计共用同一套 `FROM + JOIN` 语句，确保标题、内容、作者搜索条件生效

### 修改文件
- `backend/models/Post.js` - 调整 `findAll` 方法，复用基础查询片段
- `frontend/src/pages/Fixes.jsx` - 新增搜索修复记录
- `frontend/src/pages/Changelog.jsx` - 新增搜索修复相关更新

### 对用户的影响
- 搜索框再次可用，输入任意关键词都会返回匹配的帖子列表
- 搜索排序、分页能力保持不变，体验更加可靠

---

## 最新更新：问题修复板块与图片地址修复

### 新增内容
- ✅ **问题修复板块**：在侧边栏新增“问题修复”，集中展示面向用户的缺陷修复说明
- ✅ **图片地址修复**：修复线上图片地址可能变成 `https://uploads/...` 导致无法加载的问题
- ✅ **清晰说明**：每个修复包含修复内容、细节与影响范围

### 修改文件
- `frontend/src/components/Sidebar.jsx` - 新增“问题修复”导航项
- `frontend/src/pages/Fixes.jsx` - 新建问题修复页面
- `frontend/src/pages/Fixes.css` - 问题修复页面样式
- `frontend/src/App.jsx` - 新增“问题修复”路由
- `frontend/src/components/ImageUpload.jsx`、`frontend/src/components/PostCard.jsx`、`frontend/src/pages/PostDetail.jsx` - 统一修复图片 URL 构造逻辑

### 修复说明（对用户）
- 现在发帖或浏览帖子时，图片能稳定显示；不会再出现图片地址以 `https://uploads/` 开头的情况
- “问题修复”页面会持续更新，便于了解近期修复的缺陷与影响范围

---

## 搜索功能

### 新增内容
- ✅ **搜索功能**：用户可以通过搜索框搜索帖子标题、内容和作者用户名
- ✅ **搜索结果页面**：创建了专门的搜索结果页面，显示搜索关键词和结果数量
- ✅ **搜索排序**：搜索结果支持按时间或热门排序
- ✅ **搜索分页**：搜索结果支持分页加载

### 技术实现
- **后端**：
  - 在 `Post.findAll` 方法中添加 `search` 参数支持
  - 使用 PostgreSQL 的 `ILIKE` 进行不区分大小写的模糊搜索
  - 搜索范围包括：帖子标题、帖子内容、作者用户名
- **前端**：
  - 创建 `Search.jsx` 搜索结果页面
  - 更新 `Header.jsx` 实现搜索跳转
  - 添加搜索相关的样式

### 修改文件
- `backend/models/Post.js` - 添加搜索参数支持
- `backend/controllers/postController.js` - 处理搜索参数
- `frontend/src/pages/Search.jsx` - 新建搜索结果页面
- `frontend/src/components/Header.jsx` - 实现搜索跳转
- `frontend/src/pages/Home.css` - 添加搜索结果样式
- `frontend/src/App.jsx` - 添加搜索路由
- `openapi.yaml` - 更新API文档，添加search参数

### 使用方法
1. 在顶部搜索框输入关键词
2. 按回车或点击搜索图标
3. 跳转到搜索结果页面，显示匹配的帖子
4. 可以切换"最新"或"热门"排序
5. 支持分页加载更多结果

---

## 1. 关于我们页面优化

### 修改内容
- ✅ 将"我们的使命"改为"初衷"
- ✅ 删除"技术栈"部分
- ✅ 修复"加入我们"板块排版
- ✅ 修复"联系我们"按钮的悬浮和点击样式

### 修改文件
- `frontend/src/pages/About.jsx`
- `frontend/src/pages/About.css`

---

## 2. 字体系统更新

### 修改内容
- ✅ 应用 Open Sans（正文）和 Poppins（标题）字体
- ✅ 整体字体加粗，提升可读性
  - 正文：font-weight 500
  - 标题：font-weight 700
  - 分隔符：font-weight 300 → 400

### 修改文件
- `frontend/index.html` - 添加 Google Fonts 链接
- `frontend/src/index.css` - 应用字体样式
- `frontend/src/components/Header.css` - Logo 字体

---

## 3. 帖子浏览和评论功能修复

### 修复内容
- ✅ **浏览次数去重**：同一用户或同一IP在24小时内只计算一次
- ✅ **评论数显示修复**：首页和详情页评论数显示一致
- ✅ **评论列表显示修复**：所有评论（包括回复）正确显示

### 技术实现
- 创建 `post_views` 表记录浏览历史
- 已登录用户：基于 user_id 去重
- 未登录用户：基于 IP 地址24小时内去重

### 新增文件
- `backend/migrations/add_post_views_table.sql` - 浏览记录表迁移脚本
- `backend/migrations/README.md` - 迁移说明

### 修改文件
- `backend/models/Post.js` - 添加 `comment_count` 计算，更新 `incrementViewCount` 方法
- `backend/controllers/postController.js` - 传递用户ID和IP地址
- `frontend/src/pages/PostDetail.jsx` - 使用 `post.commentCount` 显示评论数

---

## 4. 评论回复层级调整

### 修改内容
- ✅ 最大回复层级从 3 层改为 1 层
- ✅ 达到层级上限时不显示提示信息

### 修改文件
- `frontend/src/components/CommentList.jsx` - maxDepth 改为 1
- `backend/models/Comment.js` - getReplies 方法 maxDepth 改为 1
- `backend/controllers/commentController.js` - 深度检查改为 >= 1

---

## 5. 用户协议和隐私政策页面

### 新增内容
- ✅ 创建用户协议页面（`/terms`）
- ✅ 创建隐私政策页面（`/privacy`）
- ✅ 更新注册模态框中的链接，指向实际页面

### 新增文件
- `frontend/src/pages/Terms.jsx` - 用户协议页面
- `frontend/src/pages/Terms.css` - 用户协议样式
- `frontend/src/pages/Privacy.jsx` - 隐私政策页面
- `frontend/src/pages/Privacy.css` - 隐私政策样式

### 修改文件
- `frontend/src/App.jsx` - 添加用户协议和隐私政策路由
- `frontend/src/components/RegisterModal.jsx` - 更新链接指向实际页面

### 页面内容
- **用户协议**：包含账户注册、用户行为规范、内容发布、知识产权、免责声明等条款
- **隐私政策**：包含信息收集、信息使用、信息共享、数据安全、Cookie使用、用户权利等内容

---

## 6. 图片上传功能

### 功能特点
- ✅ 支持选择和拖拽上传图片
- ✅ 支持多张图片上传（最多10张）
- ✅ 图片格式：JPEG、PNG、GIF、WebP
- ✅ 单张图片大小限制：5MB
- ✅ 实时预览上传的图片
- ✅ 支持删除已上传的图片
- ✅ 图片自动插入到帖子内容中（Markdown格式）
- ✅ 帖子详情页自动显示图片

### 新增文件
- `backend/middleware/upload.js` - Multer 文件上传中间件
- `backend/controllers/uploadController.js` - 图片上传控制器
- `backend/routes/upload.js` - 图片上传路由
- `frontend/src/components/ImageUpload.jsx` - 图片上传组件
- `frontend/src/components/ImageUpload.css` - 图片上传样式

### 修改文件
- `backend/package.json` - 添加 multer 依赖
- `backend/app.js` - 添加静态文件服务和上传路由
- `backend/Dockerfile` - 创建上传目录
- `docker-compose.yml` - 添加上传目录卷映射
- `frontend/src/pages/CreatePost.jsx` - 集成图片上传组件
- `frontend/src/pages/PostDetail.jsx` - 支持显示Markdown格式图片
- `frontend/src/pages/PostDetail.css` - 添加图片显示样式

### API 端点
```
POST /api/upload/image - 上传单个图片（需要认证）
POST /api/upload/images - 上传多个图片（需要认证）
GET /uploads/:filename - 访问上传的图片
```

### 技术实现
- 使用 Multer 处理文件上传
- 图片存储在 `backend/uploads` 目录
- 图片以 Markdown 格式 `![alt](url)` 插入到帖子内容中
- 前端解析 Markdown 图片语法并显示

---

## 7. 邮箱验证码注册功能

### 功能特点
- ✅ 6位数字验证码
- ✅ 验证码有效期5分钟
- ✅ 60秒内只能发送一次（防刷）
- ✅ 最多验证尝试5次
- ✅ 自动检查邮箱是否已注册
- ✅ 前端倒计时显示

### 新增文件
- `backend/services/verificationCodeService.js` - 验证码服务
- `backend/controllers/verificationController.js` - 验证码控制器

### 修改文件
- `backend/services/emailService.js` - 添加发送验证码邮件方法
- `backend/controllers/authController.js` - 注册时验证验证码
- `backend/routes/auth.js` - 添加发送验证码路由
- `backend/middleware/validation.js` - 添加验证码字段验证
- `frontend/src/components/RegisterModal.jsx` - 添加验证码输入和发送功能
- `frontend/src/services/api.js` - 添加发送验证码 API

### API 端点
```
POST /api/auth/send-verification-code - 发送验证码
POST /api/auth/register - 注册（需要验证码）
```

---

## 配置要求

### 环境变量
```env
# Resend 邮件服务（用于发送验证码）
RESEND_API_KEY=re_your_resend_api_key
```

### 数据库迁移
运行以下 SQL 脚本创建浏览记录表：
```bash
psql -U your_username -d forum_db -f backend/migrations/add_post_views_table.sql
```

---

## 注意事项

1. **验证码存储**：当前使用内存存储，服务重启后会丢失。生产环境建议使用 Redis
2. **邮件服务**：需要在 Resend 控制台配置发件域名
3. **数据库迁移**：部署前需要运行浏览记录表的迁移脚本

---

## 8. 数据库管理脚本

### 新增内容
- ✅ 创建清空所有数据的 SQL 脚本
- ✅ 提供多种执行方式（直接 SQL、Bash、PowerShell、Docker）
- ✅ 自动重置序列和恢复初始分类

### 新增文件
- `backend/scripts/clear_all_data.sql` - 核心 SQL 脚本
- `backend/scripts/clear_all_data.sh` - Bash 执行脚本
- `backend/scripts/clear_all_data.ps1` - PowerShell 执行脚本
- `backend/scripts/clear_all_data_docker.sh` - Docker 执行脚本
- `backend/scripts/README.md` - 使用说明文档

### 功能说明
- 按外键依赖顺序删除所有表的数据
- 保留表结构，只清空数据
- 自动重置所有序列（ID 从 1 开始）
- 自动恢复默认的 4 个分类
- 提供交互式确认，防止误操作

### 使用方法
```bash
# 方法 1: 直接执行 SQL
psql -U HuangWeiLong -d forum_db -f backend/scripts/clear_all_data.sql

# 方法 2: 使用 Docker
docker exec -i reforum-db-1 psql -U HuangWeiLong -d forum_db < backend/scripts/clear_all_data.sql

# 方法 3: 使用脚本（需要执行权限）
chmod +x backend/scripts/clear_all_data.sh
./backend/scripts/clear_all_data.sh
```

### ⚠️ 警告
**此脚本会永久删除所有数据，请谨慎使用！建议先备份数据库。**

---

## 9. 帖子点赞功能

### 功能特点
- ✅ 用户可以点赞/取消点赞帖子
- ✅ 防止重复点赞（同一用户对同一帖子只能点赞一次）
- ✅ 实时更新点赞数
- ✅ 显示用户是否已点赞（已点赞显示红色实心图标）
- ✅ 在首页和详情页都可以点赞
- ✅ 未登录用户提示需要登录

### 新增文件
- `backend/migrations/add_post_likes_table.sql` - 点赞记录表迁移脚本

### 修改文件
- `backend/models/Post.js` - 添加点赞相关方法（toggleLike, getLikeCount, hasUserLiked），更新formatPostListItem和formatPostDetail支持点赞状态
- `backend/controllers/postController.js` - 添加点赞和检查点赞状态的控制器方法
- `backend/routes/posts.js` - 添加点赞相关路由
- `frontend/src/services/api.js` - 添加点赞API方法
- `frontend/src/components/PostCard.jsx` - 添加点赞按钮和逻辑
- `frontend/src/components/PostCard.css` - 添加点赞按钮样式
- `frontend/src/pages/PostDetail.jsx` - 添加点赞按钮和逻辑
- `frontend/src/pages/PostDetail.css` - 添加点赞按钮样式
- `openapi.yaml` - 添加点赞API文档

### API 端点
```
POST /api/posts/:postId/like - 点赞/取消点赞帖子（需要认证）
GET /api/posts/:postId/like - 检查用户是否已点赞（需要认证）
```

### 数据库迁移
运行以下 SQL 脚本创建点赞记录表：
```bash
psql -U your_username -d forum_db -f backend/migrations/add_post_likes_table.sql
```

### 技术实现
- 使用 `post_likes` 表记录点赞关系，通过唯一约束防止重复点赞
- 点赞时自动更新帖子的 `like_count` 字段
- 前端实时显示点赞状态和数量
- 已点赞的帖子显示红色实心心形图标，未点赞显示空心图标

---

## 10. 帖子删除功能

### 功能特点
- ✅ 用户可以在自己的资料页面删除自己发布的帖子
- ✅ 只有帖子作者可以删除自己的帖子
- ✅ 删除前需要确认，防止误操作
- ✅ 删除成功后自动更新帖子列表和用户统计
- ✅ 删除帖子后自动刷新标签列表（隐藏没有关联帖子的标签）

### 修改文件
- `backend/controllers/postController.js` - 添加 `deletePost` 方法
- `backend/routes/posts.js` - 启用删除帖子路由
- `frontend/src/services/api.js` - 添加 `deletePost` API 方法
- `frontend/src/pages/UserProfile.jsx` - 添加删除按钮和功能
- `frontend/src/pages/UserProfile.css` - 添加删除按钮样式
- `frontend/src/components/RightSidebar.jsx` - 添加删除帖子后自动刷新标签列表的功能
- `openapi.yaml` - 添加删除帖子API文档

### API 端点
```
DELETE /api/posts/:postId - 删除帖子（需要认证，仅限作者）
```

### 技术实现
- 后端验证用户身份和帖子所有权
- 前端在用户资料页面显示删除按钮（仅对自己的帖子）
- 删除成功后触发 `postDeleted` 事件，通知其他组件刷新
- 标签列表自动过滤掉 `postCount` 为 0 的标签

---

## 11. 热门排序优化

### 修改内容
- ✅ 热门排序改为按照点赞数量降序排列
- ✅ 点赞数相同的按创建时间降序排列

### 修改文件
- `backend/models/Post.js` - 修改热门排序逻辑

### 排序规则
- **原逻辑**：`(view_count + like_count * 2) DESC`（综合浏览量和点赞数）
- **新逻辑**：`like_count DESC, created_at DESC`（仅按点赞数，相同点赞数按时间）

---

## 12. 联系我们页面优化

### 修改内容
- ✅ 将 GitHub 和 LinkedIn 替换为 QQ 和微信联系方式
- ✅ 添加管理员头像显示功能（支持实际照片）
- ✅ 统一图标样式为空心图标
- ✅ 优化排版对齐

### 修改文件
- `frontend/src/pages/Contact.jsx` - 更新联系方式数据，添加头像显示逻辑
- `frontend/src/pages/Contact.css` - 添加头像图片样式
- `frontend/src/index.css` - 添加错误颜色变量

### 图标使用
- 邮箱：`FaRegEnvelope`（空心）
- 用户：`FaRegUser`（空心）
- QQ：`RiQqLine`（Remix Icon 空心）
- 微信：`FaRegComments`（空心）

### 头像配置
- 头像图片路径：`/avatars/admin1.jpg` 和 `/avatars/admin2.jpg`
- 图片应放置在 `frontend/public/avatars/` 目录
- 如果图片加载失败，自动显示默认用户图标

---

## 13. 界面优化

### 修改内容
- ✅ 删除右侧边栏中的"数据加载中，请稍候"提示文本
- ✅ 简化空状态显示

### 修改文件
- `frontend/src/components/RightSidebar.jsx` - 移除多余的加载提示文本

---

## 14. 顶部导航与通知体验优化

### 修改内容
- ✅ 修复桌面端语言切换按钮在悬浮后难以点击的问题，菜单仅在点击外部或选择语言后关闭
- ✅ 移除评论回复层级提示文案，达到层级上限时不再额外弹出提示
- ✅ 再次优化移动端通知下拉菜单的高度与滚动行为，确保长列表在小屏幕上也能完整浏览

### 修改文件
- `frontend/src/components/Header.jsx` - 调整语言切换按钮的打开 / 关闭逻辑
- `frontend/src/components/Header.css` - 细节样式调整
- `frontend/src/components/CommentList.jsx` - 移除层级提示文案展示
- `frontend/src/context/LanguageContext.jsx` - 删除与回复层级相关的多语言文案
- `backend/controllers/commentController.js` - 统一层级校验错误文案
- `frontend/src/components/Inbox.css` - 调整移动端通知下拉菜单最大高度与列表滚动

---

## 15. 顶部搜索与时间展示重构

### 修改内容
- ✅ 将头部搜索框移动到 Logo 右侧，与品牌区保持紧邻
- ✅ 新增居中的年月日+实时数字时钟展示，自动根据语言切换格式
- ✅ 统一年月日字号，重新设计时间模块视觉样式，使其更契合整体风格
- ✅ 全面梳理 992px / 768px / 576px / 480px 各断点布局，修复搜索与按钮错乱、日期无法居中的问题

### 修改文件
- `frontend/src/components/Header.jsx` - 新增时间状态、重新组织布局结构
- `frontend/src/components/Header.css` - 更新栅格、时间模块视觉、断点适配

---

## 16. 更新日志最新条目日期与徽章可读性提升

### 修改内容
- ✅ “最新更新”标题旁新增对应版本的发布日期展示，自动匹配当前语言格式
- ✅ “更新/Update” 徽章改为高对比度的胶囊样式，明暗主题下都清晰可见
- ✅ 日期标签升级为渐变芯片风格，视觉上更符合 1.6 系列的现代基调

### 修改文件
- `frontend/src/pages/Changelog.jsx` - 增加日期渲染逻辑
- `frontend/src/pages/Changelog.css` - 调整日期与徽章样式

---

## 17. 加载动画主题适配与灰色方块残影修复

### 修改内容
- ✅ Intro 加载页背景改为直接使用主题 `--background` 变量，跟随右上角“整体页面基调”变化
- ✅ 进度条圆环、百分比数字和 LOADING 文案统一使用主题主色系变量渲染
- ✅ 移除进度条发光阴影 `filter`，消除加载时出现的灰色方块残影
- ✅ 将 `ThemeProvider` 上移到应用根节点，确保加载阶段也能拿到最新主题颜色

### 修改文件
- `frontend/src/components/IntroLoader.jsx` - 确认进度环使用主题变量
- `frontend/src/components/IntroLoader.css` - 背景与进度条/文字改用主题变量，移除灰色阴影
- `frontend/src/main.jsx` - 在应用外层包裹 `ThemeProvider`
- `frontend/src/App.jsx` - 去掉内部多余的 `ThemeProvider`，避免嵌套

---

## 更新日期

2025/12/03

