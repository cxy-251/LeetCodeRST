0432. All O`one Data Structure
==============================

题目信息
--------

:题号: 0432
:难度: Hard
:主题: 设计、字符串计数、最小键、最大键
:原题: `LeetCode 0432 <https://leetcode.com/problems/all-oone-data-structure/>`_
:重点: ``inc``/``dec`` 修改跨调用计数、计数降到零时删除键、空结构返回空字符串、全部操作平均 ``O(1)``

题目重述
--------

实现 ``AllOne`` 数据结构，维护若干字符串键及其正整数计数。``inc(key)`` 将键的计数加 1；键不存在时先以计数 0 处理，因此调用后计数为 1。``dec(key)`` 将现有键的计数减 1；若计数变为 0，则从结构中删除该键，题目保证调用 ``dec`` 时键一定存在。

``getMaxKey()`` 返回任意一个计数最大的键，``getMinKey()`` 返回任意一个计数最小的键；若结构为空，两者都返回空字符串 ``""``。并列时可以返回其中任意一个键。所有操作都要求平均时间复杂度为 ``O(1)``。

键只包含小写英文字母，长度位于 ``[1, 10]``；总调用次数不超过 ``5 * 10^4``。同一对象必须在连续调用之间保存全部计数状态。

自建示例
--------

最大值和最小值来自不同键：

.. code-block:: text

   调用：inc("apple"), inc("pear"), inc("apple"), getMaxKey(), getMinKey()
   查询输出："apple"、"pear"
   解释：apple 的计数为 2，pear 的计数为 1，因此最大键和最小键分别唯一确定。

计数降到零后删除：

.. code-block:: text

   调用：inc("x"), dec("x"), getMaxKey(), getMinKey()
   查询输出：""、""
   解释：dec 后 x 的计数变为 0 并被删除，结构重新为空。

按计数维护相邻桶
------------------

用双向链表按计数从小到大排列桶，每个桶保存同一计数下的所有键；再用哈希表把每个键定位到所在桶。``inc`` 只需把键移动到计数加一的相邻桶，``dec`` 移动到计数减一的相邻桶；相邻桶不存在时在对应位置创建。桶空后立即删除，链表首尾就分别代表最小和最大计数。

链表迭代器和哈希映射共同保证移动、插入和删除都是平均常数时间；并列键从桶的集合中任取即可。

C++ 实现
--------

.. code-block:: cpp

   class AllOne {
       struct Bucket {
           int count;
           std::unordered_set<std::string> keys;
       };
       std::list<Bucket> buckets;
       std::unordered_map<std::string,
                          std::list<Bucket>::iterator> where;

   public:
       void inc(std::string key) {
           auto it = where.find(key);
           if (it == where.end()) {
               if (buckets.empty() || buckets.front().count != 1) {
                   buckets.push_front({1, {}});
               }
               buckets.front().keys.insert(key);
               where[key] = buckets.begin();
               return;
           }

           auto bucket = it->second;
           auto next = std::next(bucket);
           if (next == buckets.end()
               || next->count != bucket->count + 1) {
               next = buckets.insert(next,
                                     {bucket->count + 1, {}});
           }
           next->keys.insert(key);
           where[key] = next;
           bucket->keys.erase(key);
           if (bucket->keys.empty()) buckets.erase(bucket);
       }

       void dec(std::string key) {
           auto bucket = where[key];
           if (bucket->count == 1) {
               bucket->keys.erase(key);
               where.erase(key);
               if (bucket->keys.empty()) buckets.erase(bucket);
               return;
           }

           auto previous = bucket;
           if (bucket == buckets.begin()
               || std::prev(bucket)->count != bucket->count - 1) {
               previous = buckets.insert(bucket,
                                         {bucket->count - 1, {}});
           } else {
               previous = std::prev(bucket);
           }
           previous->keys.insert(key);
           where[key] = previous;
           bucket->keys.erase(key);
           if (bucket->keys.empty()) buckets.erase(bucket);
       }

       std::string getMaxKey() {
           if (buckets.empty()) return "";
           return *buckets.back().keys.begin();
       }

       std::string getMinKey() {
           if (buckets.empty()) return "";
           return *buckets.front().keys.begin();
       }
   };

代码分析
--------

键的计数变化只跨越相邻桶，哈希表始终指向移动后的有效迭代器；空桶删除后仍保持链表按计数有序。``dec`` 的调用契约保证键存在，因此 ``where[key]`` 不会创建错误状态。所有操作平均 ``O(1)``，额外空间为 ``O(键数量)``。
