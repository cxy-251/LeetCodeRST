0341. Flatten Nested List Iterator
=================================

题目信息
--------

:题号: 0341
:难度: Medium
:主题: 嵌套列表、迭代器、从左到右展开、跨调用状态
:原题: `LeetCode 0341 <https://leetcode.com/problems/flatten-nested-list-iterator/>`_
:重点: 空列表不产生元素、整数顺序与递归展开顺序一致、``hasNext`` 不消费数据

题目重述
--------

给定 ``nestedList``，其中每个元素要么是一个整数，要么是一个可以继续包含整数或列表的嵌套列表。实现 ``NestedIterator`` 类：构造函数接收该嵌套结构，``next()`` 返回按从左到右递归展开后的下一个整数，``hasNext()`` 判断是否仍有整数尚未返回。

多次调用必须共享同一迭代进度；重复调用 ``hasNext()`` 不能跳过或消费元素。空的嵌套列表不产生输出。顶层列表长度位于 ``[1, 500]``，其中所有整数值位于 ``[-10^6, 10^6]``。评测会持续执行 ``hasNext``，并只在其返回 ``true`` 时调用 ``next``，最终返回的整数顺序必须与原嵌套结构的从左到右顺序一致。

自建示例
--------

嵌套结构中包含空列表：

.. code-block:: text

   输入：nestedList = [[], [2, [3, []]], 4]
   调用：hasNext(), next(), hasNext(), next(), next(), hasNext()
   输出：true, 2, true, 3, 4, false
   解释：空列表不产生整数，递归展开顺序为 2、3、4；hasNext 只检查状态，不会提前消费 2 或 3。

只有一个整数：

.. code-block:: text

   输入：nestedList = [7]
   展开输出：[7]
   解释：顶层整数直接成为迭代器返回的唯一元素。

用迭代器栈保存尚未展开的路径
------------------------------

栈中的每一帧保存某个列表当前遍历位置和末尾位置。``normalize`` 不断处理栈顶：空列表或已经走到末尾就弹出；遇到嵌套列表就先把父列表位置向后移动，再把子列表的迭代器范围压栈；遇到整数就停止。这样栈顶始终指向下一个待返回的整数。

``hasNext`` 只调用 ``normalize`` 并查看栈是否为空，不会递增整数迭代器；``next`` 取出栈顶整数后才前进一格。父列表的迭代器位置在压入子列表前已经移动，因此子列表耗尽后会自然回到正确的兄弟元素。

C++ 实现
--------

.. code-block:: cpp

   class NestedIterator {
       using Iterator =
           std::vector<NestedInteger>::const_iterator;
       std::vector<std::pair<Iterator, Iterator>> stack;

       void normalize() {
           while (!stack.empty()) {
               auto& frame = stack.back();
               if (frame.first == frame.second) {
                   stack.pop_back();
                   continue;
               }

               if (frame.first->isInteger()) return;
               const auto& nested = frame.first->getList();
               ++frame.first;
               stack.push_back({nested.cbegin(), nested.cend()});
           }
       }

   public:
       NestedIterator(std::vector<NestedInteger>& nestedList) {
           stack.push_back({nestedList.cbegin(), nestedList.cend()});
           normalize();
       }

       int next() {
           normalize();
           auto& frame = stack.back();
           int value = frame.first->getInteger();
           ++frame.first;
           normalize();
           return value;
       }

       bool hasNext() {
           normalize();
           return !stack.empty();
       }
   };

代码分析
--------

栈深度只与当前嵌套层数有关，不必预先把所有整数复制到扁平数组；每个列表迭代器和每个元素只被推进或展开一次。``hasNext`` 的幂等性来自“只整理、不消费整数”的约束。若共有 ``N`` 个嵌套元素，所有调用的总时间为 ``O(N)``，额外空间为 ``O(h)``，``h`` 为当前嵌套深度。
