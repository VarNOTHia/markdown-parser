---
title: '人和 React 项目总有一个能跑，但是你今天脚扭伤了 —— ①：渲染' 
date: 2024-09-08 23:24:56
categories: 技术学习
tags:
- 前端
- 技术相关
- JavaScript
- React.js
---

近期我变回了「社会闲杂人员」，想了想前三个月做的事情，还是有必要做一个复盘的。这篇文章是「关于项目是怎么跑起来」的角度做的整理。这也是相继前两篇（JS 作用域、异步）之后的第三篇文章了。

谈到「项目是怎么跑起来的呢？」这个问题，本人由于技术力有限，只能先从**两个视角**分析，分别是要展现出来的项目如何在**开发者**的角度工作、和**用户端**如何呈现出项目对应的东西，至于项目如何从开发模式打包发布之类的事情，就留给下一篇文章吧。

## 用户侧

正所谓「开发者**只要**改改代码就好了，用户要访问的话做的可就多了」，不论是开发者还是用户，肯定都会有从浏览器访问到 Web 项目的过程，这本身是万变不离其宗的事情，所以先从这里谈起。

### 输入网址的过程中发生了什么？

这部分内容应该属于是经典面经了，当用户在浏览器内输入网址的时候会发生的事情：

#### 浏览器进行 **URL 解析**、生成 HTTP 请求

一个 URL 分为 **协议**（http、https...）- **域名**（www.example.com）- **端口**（:8080） - **数据源路径名**（/file/index.html）- **查询参数**（?id=1114&start=22）等部分。

#### 进行 **DNS 解析**

起初的时候，人们需要通过输入 **IP 地址**来访问网页。它是主机作为路由寻址的数字标识，不便记忆。于是 Paul Mockapetris 发明了一个**别名**，从此开始碰到伸手党终于可以甩过去「⚪⚪⚪，你不会百度吗」而不是「⚪（一种动作）⚪（人）⚪（一种人和人之间的关系），你没有访问过 https://[2408:871a:2100:2:0:ff:b09f:237]:443/ 吗？」（到了 IPV6 的时代，这个问题变得更地狱了 hhhhh）

输入网址的第二步，就是将域名转换成一个实际能用来寻址的东西。

过程大概就是，检查本地 DNS 缓存。若缓存中没有记录，则寻找 Host，找不到的话，浏览器发起 DNS 查询，依次通过本地 DNS 服务器、**根域名（.）**服务器、**顶级域名（.com）**服务器和**权威域名（example）**服务器来解析域名，最终获取到目标服务器的 IP 地址。

可以通过查看「DevTool - Network - 对应域名 Headers 里面的 **Remote Address**」来在 Chrome 当中查看域名的解析情况。

#### 建立连接

**HTTP** 协议是建立在 **TCP** 协议（**面向连接**、**可靠**、基于**字节流**）上的。通过三次握手之后建立连接。TCP 三次握手的目的是确保客户端和服务器能够可靠地通信，它们之间的传输通道是畅通的。

而 HTTP**S** 在 HTTP 与 TCP 层之间加入了 `SSL/TLS` 协议，对明文传输的 HTTP 进行了加密。这个过程同时包含**对称**（通信过程中加密明文数据）和**非对称**加密（在通信建立前交换密钥），包含一个四次握手的过程。

#### 发送 HTTP 请求

当建立`tcp`连接之后，就可以在这基础上进行通信，浏览器发送 `http` 请求到目标服务器。

请求的内容包括：

- 请求行
- 请求头
- 请求主体

服务器处理请求，返回 HTML / CSS / JS。这个过程当然也可以在 DevTool 里面看。

然后就进入了浏览器的主场，开始渲染页面。

### 浏览器做了什么处理？

#### 渲染

##### 解析 HTML 与 CSS

