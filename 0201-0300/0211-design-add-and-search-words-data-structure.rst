0211. Design Add and Search Words Data Structure
================================================

题目信息
--------

:题号: 0211. 添加与搜索单词——数据结构设计
:难度: Medium
:主题: Trie、通配符搜索、递归搜索、对象状态
:原题: `LeetCode 0211 <https://leetcode.com/problems/design-add-and-search-words-data-structure/>`_
:重点: 点号匹配一个字符、完整单词与前缀、共享前缀、跨调用状态

题目重述
--------

设计一个可以连续使用的 ``WordDictionary``。``addWord(word)`` 把一个只含小写字母的单词加入字典；
``search(pattern)`` 判断字典中是否存在某个此前加入的完整单词，能够与模式逐位匹配。模式中的普通字母只能匹配同一个字母，
点号 ``.`` 可以匹配任意一个小写字母，但恰好消耗一个字符，不能代表空串或多个字符。

搜索成功不仅要求字符路径匹配，还要求模式结束的位置正好是某个已加入单词的终点。一个单词的前缀路径存在，不能说明这个前缀本身
已经被加入。字典必须跨越多次 ``addWord``、``search`` 调用保存状态；单词和模式长度最多为 25，模式最多含两个点号，所有操作总数最多为 ``10^4``。

自建示例
--------

加入 ``"bad"``、``"dad"``、``"mad"`` 后：``search(".ad")`` 返回 ``true``，因为点号可以选择三条首字母分支中的任意一条；
``search("b..")`` 返回 ``true``，两个点号各消费一个字符；``search(".ae")`` 返回 ``false``，所有首字母分支都会在最后的 ``e`` 处失败，
因为这是“存在一条成功分支”的搜索，不是只检查一个固定单词。

加入 ``"rain"`` 后，``search("rai")`` 返回 ``false``，因为 ``rai`` 只是更长单词的前缀；``search("ra.n")`` 返回 ``true``，
点号匹配 ``i`` 后到达 ``rain`` 的终点。

若依次加入 ``"apple"``、``"app"``，查询 ``"app"`` 只有在第二次加入后才返回 ``true``。同一条路径既可以是完整单词终点，
也可以继续通向更长单词，终止状态不能从“有没有孩子”推断。

C++ 实现
--------

.. code-block:: cpp

   #include <array>
   #include <memory>
   #include <string>

   class WordDictionary {
   private:
       struct Node {
           std::array<std::unique_ptr<Node>, 26> children{};
           bool terminal = false;
       };

       Node root_;

       bool matches(const Node* node, const std::string& pattern,
                    std::size_t position) const {
           if (position == pattern.size()) return node->terminal;

           const char character = pattern[position];
           if (character != '.') {
               const int index = character - 'a';
               const Node* child = node->children[index].get();
               return child != nullptr && matches(child, pattern, position + 1);
           }

           for (const std::unique_ptr<Node>& child : node->children) {
               if (child != nullptr && matches(child.get(), pattern, position + 1)) {
                   return true;
               }
           }
           return false;
       }

   public:
       WordDictionary() = default;

       void addWord(const std::string& word) {
           Node* node = &root_;
           for (char character : word) {
               const int index = character - 'a';
               if (node->children[index] == nullptr) {
                   node->children[index] = std::make_unique<Node>();
               }
               node = node->children[index].get();
           }
           node->terminal = true;
       }

       bool search(const std::string& pattern) const {
           return matches(&root_, pattern, 0);
       }
   };

题解
----

原始搜索空间
~~~~~~~~~~~~

最直接的结构是保存所有单词。查询时逐个检查长度相同的候选，普通字符比较是否相等，``.`` 直接跳过比较；检查完一个完整单词才算
命中。它覆盖了字典中的每个可能答案，因此不会漏解，但一次查询最坏要比较 ``W`` 个单词的 ``L`` 个字符，时间为 ``O(WL)``。

真正重复的不是某次字符比较，而是共享前缀被反复读取。例如 ``bad``、``dad``、``mad`` 都让 ``.ad`` 重新检查相同的后缀。
若预先为每个单词枚举所有点号替换，又会把 ``26`` 分支的成本提前支付给每次插入，查询模式的表达也变得不直接。

共享前缀与终点标记
~~~~~~~~~~~~~~~~~~

Trie 节点表示“已经匹配的前缀”，边表示下一个小写字母。插入时已有边直接复用，只有缺边才创建节点，所以公共前缀只保存一次。
但路径存在仍不等于完整单词存在：``apple`` 会建立 ``app`` 节点，却不能让 ``search("app")`` 成功；``terminal`` 专门记录路径本身
是否在某次 ``addWord`` 中结束。之后再加入 ``app`` 只需设置同一个节点的标志。

