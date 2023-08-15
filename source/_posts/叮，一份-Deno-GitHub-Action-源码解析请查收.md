---
title: 叮，一份 Deno GitHub Action 源码解析请查收
description: GitHub Action 是 GitHub 官方的 CI/CD 工具，相较于 Travis CI 和 Circle CI，更轻量和易于扩展，marketplace 中有大量社区贡献的插件。各大开源项目都纷纷转向使用 GitHub Action 作为持续集成的工具，比如本文的主角 Deno。
date: 2023-04-19 18:50:31
categories:
  - [Deno]
tags:
  - GitHub Action
  - CI/CD
  - Travis CI
  - Circle CI
---

GitHub Action 是 GitHub 官方的 CI/CD 工具，相较于 Travis CI 和 Circle CI，更轻量和易于扩展，[marketplace](https://github.com/marketplace?type=actions) 中有大量社区贡献的插件。各大开源项目都纷纷转向使用 GitHub Action 作为持续集成的工具，比如本文的主角 Deno。

GitHub 的文档中有很多概念写的十分晦涩，有些翻译很僵硬影响理解。截止发稿时，Deno 的 [ci.yml](https://github.com/youngjuning/deno/blob/master/.github/workflows/ci.yml) 文件有 323 行，是一个很好的学习范本。想要对 GitHub Action 有个了解或对 Deno 的持续集成部分感兴趣的同学都可以一起来探究下。

## Action 结构

> 注意：GitHub Action 的 ci 脚本需要放在 `.github/workflows` 文件夹下

```yml
name: ci

on: [push, pull_request]

jobs:
```

- `name`：工作流程的名称。GitHub 在仓库的操作页面上显示工作流程的名称。如果省略 name，GitHub 将其设置为相对于仓库根目录的工作流程文件路径。
- `on`：必填。是[触发工作流程的事件](https://docs.github.com/cn/articles/events-that-trigger-workflows)。Deno 中 的 `[push,pull_request]` 代表有主分支有提交代码或 pull_request 时触发 CI 流程。
- `jobs`：工作流程运行包括一项或多项作业。作业默认是并行运行。Deno 中只有一个 job —— `build`

## build job

```yml
jobs:
  build:
    name: ${{ matrix.kind }} ${{ matrix.os }}
    if: |
      github.event_name == 'push' ||
      !startsWith(github.event.pull_request.head.label, 'denoland:')
    runs-on: ${{ matrix.os }}
    timeout-minutes: 60
    strategy:
      # ...
    env:
      # ...
    steps:
      # ...
```

- `name：作业显示在 GitHub 上的名称。
  - `matrix`：用于访问为当前作业配置的矩阵参数。例如，Deno 使用 kind 和 os 版本配置矩阵构建，matrix 上下文对象将包含当前作业的 kind 和 os 版本。
- `if`：您可以使用 if 条件阻止作业在条件得到满足之前运行。Deno 中判断 `github.event_name` 等于 `"push"` 或 `label` 以 `"denoland:"` 开头的 `pull_request` 事件
- `runs-on`：**必填**。 任务运行的机器。机器可以是 GitHub 托管的运行器或自托管的运行器。定义操作系统矩阵时，必须将 `runs-on` 的值设置为您定义的 `matrix.os` 上下文属性。Deno 是跨平台的，因此创建了矩阵以在多个运行器操作系统上运行构建工作流程。
- `timeout-minutes`: 在 GitHub 自动取消运行之前可让作业运行的最大分钟数。 默认值：360。Deno 中设置为 60 来尽早暴露问题。
- `strategy`：策略，用于创建作业的构建矩阵。您可以定义要在其中运行每项作业的不同变种。这可能不太好理解，在 Deno 中，其实就是为了同时构建出多个平台的产物。后面的章节我们单独解析 Deno 中具体的应用。
- `env`：环境变量的 `map` 可用于作业中的所有步骤。 您也可以设置整个工作流程或单个步骤的环境变量。后面章节我们单独解析 Deno 中具体的应用。
- `steps`：作业包含一系列任务，称为 steps。步骤可以运行命令、运行设置任务，或者运行您的仓库、公共仓库中的操作或 Docker 注册表中发布的操作。后面章节我们单独解析 Deno 中具体的应用。

## strategy 策略

```yml
strategy:
  matrix:
    include:
      - os: macos-10.15
        kind: test_release
      - os: windows-2019
        kind: test_release
      - os: ${{ github.repository == 'denoland/deno' && 'ubuntu-latest' || 'ubuntu-18.04' }}
        kind: test_release
      - os: ${{ github.repository == 'denoland/deno' && 'ubuntu-latest' || 'ubuntu-18.04' }}
        kind: test_debug
      - os: ${{ github.repository == 'denoland/deno' && 'ubuntu-latest' || 'ubuntu-18.04' }}
        kind: bench
      - os: ${{ github.repository == 'denoland/deno' && 'ubuntu-latest' || 'ubuntu-18.04' }}
        kind: lint

  # Always run master branch builds to completion. This allows the cache to
  # stay mostly up-to-date in situations where a single job fails due to
  # e.g. a flaky test.
  # Don't fast-fail on tag build because publishing binaries shouldn't be
  # prevented if 'cargo publish' fails (which can be a false negative).
  fail-fast: ${{ github.event_name == 'pull_request' || (github.ref !=
    'refs/heads/master' && !startsWith(github.ref, 'refs/tags/')) }}
```

- `strategy`：策略会为您的工作创建构建矩阵。您可以定义不同的变体来运行每个作业。这可能不太好理解，在 Deno 中，其实就是为了同时构建出多个平台的产物。
  - `matrix`：您可以定义不同作业配置的矩阵。Deno 中定义了 6 个矩阵。它们分别用来执行测试、调试、压测、lint 等工作
    - `include`：使用 `matrix` 只能定义使用某个 os，没办法添加其他配置。用 `include` 可以解决这个问题
  - `fail-fast`：设置为 `true` 时，如果任何 `matrix` 作业失败，GitHub 将取消所有进行中的作业。 默认值：`true`。ry 在这个 [commit](https://github.com/denoland/deno/commit/46d5843f753548415c87f3c8a868bba49c203b92#diff-b803fcb7f17ed9235f1e5cb1fcd2f5d3b2838429d4368ae4c57ce4436577f03f) 中删除了 `cargo publish`，从注释中看来这里的 `fail-fast` 配置已经是冗余的了，我顺手就是一个 fork、commit、[pr](https://github.com/denoland/deno/pull/9449) 三连。

**插曲**

`${{ github.repository == 'denoland/deno' && 'ubuntu-latest' || 'ubuntu-18.04' }}` 这种写法我看到时很疑惑，直接取 'ubuntu-latest' 不行吗？如果不行是为什么呢？抱着求真的态度，我翻阅到是在这个 [commit](https://github.com/denoland/deno/commit/1a27c19c583fa6bd1eaaec93b513bfbac37fc53c#diff-b803fcb7f17ed9235f1e5cb1fcd2f5d3b2838429d4368ae4c57ce4436577f03f) 加入的这个判断，在一番询问后得到了下面的答案：

![紫竹](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bf73fe62dcbc48f69272f97a1a139444~tplv-k3u1fbpfcp-zoom-1.image)

在 justjavac 大佬那里也得到了印证：

![紫竹](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/04d3d4f533e74d0795d70e5cffd69699~tplv-k3u1fbpfcp-zoom-1.image)

然后我还有个疑问是为什么不使用三元表达式，是 YAML 语法不支持吗？

![紫竹](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b76f02c91de841d587084fbc73a2cca3~tplv-k3u1fbpfcp-zoom-1.image)

## env 环境变量

```yml
env:
  CARGO_INCREMENTAL: 0
  RUST_BACKTRACE: full
  CARGO_TERM_COLOR: always
```

- `env`：环境变量的 `map` 可用于作业中的所有步骤。您也可以设置整个工作流程或单个步骤的环境变量。代码中的三个变量是整个流程的环境变量。
  - `CARGO_INCREMENTAL`、`CARGO_TERM_COLOR`、`RUST_BACKTRACE` 是配置给 Cargo 用的，具体的参考[environment-variables-cargo-reads](https://doc.rust-lang.org/cargo/reference/environment-variables.html#environment-variables-cargo-reads)，这里不展开解读了。

## steps 步骤

Deno 的 CI 中截止写下这段话时有 35 个步骤，相当考验我继续解读的勇气。。。

> 作业包含一系列任务，称为 `steps`。步骤可以运行命令、运行设置任务，或者运行您的仓库、公共仓库中的操作或 Docker 注册表中发布的操作。并非所有步骤都会运行操作，但所有操作都会作为步骤运行。每个步骤在运行器环境中以其自己的进程运行，且可以访问工作区和文件系统。因为步骤以自己的进程运行，所以步骤之间不会保留环境变量的更改。 GitHub 提供内置的步骤来设置和完成作业。—— 文档

### 1、Configure git

```yml
- name: Configure git
  run: git config --global core.symlinks true
```

- `git config --global core.symlinks true`：克隆一个包含子模块和符号链接的存储库。这里是为了兼容 windows，详细的解释请查看 [git bash symbolic links on windows](https://github.community/t/git-bash-symbolic-links-on-windows/522)

### 2、Clone repository

```yml
- name: Clone repository
  uses: actions/checkout@v2
  with:
    # 使用 `depth> 1`，因为有时我们需要重新构建 master 分支，如果 checkout 太浅，其他 commits push 之后将不可能重新构建。
    fetch-depth: 5
    submodules: true
```

- `actions/checkout@v2`：checkout action 很常用
  - `fetch-depth: 5`：默认情况下，仅提取一次提交。这里设置的 5，就会提取最近的 5 次提交。
  - `submodules: true`：构建需要把子模块也获取到，Deno 中包含了子模块。

### 3、Create source tarballs (release, linux)

> 创建源文件压缩包 (release, linux)

```yml
- name: Create source tarballs (release, linux)
  if: |
    startsWith(matrix.os, 'ubuntu') &&
    matrix.kind == 'test_release' &&
    github.repository == 'denoland/deno' &&
    startsWith(github.ref, 'refs/tags/')
  run: |
    mkdir -p target/release
    tar --exclude=.cargo_home --exclude=".git*" --exclude=target --exclude=third_party/prebuilt -czvf target/release/deno_src.tar.gz -C .. deno
```

- 执行条件：构建矩阵 os 是 `'ubuntu'`、kind 是 `'test_release'`、仓库是 `'denoland/deno'`、本地执行 `git push --tags` 或 `git push origin v0.0.1`
- `run`：其实发 release 的时候会自动打包源文件，这里之所以多打一个，是因为要忽略很多文件夹，打出纯 deno 的源文件

### 4、Install rust

> 安装 rust

```yml
- name: Install rust
  uses: hecrj/setup-rust-action@v1
  with:
    rust-version: 1.49.0
```

- Deno 源码是 RUST 编写的，所以是用 `hecrj/setup-rust-action@v1`，每个语言都有自己的 `setup`，商店里能搜到 [358](https://github.com/marketplace?type=actions&query=setup) 条记录。

### 5、Install clippy and rustfmt

```yml
- name: Install clippy and rustfmt
  if: matrix.kind == 'lint'
  run: |
    rustup component add clippy
    rustup component add rustfmt
```

### 6、Install Deno（非 Windows）

```yml
- name: Install Deno
  if: |
    !startsWith(matrix.os, 'windows')
  run: |-
    curl -fsSL https://deno.land/x/install/install.sh | sh -s v1.5.1
    echo "$HOME/.deno/bin" >> $GITHUB_PATH
```

- 执行条件：构建矩阵 os 不是 windows
- `run`
  - `|-` 和 `|`是 yaml 的语法。这样，您就可以有效地声明多行 yaml 字符串。语法详情查看[这里](https://yaml-multiline.info/)
  - `curl -fsSL https://deno.land/x/install/install.sh | sh -s v1.5.1` 安装 deno（这里应该可以 pr）
  - `echo "$HOME/.deno/bin" >> $GITHUB_PATH`：设置环境变量，设置的指向文件系统上某个位置的任何新环境变量都应该有 `_PATH` 后缀。

### 7、Install Deno (Windows)

```yml
- name: Install Deno (Windows)
  if: startsWith(matrix.os, 'windows')
  run: |-
    curl -fsSL https://deno.land/x/install/install.sh | sh -s v1.5.1
    echo "$HOME/.deno/bin" >> $env:GITHUB_PATH
```

- 执行条件：构建矩阵 os 是 windows
- `run`：和上文一样

### 8、Install Python

> 安装 python

```yml
- name: Install Python
  uses: actions/setup-python@v1
  with:
    python-version: '3.8'
    architecture: x64
```

### 9、Install Node

> 安装 Node

```yml
- name: Install Node
  uses: actions/setup-node@v2
  with:
    node-version: '14'
    check-latest: true
```

### 10、Remove unused versions of Python

> 删除没有用到的 Python 版本

```yml
- name: Remove unused versions of Python
  if: startsWith(matrix.os, 'windows')
  run: |-
    $env:PATH -split ";" |
      Where-Object { Test-Path "$_\python.exe" } |
      Select-Object -Skip 1 |
      ForEach-Object { Move-Item "$_" "$_.disabled" }
```

### 11、Setup gcloud (unix)

> 安装 Google Cloud SDK（unix）

```yml
- name: Setup gcloud (unix)
  if: |
    runner.os != 'Windows' &&
    matrix.kind == 'test_release' &&
    github.repository == 'denoland/deno' &&
    (github.ref == 'refs/heads/master' ||
    startsWith(github.ref, 'refs/tags/'))
  uses: google-github-actions/setup-gcloud@master
  with:
    project_id: denoland
    service_account_key: ${{ secrets.GCP_SA_KEY }}
    export_default_credentials: true
```

- 执行条件：运行系统不是 'Windows'、构建矩阵 kind 是 `'test_release'`、仓库是 `'denoland/deno'`、分支是 master 或是 tag 提交
- `google-github-actions/setup-gcloud`：与 Google Cloud Platform 交互的 GitHub Actions 的集合。

### 12、Setup gcloud (windows)

> 同 11 作用一样，不过是为 windows 设置 gcloud

```yml
- name: Setup gcloud (windows)
  if: |
    runner.os == 'Windows' &&
    matrix.kind == 'test_release' &&
    github.repository == 'denoland/deno' &&
    (github.ref == 'refs/heads/master' ||
    startsWith(github.ref, 'refs/tags/'))
  uses: google-github-actions/setup-gcloud@master
  env:
    CLOUDSDK_PYTHON: ${{env.pythonLocation}}\python.exe
  with:
    project_id: denoland
    service_account_key: ${{ secrets.GCP_SA_KEY }}
    export_default_credentials: true
```

### 13、Configure canary build

> 配置 canary 渠道的 build（Deno 发布氛围 canary 和 release 渠道）

```yml
- name: Configure canary build
  if: |
    matrix.kind == 'test_release' &&
    github.repository == 'denoland/deno' &&
    github.ref == 'refs/heads/master'
  shell: bash
  run: |
    echo "DENO_CANARY=true" >> $GITHUB_ENV
```

- 执行条件：构建矩阵 `kind` 为 `'test_release'`、github repo 是 `'denoland/deno'`、master 分支
- `run` 将 `"DENO_CANARY=true"` 设置进环境变量。

> 您也可以使用 `GITHUB_ENV` environment file 设置工作流程中的以下步骤可以使用的环境变量。 —— 文档

### 14、Log versions

> 检查前面安装的程序的版本

```yml
- name: Log versions
  run: |
    node -v
    python --version
    rustc --version
    cargo --version
    deno --version
```

### 15、lint.js

> 执行 lint

```yml
- name: lint.js
  if: matrix.kind == 'lint'
  run: deno run --unstable --allow-write --allow-read --allow-run ./tools/lint.js
```

- 执行条件：构建矩阵 `kind` 类型 为 `'lint'`

### 16、test_format.js

> 测试格式化程序

```yml
- name: test_format.js
  if: matrix.kind == 'lint'
  run: deno run --unstable --allow-write --allow-read --allow-run ./tools/format.js --check
```

- 执行条件：构建矩阵 `kind` 类型 为 `'lint'`

### 17、Build release

```yml
- name: Build release
  if: |
    matrix.kind == 'test_release' ||
    matrix.kind == 'bench'
  run: cargo build --release --locked --all-targets -vv
```

- 执行条件：构建矩阵 `kind` 类型 为 `'test_release'` 或 `'bench'`

### 18、Build debug

```yml
- name: Build debug
  if: matrix.kind == 'test_debug'
  run: cargo build --locked --all-targets
```

- 执行条件：构建矩阵 `kind` 类型 为 `'test_debug'`

### 19、Pre-release (linux)

> 发布之前的准备工作（linux）

```yml
- name: Pre-release (linux)
  if: |
    startsWith(matrix.os, 'ubuntu') &&
    matrix.kind == 'test_release'
  run: |
    cd target/release
    zip -r deno-x86_64-unknown-linux-gnu.zip deno
    zip -r denort-x86_64-unknown-linux-gnu.zip denort
    ./deno types > lib.deno.d.ts
```

- 执行条件：构建矩阵 os 为 `'ubuntu'`、构建矩阵 `kind` 为 `'test_release'`
- `run`：做的事情其实就是打压缩包，这些压缩包最终会发布在 GitHub Release 中供安装脚本使用

### 20、Pre-release (mac)

> 和 19 作用一样，这里没有 `./deno types > lib.deno.d.ts`，私以为漏了。

```yml
- name: Pre-release (mac)
  if: |
    startsWith(matrix.os, 'macOS') &&
    matrix.kind == 'test_release'
  run: |
    cd target/release
    zip -r deno-x86_64-apple-darwin.zip deno
    zip -r denort-x86_64-apple-darwin.zip denort
```

### 21、Pre-release (windows)

> 和 19、20 一样，just for windows，可以学习一下 Windows 下的压缩命令怎么写！

```yml
- name: Pre-release (windows)
  if: |
    startsWith(matrix.os, 'windows') &&
    matrix.kind == 'test_release'
  run: |
    Compress-Archive -CompressionLevel Optimal -Force -Path target/release/deno.exe -DestinationPath target/release/deno-x86_64-pc-windows-msvc.zip
    Compress-Archive -CompressionLevel Optimal -Force -Path target/release/denort.exe -DestinationPath target/release/denort-x86_64-pc-windows-msvc.zip
```

### 22、Upload canary to dl.deno.land (unix)

> 上传 canary 包到 dl.deno.land（unix）(我们只要知道托管在 Google 云就好了)

```yml
- name: Upload canary to dl.deno.land (unix)
  if: |
    runner.os != 'Windows' &&
    matrix.kind == 'test_release' &&
    github.repository == 'denoland/deno' &&
    github.ref == 'refs/heads/master'
  run: |
    gsutil cp ./target/release/*.zip gs://dl.deno.land/canary/$(git rev-parse HEAD)/
    echo $(git rev-parse HEAD) > canary-latest.txt
    gsutil cp canary-latest.txt gs://dl.deno.land/canary-latest.txt
```

- 执行条件：操作系统不是 Windows、构建矩阵 kind 是 `'test_release'`、github repo 是 `'denoland/deno'`、master 分支
- `run`
  - `gsutil cp ./target/release/*.zip gs://dl.deno.land/canary/$(git rev-parse HEAD)/`：上传压缩包到服务器
    - `$(git rev-parse HEAD)`：获取最新的 git commit hash，你可以再任一 git 库中执行 `echo $(git rev-parse HEAD)` 验证
  - `echo $(git rev-parse HEAD) > canary-latest.txt`：将 commit hash 值作为版本写入 canary-latest.txt
  - `gsutil cp canary-latest.txt gs://dl.deno.land/canary-latest.txt`：上传 `canary-latest.txt` 到服务器

### 23、Upload canary to dl.deno.land (windows)

> 和 22 作用一样，just for windows

```yml
- name: Upload canary to dl.deno.land (windows)
  if: |
    runner.os == 'Windows' &&
    matrix.kind == 'test_release' &&
    github.repository == 'denoland/deno' &&
    github.ref == 'refs/heads/master'
  env:
    CLOUDSDK_PYTHON: ${{env.pythonLocation}}\python.exe
  shell: bash
  run: |
    gsutil cp ./target/release/*.zip gs://dl.deno.land/canary/$(git rev-parse HEAD)/
    echo $(git rev-parse HEAD) > canary-latest.txt
    gsutil cp canary-latest.txt gs://dl.deno.land/canary-latest.txt
```

- `CLOUDSDK_PYTHON: ${{env.pythonLocation}}\python.exe`：从这里可以看到 Python 环境是给 google cloud sdk 用的

### 24、Test release

> 测试发布

```yml
- name: Test release
  if: matrix.kind == 'test_release'
  run: cargo test --release --locked --all-targets
```

### 25、Test debug

> 测试 debug

```yml
- name: Test debug
  if: matrix.kind == 'test_debug'
  run: |
    cargo test --locked --doc
    cargo test --locked --all-targets
```

### 26、Configure hosts file for WPT (unix)

### 26、Configure hosts file for WPT (unix)

> WPT 是 Web Platform Test 的意思，对应仓库 [denoland/wpt](https://github.com/denoland/wpt)

```yml
 - name: Configure hosts file for WPT (unix)
  if: runner.os != 'Windows'
  run: ./wpt make-hosts-file | sudo tee -a /etc/hosts
  working-directory: test_util/wpt/
```

### 27、Configure hosts file for WPT (windows)

> 和 26 作用一样，just for windows

```yml
- name: Configure hosts file for WPT (windows)
  if: runner.os == 'Windows'
  working-directory: test_util/wpt/
  run: python wpt make-hosts-file | Out-File $env:SystemRoot\System32\drivers\etc\hosts -Encoding ascii -Append
```

### 28、Run web platform tests (release)

> 在 web 平台下运行测试（release）

```yml
- name: Run web platform tests (release)
  if: matrix.kind == 'test_release'
  run: |
    deno run --unstable --allow-write --allow-read --allow-net --allow-env --allow-run ./tools/wpt.ts setup
    deno run --unstable --allow-write --allow-read --allow-net --allow-env --allow-run ./tools/wpt.ts run --quiet --release
```

### 29、Run web platform tests (debug)

> 在 web 平台下运行测试（debug）

```yml
 - name: Run web platform tests (debug)
  if: matrix.kind == 'test_debug'
  run: |
    deno run --unstable --allow-write --allow-read --allow-net --allow-env --allow-run ./tools/wpt.ts setup
    deno run --unstable --allow-write --allow-read --allow-net --allow-env --allow-run ./tools/wpt.ts run --quiet
```

### 30、Run Benchmarks

> 压力测试

```yml
- name: Run Benchmarks
  if: matrix.kind == 'bench'
  run: cargo bench
```

- 执行条件：构建矩阵 kind 为 `'bench'`

### 31、Post Benchmarks

> 看起来是把压测数据存到 `denoland/benchmark_data`

```yml
- name: Post Benchmarks
  if: |
    matrix.kind == 'bench' &&
    github.repository == 'denoland/deno' &&
    github.ref == 'refs/heads/master'
  env:
    DENOBOT_PAT: ${{ secrets.DENOBOT_PAT }}
  run: |
    git clone --depth 1 -b gh-pages https://${DENOBOT_PAT}@github.com/denoland/benchmark_data.git gh-pages
    deno run --unstable -A ./tools/build_benchmark_jsons.js --release
    cd gh-pages
    git config user.email "propelml@gmail.com"
    git config user.name "denobot"
    git add .
    git commit --message "Update benchmarks"
    git push origin gh-pages
```

- 执行条件：`denoland/deno` 库的 master 分支且构建矩阵的 kind 是 `'bench'`

### 32、Worker info

```yml
- name: Worker info
  if: matrix.kind == 'bench'
  run: |
    cat /proc/cpuinfo
    cat /proc/meminfo
```

- 执行条件：构建矩阵 kind 是 `bench`
- run
  - `cat /proc/cpuinfo`：查看 cpu 信息
  - `cat /proc/meminfo`：查看内存信息

### 33、Upload release to dl.deno.land (unix)

> 上传 unix release 到 dl.deno.land

```yml
- name: Upload release to dl.deno.land (unix)
  if: |
    runner.os != 'Windows' &&
    matrix.kind == 'test_release' &&
    github.repository == 'denoland/deno' &&
    startsWith(github.ref, 'refs/tags/')
  run: |
    gsutil cp ./target/release/*.zip gs://dl.deno.land/release/${GITHUB_REF#refs/*/}/
    echo ${GITHUB_REF#refs/*/} > release-latest.txt
    gsutil cp release-latest.txt gs://dl.deno.land/release-latest.txt
```

### 34、Upload release to dl.deno.land (windows)

> 上传 windows release 到 dl.deno.land

```yml
- name: Upload release to dl.deno.land (windows)
  if: |
    runner.os == 'Windows' &&
    matrix.kind == 'test_release' &&
    github.repository == 'denoland/deno' &&
    startsWith(github.ref, 'refs/tags/')
  env:
    CLOUDSDK_PYTHON: ${{env.pythonLocation}}\python.exe
  shell: bash
  run: |
    gsutil cp ./target/release/*.zip gs://dl.deno.land/release/${GITHUB_REF#refs/*/}/
    echo ${GITHUB_REF#refs/*/} > release-latest.txt
    gsutil cp release-latest.txt gs://dl.deno.land/release-latest.txt
```

### 35、Upload release to GitHub

> 上传 release 到 GitHub

```yml
- name: Upload release to GitHub
  uses: softprops/action-gh-release@v1
  if: |
    matrix.kind == 'test_release' &&
    github.repository == 'denoland/deno' &&
    startsWith(github.ref, 'refs/tags/')
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  with:
    files: |
      target/release/deno-x86_64-pc-windows-msvc.zip
      target/release/deno-x86_64-unknown-linux-gnu.zip
      target/release/deno-x86_64-apple-darwin.zip
      target/release/deno_src.tar.gz
      target/release/lib.deno.d.ts
    draft: true
```

- `softprops/action-gh-release@v1`：发布 github release 用的 action，这个确实很棒，可以执行直接上传 release asset 等高级操作。我在 [tuya-panel-demo](https://github.com/youngjuning/tuya-panel-demo/blob/master/.github/workflows/release.yml) 中使用了该插件。
