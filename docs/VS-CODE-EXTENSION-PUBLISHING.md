# VS Code 插件打包与发布

本文记录 VS Code 插件本地打包、验证和发布到 Visual Studio Marketplace 的通用流程。已有插件不需要重新运行脚手架；只需按其构建要求打包。文中的名称和版本均为示例。

## 一、准备

1. 安装 Node.js 和 npm。选择与最新版 `@vscode/vsce` 兼容的 Node.js 版本；已有项目则优先遵循项目指定的版本和锁文件。
2. 可选：新建主题或其他插件时，安装脚手架并执行生成器：

   ```bash
   npm install -g yo generator-code
   yo code
   ```

   按提示选择插件类型，例如 `New Color Theme`。脚手架不是发布的必要条件。
3. 安装发布工具，或使用项目本地安装的 `@vscode/vsce`：

   ```bash
   npm install -g @vscode/vsce
   vsce --version
   ```

4. 使用 Microsoft 账号登录 [Marketplace 管理页](https://marketplace.visualstudio.com/manage)，创建 Publisher，或请现有 Publisher 的管理员添加你的账号。Publisher ID 是插件标识的一部分，发布前应确定好；显示名称可以与 ID 不同。

## 二、检查插件内容

插件根目录的 `package.json` 至少应包含正确的 `name`、`publisher`、`version`、`engines.vscode` 和插件贡献配置。Marketplace 的插件 ID 是 `publisher.name`，不是 `displayName`。每次发布更新应使用尚未发布过的新版本号。

例如，Publisher 为 `your-publisher`、插件名为 `your-extension` 时，插件 ID 为 `your-publisher.your-extension`。

发布前还应检查：

- README、更新日志、图标、仓库链接及许可证和第三方素材授权；相对图片链接要确保 Marketplace 可访问。
- `engines.vscode` 是否覆盖实际支持的 VS Code 版本；主题、图标等 `contributes` 路径是否存在。
- `.vscodeignore` 是否排除测试、开发文件和敏感文件，同时保留运行必需的资源。不要把 Token、`.env` 等秘密打进包里。
- 有代码的插件需先按项目说明安装依赖、编译并运行测试；纯主题通常无需编译。

## 三、打包和本地验证

在插件项目根目录运行：

```bash
vsce ls
vsce package
```

`vsce ls` 用于检查将打入的文件，`vsce package` 默认生成类似 `your-extension-1.0.0.vsix` 的文件。查看输出并确认插件运行所需资源存在、敏感文件不存在。已有同名 VSIX 可能来自以前的构建，不能仅凭其存在判断本次打包成功。

安装刚生成的文件进行验证：

```bash
code --install-extension your-extension-1.0.0.vsix
```

也可在 VS Code 扩展视图的 `...` 菜单中选择“从 VSIX 安装”。如果 `code` 不在 PATH，使用菜单即可。重新加载窗口，检查扩展版本和预期功能；有条件时在干净的 VS Code 配置中再测一次。开发时也可以按 `F5` 启动扩展开发宿主，但它不能替代安装最终 VSIX 的验证。

## 四、Token 与发布权限

本地打包和本地安装**不需要 Token**。通过网页手动上传 VSIX 使用登录账号及其 Publisher 权限，通常也不需要生成 PAT。使用 `vsce` 命令行发布时，按微软的发布文档创建 Azure DevOps Personal Access Token（PAT）：

1. 使用具有目标 Publisher 发布权限的 Microsoft 账号登录 [Azure DevOps](https://dev.azure.com/)，在用户设置中找到 **Personal access tokens**，选择创建 Token。若组织策略禁止创建或限制作用域，需要联系组织管理员。
2. Organization 按微软 VS Code 发布指南选择 **All accessible organizations**；设置名称和尽可能短的有效期。
3. 选择自定义作用域，在 **Marketplace** 下勾选 **Manage**（界面可能需先选择“显示所有作用域”）。不要为此额外授予代码仓库、构建或其他无关权限。
4. 创建后妥善保存；Token 通常只显示一次。PAT 权限不能代替 Marketplace Publisher 的成员权限，两者都必须满足。

令牌过期时重新生成并更新本地凭据或 CI Secret；泄露时立即在 Azure DevOps 撤销。不要将 Token 写入源码、文档、VSIX、日志或命令行参数；也不要将 Marketplace PAT 与 GitHub Token 混淆。

## 五、发布和更新

**方式 A：网页上传已验证的包。** 打开 [Marketplace 管理页](https://marketplace.visualstudio.com/manage)，选择对应 Publisher，按页面提示创建插件或更新现有插件并上传 VSIX。首次发布和后续更新的入口以页面实际显示为准。

**方式 B：命令行发布已验证的包。** 在终端交互式登录，按提示输入 PAT：

```bash
vsce login your-publisher
vsce publish --packagePath your-extension-1.0.0.vsix
```

将 Publisher 和文件名替换为自己的值；`--packagePath` 使用已经检查并验证的 VSIX，避免发布时重新打包出不同内容。本地不再需要凭据时可运行 `vsce logout your-publisher`。

更新时修改 `package.json` 的版本号和更新日志，重新构建、打包、安装验证，再选择上述任一方式上传。发布后在 Marketplace 页面确认插件 ID、版本、说明和资源，并从 Marketplace 安装验证；展示或搜索结果可能有延迟。

## 六、其他注意事项

- 包含原生模块或平台专用二进制文件的插件，需要根据目标平台构建并验证；平台专用包的发布方式参见官方文档。
- GitHub Release 和 Marketplace 是不同的发布渠道，GitHub 仓库权限不能代替 Marketplace 发布权限。
- 发布前确认插件代码和第三方组件的许可证允许分发；有授权限制时，先取得必要授权或移除受限内容。

## 官方参考

- [Publishing Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [Extension Manifest](https://code.visualstudio.com/api/references/extension-manifest)
- [Azure DevOps PAT 管理](https://learn.microsoft.com/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate)