搜索状态与转移
~~~~~~~~~~~~~~

``matches(node, position)`` 表示：Trie 根到 ``node`` 的路径已经匹配模式的 ``pattern[0..position)``，现在判断剩余模式能否抵达终点。
状态始终满足“节点路径”和“已消费字符数”描述同一条候选路径：

* 模式结束时只检查 ``node->terminal``，不再向下走；
* 当前字符是字母时只有一条可能边，缺边即可剪枝；
* 当前字符是 ``.`` 时枚举当前节点真实存在的非空子边，每条分支恰好消费一个字符；
* 点号分支是“存在一条成功路径”，某一分支成功就短路，全部失败才返回假。

这解释了两个容易混淆的结果：``rai`` 到达有 ``n`` 子边的节点却因 ``terminal=false`` 失败；``ra.n`` 的点号只匹配 ``i``，不会跳过
字符。查询只读 Trie，跨调用的不变量仍由 ``addWord`` 保持。

状态走读
~~~~~~~~

加入 ``bad``、``dad``、``mad`` 后查询 ``.ad``：

.. list-table::
   :header-rows: 1

   * - 状态
     - 当前字符
     - 转移与结论
   * - ``(root,0)``
     - ``.``
     - 只枚举实际存在的 ``b``、``d``、``m`` 三条边
   * - ``(b,1)``
     - ``a``
     - 沿唯一 ``b->a`` 边前进
   * - ``(ba,2)``
     - ``d``
     - 到达 ``bad`` 节点
   * - ``(bad,3)``
     - 模式耗尽
     - ``terminal=true``，返回真并停止其他分支

若查询 ``.ae``，三条根边都能消费首个点号，但 ``ba``、``da``、``ma`` 都没有 ``e`` 边，于是三个分支分别失败。若查询 ``app``，
``apple`` 只有路径没有终止标记；加入 ``app`` 后，同一节点的 ``terminal`` 才改变，说明结构状态和单词状态必须分开保存。

方案选择与复杂度
~~~~~~~~~~~~~~~~~~

字符串列表保留了完整候选，最坏 ``O(WL)``；Trie 插入一个长度为 ``L`` 的单词为 ``O(L)``。无点号查询每层只有一条边，时间为 ``O(L)``；
含点号查询按实际访问的 ``(节点,模式位置)`` 状态计费，点号多且分支多时仍可能指数增长。Trie 的收益是共享已经确认的前缀，而不是
消除题目本身允许的通配符选择。代码采用固定 26 个子链接，实际节点数为 ``N`` 时空间为 ``O(N)``，递归栈最多 ``O(L)``。


代码走读
--------

``root_`` 是跨调用保存字典的根节点。``addWord`` 沿字符路径向下走：已有链接被复用，空链接才分配新节点；循环结束后才设置
``terminal``，所以 ``app`` 可以先作为 ``apple`` 的中间节点，之后再独立成为完整单词。``unique_ptr`` 让根节点拥有整棵 Trie，
对象销毁时子节点会自动释放，不需要另写平行的释放遍历。

``matches`` 的两个分支对应题目的两种匹配规则。普通字母先按下标取唯一子节点，缺失时立即剪枝；点号遍历当前节点已有的子节点，
任一递归成功就短路返回。递归参数中的 ``position`` 每次恰好加一，保证点号只匹配一个字符；到达模式末尾后才检查 ``terminal``，
不会把前缀误报为完整单词。``search`` 声明为只读，递归使用 ``const Node*``，从类型上表达查询不改变跨调用状态。

复杂度与边界
~~~~~~~~~~~~

设单词长度上限为 ``L``，Trie 实际节点数为 ``N``。``addWord`` 每个字符只走一次，时间为 ``O(L)``，固定 26 个子链接使额外空间为
``O(26N)``，常数字母表下记为 ``O(N)``。无点号查询每层只有一条路径，时间为 ``O(L)``；含点号查询按实际访问的
``(Trie 节点, 模式位置)`` 状态数 ``Q`` 计为 ``O(Q)``，最坏才接近所有与长度相容的分支。

递归栈深度最多为 ``O(L)``。空字典会在第一条缺失边返回假；长度为 1 的模式在消费一个字符后立即检查终点；重复加入同一单词只会
再次设置同一个终止标记，不改变搜索结果。输入模式中的点号不会与 Trie 的真实字母边混淆，因为它只在查询分支中解释，插入操作只接受字母。
