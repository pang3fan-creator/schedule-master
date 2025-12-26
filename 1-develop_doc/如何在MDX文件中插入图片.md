## 功能已添加：MDX 文件中的图片支持

现在你可以在 MDX 文件中使用标准的 Markdown 图片语法：

```
![图片描述文字](/path/to/image.png)
```

### 使用方式

1. **本地图片**（推荐）- 将图片放在 `public` 文件夹中：

   ```
   ![团队协作示意图](/blog/team-collaboration.png)
   ```

2. **外部图片链接**：

   ```
   ![示例图片](https://example.com/image.jpg)
   ```

### 渲染效果

- 图片会有圆角边框和阴影
- 如果提供了 alt 文字，会显示为图片下方的说明文字（caption）
- 使用懒加载优化性能

### 示例

```
## The Results: Measureable Impact

![Acme团队使用TrySchedule后的效率提升图](/blog/acme-results-chart.png)

After 90 days of using **TrySchedule**, the results exceeded all expectations:
```

然后将对应的图片放在 `public/blog/acme-results-chart.png` 路径即可。