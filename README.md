# Rose Garden Nail 顾客管理网站

## 上传 GitHub Pages
1. 解压 ZIP。
2. 将 `index.html`、`styles.css`、`app.js` 一起上传到 GitHub 仓库根目录。
3. GitHub 仓库打开 Settings → Pages。
4. Source 选择 Deploy from a branch，Branch 选择 main / root，保存。

## 功能
- 手机优先卡片式界面
- 顾客姓名、电话号码、性别、特征、常找技师、注意事项、小费习惯
- 按姓名、电话号码、技师、特征、备注和历史项目搜索
- 添加、编辑、删除顾客
- 记录每次项目、技师、金额、小费和备注
- 自动统计来访次数、累计消费、累计小费
- localStorage 本地保存，关闭浏览器不会消失

## 重要说明
数据保存在当前设备的当前浏览器中。换手机、换浏览器或清除网站数据后不会同步。若要多人跨设备使用，需要以后接入 Firebase 或 Supabase。

首次打开含 3 条演示顾客资料，点右上角“管理”即可删除。
