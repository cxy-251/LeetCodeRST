Git 对象与原子提交：blob、tree、commit、ref
==========================================

笔记定位
--------

这是一篇独立工程笔记，用于解释通过 Git Data API 更新仓库时看到的 ``blob``、``tree``、``commit``
和 ``ref``。它不属于 LeetCode 算法知识账本，也不改变题目生成规则。

从文件系统视角切换到对象图
--------------------------

工作区里看到的是目录和文件，Git 内部保存的是不可变对象。最常见的对象关系如下：

.. code-block:: text

   refs/heads/main
          |
          v
       commit ----> parent commit
          |
          v
        tree
       /    \
    blob    subtree
              |
              v
             blob

四类对象各自承担不同职责：

``blob``
   保存一个文件版本的原始字节，不保存文件名、路径或提交信息。

``tree``
   保存目录快照。每条记录包含名称、权限模式、对象类型和目标对象 ID；目标可以是 ``blob`` 或子
   ``tree``。

``commit``
   指向一个根 ``tree``，同时记录父提交、作者、时间和提交说明。普通提交有一个父对象，合并提交可以有
   多个父对象。

``ref``
   是可移动名称，例如 ``refs/heads/main``。分支本质上是指向某个 commit 的引用。

blob 为什么没有文件名
---------------------

Git 把“内容”和“这个内容出现在哪里”分开。blob 只由内容决定；文件名和目录位置属于 tree。

概念上，传统 SHA-1 仓库的 blob 对象 ID 来自：

.. code-block:: text

   SHA1("blob " + 字节长度 + NUL + 文件字节)

因此：

* 内容相同的文件版本会得到相同 blob ID，即使路径不同；
* 文件改变一个字节，就会产生新的 blob；
* blob 创建后不可修改，所谓“更新文件”实际是创建新 blob，并让新 tree 指向它；
* 旧提交仍指向旧 tree 和旧 blob，所以历史版本不会被覆盖。

本地可以使用：

.. code-block:: bash

   git hash-object path/to/file

计算文件将得到的 blob ID。加上 ``-w`` 时，会把对象写入本地对象数据库：

.. code-block:: bash

   git hash-object -w path/to/file

为什么一次修改多个文件会创建多个 blob
--------------------------------------

每个发生内容变化的文件都需要一个新 blob。未修改文件继续复用旧 tree 中已有的 blob，不需要重新上传。

例如一轮工作修改三个题目、两个 README 和三个状态文件，就会先创建八个 blob。此时分支尚未变化，
这些对象只是已经存在于对象数据库中。

从多个 blob 组装一个原子提交
----------------------------

通过底层 Git Data API，可以把一批文件更新按以下顺序组装：

#. 为每个新文件版本调用 ``create_blob``；
#. 以当前提交的 tree 为基础调用 ``create_tree``，替换或增加目标路径；
#. 调用 ``create_commit``，让新 commit 指向新 tree，并把当前 ``main`` 作为父提交；
#. 最后调用 ``update_ref``，把 ``refs/heads/main`` 快进到新 commit。

前面三步都不会改变用户看到的 ``main``。只有最后移动 ref 才让整批内容同时可见：

.. code-block:: text

   旧状态：main -> C0 -> T0

   准备阶段：
       B1 B2 B3 ...       新 blob 已存在
              \
               T1         新 tree 已存在
                |
                C1        新 commit 已存在，但 main 仍指向 C0

   发布阶段：main -> C1 -> T1
                    |
                    v
                    C0

这就是对象层面的“先准备完整快照，最后一次性发布”。

与逐文件 Contents API 的差异
----------------------------

高层 ``create_file`` / ``update_file`` 接口通常一次调用就创建一次提交。连续更新八个文件，可能形成
八个提交，并让 ``main`` 短暂经过不完整状态：README 已更新，题目文件或状态文件还没有全部进入仓库。

底层对象流程把全部路径装入同一个 tree，再创建一个 commit，因此提交历史只有一个原子节点：

.. code-block:: text

   不理想：C0 -> C1 -> C2 -> C3 -> ... -> C8

   原子批次：C0 -> C1
                   └── 一个 tree 同时包含全部文件变化

