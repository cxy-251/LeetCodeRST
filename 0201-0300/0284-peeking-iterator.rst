0284. Peeking Iterator
======================

题目信息
--------

:题号: 0284
:难度: Medium
:主题: 迭代器、对象设计、跨调用状态
:原题: `LeetCode 0284 <https://leetcode.com/problems/peeking-iterator/>`_
:重点: ``peek`` 查看但不消费下一个元素、``next`` 消费元素、``hasNext`` 必须反映包装后迭代器的真实剩余状态

题目重述
--------

在平台已有的整数迭代器之上实现 ``PeekingIterator``。构造函数接收一个底层迭代器，对象需要继续支持 ``next()`` 和 ``hasNext()``，并新增 ``peek()``：

* ``peek()`` 返回当前下一个元素，但不能推进迭代位置；连续调用多次应返回同一个值；
* ``next()`` 返回当前下一个元素，并把迭代位置推进一项；
* ``hasNext()`` 在仍有未消费元素时返回 ``true``，全部元素消费完后返回 ``false``。

初始序列长度位于 ``[1, 1000]``，元素值位于 ``[1, 1000]``。题目保证每次调用 ``next`` 或 ``peek`` 时都确实存在下一个元素；三种方法的总调用次数不超过 1000。对象必须在连续调用之间保留状态，不能让 ``peek`` 导致元素被跳过或重复消费。

自建示例
--------

连续查看同一个元素：

.. code-block:: text

   初始序列：[4, 7]
   调用：peek(), peek(), next(), hasNext(), next(), hasNext()
   输出：4, 4, 4, true, 7, false
   解释：两次 peek 都只查看首元素 4；随后 next 才真正消费 4。消费 7 后序列为空。

先消费再查看：

.. code-block:: text

   初始序列：[6, 9, 12]
   调用：next(), peek(), next()
   输出：6, 9, 9
   解释：第一次 next 消费 6，peek 查看但不消费 9，紧接着的 next 因而仍返回 9。

一个元素的预读缓存
------------------

包装器只需维护一份 lookahead 缓存：

``has_cached``
   缓存中是否已经有一个尚未交给调用者的元素。

``cached``
   当 ``has_cached`` 为真时，保存底层迭代器的下一个元素。

``peek`` 若缓存为空，就从底层迭代器取一次并保存；之后直接返回缓存，不再次推进底层位置。
``next`` 若缓存存在则返回并清空它，否则直接调用底层 ``next``。``hasNext`` 只要缓存非空或底层仍有元素就返回真。

状态不变量与正确性
------------------

包装器对外看到的“下一个元素”始终是缓存中的值（若存在），否则是底层迭代器的下一个值。
``peek`` 只是把后者搬进缓存，不改变逻辑下一个元素；``next`` 消费缓存或底层当前元素各一次，
因此不会跳过或重复；当缓存和底层都为空时，且仅当此时，``hasNext`` 返回假。

C++ 实现
--------

.. code-block:: cpp

   class PeekingIterator : public Iterator {
       int cached = 0;
       bool has_cached = false;

   public:
       PeekingIterator(const std::vector<int>& nums) : Iterator(nums) {}

       int peek() {
           if (!has_cached) {
               cached = Iterator::next();
               has_cached = true;
           }
           return cached;
       }

       int next() {
           if (has_cached) {
               has_cached = false;
               return cached;
           }
           return Iterator::next();
       }

       bool hasNext() {
           return has_cached || Iterator::hasNext();
       }
   };

代码分析
--------

每个元素最多被底层 ``next`` 取一次、被缓存返回一次，三种操作均为摊还 ``O(1)``，
额外空间只有一个元素和一个标志位。``peek`` 的预读是唯一会推进底层迭代器的查看行为，
但推进被缓存状态抵消，因此对外消费位置保持不变。
