0208. Implement Trie (Prefix Tree)
==================================

题目信息
--------

:题号: 0208. 实现 Trie（前缀树）
:难度: Medium
:主题: Trie、前缀树、字符串、数据结构设计
:原题: `LeetCode 0208 <https://leetcode.com/problems/implement-trie-prefix-tree/>`_
:重点: 用共享字符路径复用前缀，并用终止标记区分完整单词和普通前缀

题目重述
--------

设计一个 ``Trie`` 类，支持连续调用：构造函数建立空 Trie；``insert(word)`` 插入单词；
``search(word)`` 判断这个完整单词是否曾经插入；``startsWith(prefix)`` 判断是否存在某个
已插入单词以该前缀开头。

``word`` 和 ``prefix`` 只包含小写英文字母，长度位于 ``[1, 2000]``，三种操作总调用次数不超过
``3 * 10^4``。插入结果必须跨调用保留；一条字符路径存在，并不代表该路径的终点已经作为完整
单词插入。

自建示例
--------

完整单词和前缀必须分开判断：

.. code-block:: text

   操作：insert("stone")，search("sto")，startsWith("sto")，insert("sto")，search("sto")
   输出：           false           true                         true

   解释：stone 建立了 sto 路径，但只有再次插入 sto 后，sto 的终点才标记为完整单词。

共享前缀和缺失分支：

.. code-block:: text

   操作：insert("steam")，insert("step")，startsWith("ste")，search("stem")
   输出：                                  true                 false

   解释：steam 与 step 共享 ste 节点，但 stem 在 m 处走不到已有分支。

C++ 实现
--------

.. code-block:: cpp

   #include <array>
   #include <string>

   class Trie {
   private:
       struct Node {
           std::array<Node*, 26> child{};
           bool terminal = false;
       };

       Node* root_ = new Node();

       static void release(Node* node) {
           if (node == nullptr) return;
           for (Node* child : node->child) release(child);
           delete node;
       }

       Node* walk(const std::string& text) const {
           Node* current = root_;
           for (char character : text) {
               int index = character - 'a';
               if (current->child[index] == nullptr) return nullptr;
               current = current->child[index];
           }
           return current;
       }

   public:
       Trie() = default;

       ~Trie() {
           release(root_);
       }

       void insert(const std::string& word) {
           Node* current = root_;
           for (char character : word) {
               int index = character - 'a';
               if (current->child[index] == nullptr) {
                   current->child[index] = new Node();
               }
               current = current->child[index];
           }
           current->terminal = true;
       }

       bool search(const std::string& word) const {
           Node* node = walk(word);
           return node != nullptr && node->terminal;
       }

       bool startsWith(const std::string& prefix) const {
           return walk(prefix) != nullptr;
       }
   };

题解
----

逐个字符串扫描会重复前缀工作
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

如果把已插入单词保存成字符串列表，``search`` 可以逐个比较完整字符串，``startsWith`` 则要
逐个比较前缀。多次查询相同前缀时，列表方案反复读取相同的开头字符；插入新单词也无法把已有
前缀的判断结果结构化保存。

Trie 把每个字符位置变成树上的一层。公共前缀只建立一份节点，单词的后缀从分叉处继续创建：

.. code-block:: text

   root -> s -> t -> e -> a -> m
                       \-> p

路径表示“这个字符序列曾作为某个单词的前缀出现过”，但还没有表示“这个字符序列本身是完整
单词”。因此每个节点还需要一个 ``terminal`` 标记；它只在 ``insert`` 走完整个单词后置为真。

三种操作共享一条路径游标
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

令 ``current`` 从根开始，依次处理字符串字符：

* ``insert``：子节点存在就复用，不存在就创建；走完后把当前节点标记为完整单词终点；
* ``search``：走完整条路径后，必须再检查 ``terminal``；
* ``startsWith``：只要路径走完就成功，不关心终点是否为完整单词。

这三个操作的差异被压缩到“查询结束后是否检查终止标记”，而不是复制三套字符遍历。固定小写
字母表可以把字符映射为 ``0..25`` 的数组下标，避免每层再搜索子节点。

路径不变量
~~~~~~~~~~~~

任意操作完成后，Trie 保持以下状态：

* 从根到节点的边标签组成该节点对应的唯一字符前缀；
* 非空子链接只表示相应扩展前缀曾出现在某个成功插入单词中；
* ``terminal == true`` 当且仅当该节点对应的完整字符串曾被插入；
* 插入只新增空缺分支或设置终点标记，不删除既有路径，不把真标记改回假；
* 查询只读节点，不改变后续调用可见的 Trie 状态。

插入 ``apple`` 时，``a``、``ap``、``app``、``appl`` 都只是路径节点，只有 ``apple`` 的终点
被标记。之后插入 ``app`` 只需把已有 ``app`` 节点的 ``terminal`` 设为真，不需要复制共享前缀。

状态走读
~~~~~~~~

依次执行 ``insert("apple")``、``search("app")``、``startsWith("app")``、
``insert("app")``、``search("app")``：

.. list-table::
   :header-rows: 1

   * - 操作
     - 路径状态
     - 终点标记
     - 返回值
   * - 插入 apple
     - 建立 ``a-p-p-l-e``
     - 只在 ``e`` 为真
     - —
   * - 查询 app
     - 走到 ``p`` 成功
     - ``p`` 为假
     - ``false``
   * - 前缀 app
     - 走到 ``p`` 成功
     - 不检查 ``p``
     - ``true``
   * - 插入 app
     - 路径全部复用
     - ``p`` 设为真
     - —
   * - 查询 app
     - 走到 ``p`` 成功
     - ``p`` 为真
     - ``true``

缺失字符分支会让 ``walk`` 立即返回空指针；它只说明当前字符串不是已有前缀，不会删除其他
分支或改变根节点。

代码分析
~~~~~~~~

每个 ``Node`` 固定保存 26 个子指针和一个 ``terminal``。``insert`` 只在遇到空指针时分配新
节点，因此共享前缀不会重复占用路径；重复插入同一个单词也只是重复设置同一个布尔值。

``walk`` 把“按字符走树”的状态集中到一个私有函数。``search`` 必须同时要求节点存在和
``terminal`` 为真，``startsWith`` 只要求节点存在，这两个返回条件正好对应题目语义。

公共 API 的根对象跨调用保存 ``root_``；析构函数递归释放所有节点，释放过程访问每个实际节点
一次。题目保证字符是小写 ASCII，因此 ``character - 'a'`` 始终落在 0 到 25，不需要额外的
编码分支。

复杂度与边界
~~~~~~~~~~~~

设当前操作字符串长度为 ``L``，Trie 节点总数为 ``N``。``insert``、``search``、``startsWith``
都只沿一条路径移动，时间复杂度为 ``O(L)``；固定 26 个子指针使每个节点空间为常数，整体
空间为 ``O(N)``，其中 ``N`` 不超过所有成功插入单词的字符总数加根节点。

查询缺失分支时可以提前结束；空前缀不在题目输入范围内，但若扩展支持，根节点始终存在，
``startsWith("")`` 可自然返回真。空 Trie 的任意非空查询都会在第一处缺失链接返回假。
