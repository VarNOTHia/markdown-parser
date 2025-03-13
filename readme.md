造的一个转换 `markdown` 到 `HTML` 的轮子。

### 工作机制
#### 数据流
将 markdown 文件作为字符串读取。
#### 函数式 handler
以纯函数的方式给每种 Markdown 语法设计解析，按照 标题 - Img - 代码块 - 内联代码 - 表格 - 斜体粗体 构建**管道**，对数据流进行逐步替代，从而生成 HTML。
#### 主题支持
生成的 HTML，不同的标签会绑定对应的 className，这样就可以设计不同的主题。
### TODO
1. 支持常规列表（就像是这一项的效果一样）等其他语法解析。
2. 继续解耦逻辑，拆分 `rules` 和 `handlers`。
3. 构建中间代码生成，把 `replace` 过程拆分，从而避免互相替代的问题。