一旦浏览器收到第一个数据分块，它就可以开始解析收到的信息。[“解析”](https://developer.mozilla.org/zh-CN/docs/Glossary/Parse)是浏览器将通过网络接收的数据转换为 [DOM](https://developer.mozilla.org/zh-CN/docs/Glossary/DOM) 和 [CSSOM](https://developer.mozilla.org/zh-CN/docs/Glossary/CSSOM) / **CSS 规则树** （浏览器遍历 CSS 中的每个规则集，根据 CSS 选择器创建具有父、子和兄弟关系的节点树）的步骤，通过渲染器在屏幕上将它们绘制成页面。**然后进行 JavaScript 的下载，脚本被解析成抽象语法树。**

##### 构建渲染树

浏览器将 DOM 和 CSS 规则树**组合成渲染树。**计算样式树或渲染树的构建从 DOM 树的根开始，遍历每个可见节点。每个可见节点都应用了 CSSOM 规则。渲染树包含所有可见节点的内容和计算样式。

##### 布局

布局引擎在渲染树上运行布局以计算每个节点的几何体。*布局*是确定呈现树中所有节点的**尺寸和位置**，以及确定页面上每个对象的大小和位置的过程。（同理，**回流**，就是重新计算）

如果这个过程再次被触发，就叫做「回流」。

##### 绘制

将各个节点绘制到屏幕上，浏览器将在布局阶段计算的**每个盒子**转换为屏幕上的**实际像素**。绘制涉及将元素的每个可见部分绘制到屏幕上，包括文本、颜色、边框、阴影以及按钮和图像等替换元素。（这个过程可能分层）

如果这个过程再次被触发，就叫做「重绘」。

##### 合成

浏览器会将各层的信息发送给 GPU，GPU 会将各层**合成**（ composite ），显示在屏幕上。

#### 缓存

加载资源和渲染的过程本身就很复杂，更不用提 CSR、SSR、SSG 之类的各种高级操作。它本身就是有一定开销的行为，所以一定需要一个**缓存**的机制。

当 DOM 加载完毕的时候，HTML 内容、JS 变量存储的引用会**保存在 DOM 结构里**。同时浏览器为了保障用户体验，也不会主动清除内容。但一旦卸载，它们就会消失。如果这个时候有成批的神人用户不断的刷新，效果的奇异搞笑程度可想而知。

##### 缓存介质

所以引入了 **内存缓存** 和 **磁盘缓存** 两档（在开发者工具里面也可以查看，Network - size 里面就会提示），将请求的 URL 作为 key，响应 / 资源作为 value，进行保存。



| 机制         | 适用场景        | 作用范围   | 生命周期                                           | 适用关键字               |
| ------------ | --------------- | ---------- | -------------------------------------------------- | ------------------------ |
| **DOM 引用** | JavaScript 变量 | 当前页面   | 页面刷新即失效                                     | `window`、`document`     |
| **内存缓存** | 静态资源加速    | 当前页面   | 浏览器关闭即失效（页面关闭需要考虑多页面共享情况） | `Cache-Control: max-age` |
| **磁盘缓存** | 资源跨会话缓存  | 整个浏览器 | 取决于 `Cache-Control` 过期时间                    | `Cache-Control: public`  |

##### 缓存行为

同样，按照不同的行为，缓存也分为 **强制缓存** 和 **协商缓存** 两种机制，区别是找到资源的时候是否会去找服务端询问。

强制缓存：一经缓存，没有到期则不发起请求。

​	（**响应头**字段：**Cache-Control**: public, max-age=86400（**长度是秒**），时间长短；搭配 **expires**（GMT 时间））

协商缓存：每次发现资源找**服务端**请求，得到 **304（Not Modified）**才会使用。

​	（**响应头**字段：**Last-Modified**：服务器上资源的最后修改时间。浏览器通过 `If-Modified-Since` **请求**头携带它的值来检查资源是否修改。

​		**ETag**：资源的唯一标识符。浏览器通过 `If-None-Match` **请求**头携带它的**值**来检查资源的标识符是否与服务器一致。

###### **Q：一个重大问题的热更新发版的时候，如何确保用户加载的时候，把出错的缓存覆盖掉？**

1. **服务端**修改 ETag，请求 `If-None-Match` 返回 200（并不是 304），需要覆盖。
2. 对 CSS / JS 添加版本号，每次发版资源改变，彻底避免缓存问题。
3. 使用 Cache-Control: no-cache 直接 bypass 强制缓存，强制要求**协商**。

##### 恶趣味的想法

浏览器为了保障用户体验，不会主动清除内容。而我可以把缓存字段设置成 `Cache-Control: max-age=10（一个很短的时间）, must-revalidate`，这样用户一旦不慎断网，内容就会全部被清理掉。

## 开发者

### 为啥不能想请求哪就请求哪？

同源策略在阻挡这个过程。假设一个完全没有做任何信息安全策略的后端在工作，有一个伪造的前端跑起来，用户在一个假网站上访问域名，伪造请求来抓取重要信息，响应没有**拦截**就返回到用户自己的设备上（例如，用户登录了银行网站，恶意网站如果能获取到银行 API 的访问权限），这个效果有点过于炸裂了。

当然，也不是说有了同源策略就可以彻底解决问题，它是浏览器最核心的机制但只是第一步，就像是阻拦入侵的最外层大门一样。

同源策略包含 **协议 - 域名 - 端口**。只有三者都同源才可以避免跨域问题。（https://example.com:8080 vs https://example.com:8080/api/getuser，https、example.com、8080 缺一不可）

顾名思义的人可能会觉得一个问题很蹊跷，为什么跨域跨的是前端服务器而不是用户的访问 IP，按 F12 进 Request Header 里面 Origin 写的也是前端网页。另一个蹊跷的就是「按钮被加载到浏览器，为什么是前端服务器在处理请求？」，其实两个迷思的原因是**浏览器本身的工作机制使然：**

在浏览器发起请求时，**浏览器会自动将请求的 `Origin` 头设置为当前页面的域名**，即你在浏览器地址栏看到的域名。这是一个浏览器级别的行为，用于标识请求的来源。

- 前端应用部署在 `https://example.com`，那么请求头会包含：

  `Origin: https://example.com`

  这个 `Origin` 表明请求是从 `https://example.com` 发起的。

- **用户的 IP 地址**会影响服务器对请求的响应（例如访问控制、地域限制等），但与浏览器发起请求的域名无关。

「按钮被加载到浏览器，为什么是前端服务器在处理请求？」的错觉也就是这样产生的，当用户点击按钮时，**JavaScript 代码在用户的浏览器中运行**，显然你按钮都加载到浏览器上了，包括下载下来的 fetch 代码，它们的行为是用户发起的，**网络请求同样也从用户浏览器发起**。只是因为这个 Origin 头的设置，显得「前端服务器在处理」而已。

同时，**localStorage** 和 **sessionStorage** 的设定也遵从同源策略。

#### CORS

本质上是白名单，直接处理前端请求的服务器配置，包含一系列的标头。例：**access-control-allow-origin**：白名单对应的域名（在 CORS 插件里面只需要设置 origin）、access-control-allow-**methods**、access-control-allow-**headers**（复杂的标头，例如  Authorization、X-Requested-With、X-Custom-Header、**Content-Type: application/json（只有 text/plain 等几种情形可以默认允许）**、Accept-Language-Type... 等等）

#### JSONP

### 前端框架做了什么？

上面「浏览器处理」的部分也算是经典八股了。对于开发者来说，随着前端框架的发展，在 0224 年需要直接嗯造 DOM 的情况并不多。使用 `querySelector`、`getElementById`、`createElement` 和 `textContent ` 这些 DOM API 方法很麻烦，我们希望有一种能够间接操作 DOM 的、声明式的语法；同时摆脱传统 HTML + CSS + JS 东一榔头西一棒槌的结构，加强它的组件化程度。所以这就是使用前端框架最直观的理由。

```HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div id="my-component" class="my-component"></div>

    <script>
        // JavaScript 代码
        function generateContent() {
            // 动态生成内容的数组
            const content = [1, 2, 3, 4, 5, 6, 7];

            // 获取容器元素
            const container = document.getElementById('my-component');

            // 清空容器
            container.innerHTML = '';

            // 生成 HTML 内容并插入容器
            content.forEach(i => {
                const p = document.createElement('p');
                p.textContent = `这是第 ${i} 排内容`;
                container.appendChild(p);
            });
        }

        // 调用函数以生成内容
        generateContent();
    </script>
</body>
</html>
```

```jsx
function MyComponent(){
  const content = [1, 2, 3, 4, 5, 6, 7];
  return(
    <div className = "my-component">
      {content.map(i => (
        <p key={i}>这是第 {i} 排内容</p>
      ))}
  	</div>
  )
}
```

前后对比，直观程度一目了然不言而喻。

React 从 16 开始的迭代带来了另外一个很重要的优势，就是「**快速响应**」。JS 当中，GUI 渲染线程和 JS 的线程是互斥的，**JS 脚本执行**和**浏览器布局、绘制**不能同时执行。一旦这三个过程加在一起超过了 16.6ms（主流浏览器刷新频率）就会造成掉帧和卡顿。

#### Fiber、render

16 以前的 React 只能递归遍历、不可中断的访问 VDOM 树，而现在 Fiber 就解决了这个问题。

React 16 开始，架构分为了三部分：**Scheduler**（调度器，判断任务优先级，高优先级优先进入 Reconciler）、**Reconciler**（协调器，找出变化组件并打标记）和 **Renderer**（渲染器，Fiber to VDOM，渲染变化的组件（上个阶段已有标记）到页面上）。它体现在数据结构上就是 `Fiber` 架构，来实现**异步可中断更新**。

**（render = reconciler + scheduler，代表生命周期五步的前两步、和 commit = renderer，useEffect 对应的后三步，这两个阶段就是 React Fiber 以来渲染的主要流程。）**

```ts
function FiberNode(
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode,
) {
      
  // 静态数据结构的部分，保存组件相关信息
  this.tag = tag;					// Fiber对应组件的类型 Function/Class/Host...
  this.key = key;					// key属性
  this.elementType = null;	
  this.type = null;					// 对于 FunctionComponent，指函数本身
  this.stateNode = null;			// Fiber对应的真实DOM节点

  // 用于连接其他 Fiber 节点形成 Fiber 树
  this.return = null;		// 指向父级 Fiber 节点
  this.child = null;		// 指向子 Fiber 节点
  this.sibling = null;		// 指向右边第一个兄弟 Fiber 节点
  this.index = 0;

  this.ref = null;

  // 作为动态的工作单元的属性 —— 保存本次更新造成的状态改变相关信息
  this.pendingProps = pendingProps;	// props
  this.memoizedProps = null;
  this.updateQueue = null;		// 存储 useEffect 的 effect 的环状链表。
  this.memoizedState = null;	// hook 组成单向链表挂载的位置。mount 的阶段就完成了这个过程，所以不能在条件语句里面调用 hook。
  this.dependencies = null;

  this.mode = mode;

  // Effects
  this.flags = NoFlags;
  this.subtreeFlags = NoFlags;
  this.deletions = null;

  // 调度优先级相关
  this.lanes = NoLanes;
  this.childLanes = NoLanes;

  // 指向该fiber在另一次更新时对应的fiber
  this.alternate = null;
}
```

在渲染过程（`reactDOM.render`）当中，

VDOM 树被转换成 Fiber 链表，然后通过 `document.createElement` / `document.createTextNode` 转换成真实的 DOM 实例。

然后将 Fiber 节点和它的 `pendingProps` **关联**到真实 dom 的属性上，反过来把真实 DOM 实例**关联**回 Fiber 的 `stateNode` 上。

最后，遍历 `pendingProps`，从而得到渲染。

渲染结束之后，只要成功的关联 `DOM` 和 `fiber`，就会实现事件的绑定。

在 render 结束之后，commit 阶段就开始 mount 了，这个时候会加载 Hooks。

#### mount

而 Hook 自己又是一个链表结构，在 **mount** 的时候就会挂靠在 Fiber 上面：

```ts
const hook: Hook = {
  memoizedState: null,	// 当前需要保存的值，useState

  baseState: null,
  baseQueue: null,	// 由于之前某些高优先级任务导致更新中断，baseQueue 记录的就是尚未处理的最后一个 update
  queue: null,	// 内部存储调用 setValue 产生的 update 更新信息，是个环状单向链表

  next: null,		// 下一个hook
};
```

每一种 use 系列 Hook 都有自己的 `mount` 方法。在这个方法中，创建一个 Hook 对象需要执行 `mountWorkInProgressHook`，它会去寻找这个链表的 Hook 对象，接到它的 `next` 下；如果没有，就接到当前 `fiber` 节点的 `memoizedState` 上。

Q：「为什么自定义 Hook 不能使用 if else / 提前 return / 改变顺序」

A：「自定义 Hook 在 update 的时候会调用 `updateWorkInProgressHook` 获取当前 Hook 的对象，还是会从当前 `fiber` 节点的 `memoizedState` 上找 Hook，它的顺序在 mount 的时候已经创建好了，改变顺序就会拿错。」

### 服务端渲染

服务端渲染是从 `renderToString` 到浏览器 `hydrate` 的一套链路。

#### 同构

React 的同构是指一套代码可以在客户端和服务端执行。服务端有一个重要的 API： `ReactDOMServer.renderToString(element: ReactElement)` ，它可以把 React 组件渲染成静态的（HTML）标签，**发送到客户端。**

在这个过程当中，各种事件绑定和动态渲染被去掉，**只保留最后的静态 HTML**（之前看到一篇文章用「三体人」来形容服务端渲染的链路，这怎么跟乱纪元一样 hhhhhh），如果用 React 的生命周期机制来描述，那就是 `constructor` 一直到 `render` 的全过程被保留了。

#### 水合

含有「三体人」的图纸（指 React 代码）被**组装**成了三体人干，接下来要让它恢复活力了。在客户端**下载 JavaScript** 文件之后，这个时候就启用了**水合**机制 —— `ReactDOM.hydrate`。在它执行之前，因为服务端已经返回了 HTML 内容，浏览器会立马显示内容。

1. 客户端遍历服务端生成的 HTML（`DOM 树`），并且把它和客户端 React 的输出（`workInProgress` 树）进行**比对**。
   - 如果**和客户端 React 输出一致**，则使用现有 DOM，**关联 Fiber 节点。**
   - 否则对比兄弟节点是否能够混合，如果失败，标记 `isHydrating = false` ，重新**创建 DOM 实例。**
2. React 绑定事件处理函数（点击 / 输入输出），赋予组件可交互性。（和客户端渲染的时候一样，`listenToAllSupportedEvents` API）

所以省流就是，水合本质上就是比对之后关联节点属性，一旦成功关联 DOM 和 Fiber，事件处理就实现了激活。这就是三体人干实现复苏的原理。

### 服务端渲染、静态内容生成与 SEO

为了页面加载更快，已经采取了服务端渲染。但是有什么**更快**的办法，甚至我希望在页面访问的时候就直接给我一个现成的页面呢？

这里就可以引入页面预制菜 —— **SSG**。（Next.js，getStaticProps）

| **方式** | HTML 存储到哪里            | 服务器角色                       | 特点                          |
| -------- | -------------------------- | -------------------------------- | ----------------------------- |
| **SSG**  | 服务器静态存储（CDN/磁盘） | 仅提供静态文件                   | 预渲染，最快，适合 **SEO**    |
| **SSR**  | 不存储，**请求时生成**     | 服务器动态渲染                   | 实时更新，但响应速度比 SSG 慢 |
| **CSR**  | 仅存最小 HTML + JS         | 提供静态文件，API 服务器单独处理 | 交互快，但 SEO 需要优化       |

搜索引擎是一个复杂的机制，而服务端渲染带来的优点主要在两点上：

1. 由上面彻底理解，SSR 乃至 SSG 带来一个更完善的**HTML**，**开盖即食**。而传统搜索引擎的爬虫可能并没有能力处理 CSR 带来的 JS，有的时候只爬到一个空壳子。
2. 而 SSR 这样，在 **FCP**、**FP** 等参数上存在优势，如今的搜索引擎的爬虫虽然可以处理 CSR 了，但他也会按照这些参数做出**排名**。

附 SEO 工作机制：

SEO 的目标是让搜索引擎更好地理解网页内容，从而提高搜索排名。主要涉及以下几个方面：

###### **（1）搜索引擎的爬取（Crawling）**

- 搜索引擎使用爬虫（Crawler，也叫 Spider 或 Bot）访问网站并读取 HTML 页面内容。
- 爬虫通过 **网站地图（Sitemap）** 和 **内部链接** 发现新的页面，并按照 robots.txt 文件的指引决定是否爬取某些页面。

###### **（2）索引（Indexing）**

- 爬虫获取的 HTML 内容会被解析，并存储到搜索引擎的数据库中，构建索引。
- 结构化数据（如 `schema.org` 标记）有助于搜索引擎更好地理解页面的语义。

###### **（3）排名（Ranking）**

- 搜索引擎根据一系列 **算法** 评估页面的 **相关性** 和 **质量**，决定排名。
- 影响排名的核心因素：
  - **内容质量**（是否与搜索词相关，是否原创）
  - **页面权重**（外部链接、内部链接）
  - **用户体验**（页面加载速度、移动端适配、交互体验）
  - **SEO 友好性**（meta 标签，Next.js `next/head` 自定义标签、H1-H6 结构、Alt 标签）

Q：某 *** 论坛是怎么做到污染了劳资每个技术搜索内容的？

A：服务端渲染 + **静态内容生成**文章，开盖即食的 SEO 友好要素 + 每个文章独立链接（/[articleID]）+ Next.js 静态生成，一切为了 SEO 打造。

### 小结

回顾这部分内容，React 渲染流程省流一下，就是这样一个 timeline：

阶段 `render` =（调度器 + 协调器）= 生命周期的 `constructor` + `render` = reactDOM.render = ReactDOMServer.renderToString + reactDOM.hydrate，这个时候绑定 DOM 和 Fiber 节点，实现交互。

阶段 `commit` = （渲染器） = 生命周期 `mount` 系列，mount 中把 Hook 以链表形式插入 Fiber，这个阶段和 CSR / SSR 无关。

### 测试图片

![72278710_p0_master1200_waifu2x_art_scale](/Users/fty/Pictures/nijigen/72278710_p0_master1200_waifu2x_art_scale.png)测试一下这个图片怎么解析（

