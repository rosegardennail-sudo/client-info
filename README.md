# Rose Garden Nail 顾客管理网站

这是一个纯前端、可以直接上传到 GitHub Pages 的顾客记录网站。

## 功能

- 首页显示顾客总数、总来访次数、本月来访次数
- 添加新顾客
- 顾客资料表格
- 搜索顾客
- 管理模式下编辑或删除顾客
- 点进顾客查看完整资料
- 添加每次来访的项目、技师、金额、小费和备注
- 来访次数自动统计
- 浅粉色和米色主题
- 手机和电脑都可以使用

## 数据保存说明

数据使用浏览器的 `localStorage` 保存：

- 关闭浏览器后记录不会消失
- 刷新页面后记录不会消失
- 但是换手机、换电脑、换浏览器，数据不会自动同步
- 清除浏览器网站数据后，记录会被删除

如果以后需要多个员工在不同手机上共享同一份顾客资料，需要再连接 Firebase 或 Supabase 云数据库。

## 上传到 GitHub Pages

1. 在 GitHub 新建一个 repository，例如 `rose-garden-customer-manager`
2. 把 `index.html`、`styles.css`、`app.js` 上传到 repository 根目录
3. 打开 repository 的 `Settings`
4. 点击 `Pages`
5. 在 `Build and deployment` 里选择 `Deploy from a branch`
6. Branch 选择 `main`，文件夹选择 `/root`
7. 保存后等待 GitHub 生成网址

## 本地测试

直接双击打开 `index.html` 即可使用。
