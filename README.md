# 腾讯微校应用：今天

今天：校历第几周？开学多少天？还有多少天放假？

## 安装 & 启动

前提，`node` 的版本应 `>= 7.6.0` （为了支持 async/await 等新语法），并且，你已安装 `Yarn`（一种依赖管理工具）和 `MongoDB`（一种文档导向的数据库管理系统）。

安装与启动步骤如下：

1. 将 `config.js.example` 更名为 `config.js` ，并配置好相关项。

2. 安装必要的依赖：

    ```shell
    yarn run install:required-dependencies
    ```

3. 编译前端资源：
    ```shell
    yarn run build:front-end
    ```

4. 选择一个你中意的进程管理工具启动应用，比如 `PM2` ：
    ```shell
    pm2 start index.js
    ```