“原子”指分支可见状态不会出现半批内容。它不等同于数据库事务：准备阶段失败时，可能留下暂时没有
任何 ref 引用的对象。

悬空对象与垃圾回收
------------------

若 blob、tree 或 commit 已创建，但最后没有 ref 指向它们，这些对象称为不可达对象，常被称为悬空对象
（dangling objects）。它们不会出现在正常分支历史中，也不会让用户看到半成品。

Git 会在后续维护中根据保留策略回收长期不可达对象。创建失败不需要修改或删除这些不可变对象；只要
不移动分支 ref，公开历史仍保持原状。

非强制快进如何保护并发更新
--------------------------

提交准备期间，其他人可能已经推进 ``main``。安全流程应在写入前重新读取最新提交，并让新 commit 的
``parent`` 指向它。更新 ref 时使用非强制快进：

.. code-block:: text

   force = false

若 ``main`` 已经移动到另一个提交，旧基础上的更新不再是快进，服务端应拒绝操作。执行者随后重新读取
状态、重算目标 tree，而不是覆盖别人的提交。

本地命令与 Git Data API 的对应关系
----------------------------------

下表是概念对应，不表示每个高层命令只执行一个底层动作。

.. list-table::
   :header-rows: 1

   * - Git Data API
     - 本地底层命令
     - 作用
   * - ``create_blob``
     - ``git hash-object -w``
     - 保存文件内容对象
   * - ``create_tree``
     - ``git mktree`` / 写入 index 后 ``git write-tree``
     - 保存目录快照
   * - ``create_commit``
     - ``git commit-tree``
     - 创建指向 tree 和 parent 的提交
   * - ``update_ref``
     - ``git update-ref``
     - 移动分支引用

日常的：

.. code-block:: bash

   git add .
   git commit
   git push

会替用户完成索引、tree、commit 和远端 ref 更新。Git Data API 只是把这些阶段显式暴露出来。

如何确认上传内容就是本地审查内容
--------------------------------

在上传前对每个最终文件运行：

.. code-block:: bash

   git hash-object path/to/file

再比较 ``create_blob`` 返回的对象 ID。两者一致意味着 Git 对象层看到的文件字节完全相同，可以发现：

* 上传了旧版本；
* 换行符发生变化；
* 字符编码或转义改变；
* 复制过程截断了文件；
* 尾部换行或其他不可见字节不同。

这项检查只证明字节一致，不证明内容逻辑正确。题解的人工静态审查、文档检查和状态一致性仍需在上传前完成；
不得运行或编译题解代码。

提交后的复查
------------

移动 ``main`` 后，应至少核对：

#. 新提交的父对象是原 ``main``，比较结果为 ``ahead_by = 1``、``behind_by = 0``；
#. 差异文件集合与计划完全一致，没有临时文件或无关修改；
#. 从新的 ``main`` 重新读取关键文件，而不是只相信写接口返回成功；
#. 状态文件、README、索引和正文指向同一完成范围；
#. 外部 CI 状态与本地静态审查分别报告，没有把“没有检查”写成“检查通过”。

完整工作流
----------

.. code-block:: text

   读取最新 main 和状态
          |
          v
   在临时环境生成文件
          |
          v
   人工静态审查、格式与状态一致性检查
          |
          v
   git hash-object 计算本地内容 ID
          |
          v
   create_blob × N
          |
          v
   create_tree(base_tree = 当前 main 的 tree)
          |
          v
   create_commit(parent = 当前 main)
          |
          v
   update_ref(main, force = false)
          |
          v
   compare + 重新读取远端文件

核心结论
--------

* Git 保存的是不可变对象图，工作区目录只是其中一个可读视图；
* blob 保存内容，tree 保存名称与结构，commit 保存快照关系，ref 让分支名称可以移动；
* 创建 blob、tree 和 commit 都不等于发布，移动 ref 才改变分支可见状态；
* 多文件批次先组装完整 tree，再一次性移动 ``main``，可以得到一个干净的原子提交；
* 本地 ``git hash-object`` 与远端 blob ID 一致，可以证明静态审查过的字节就是上传的字节；
* 非强制快进和提交后复查共同防止并发覆盖与错误报告。
