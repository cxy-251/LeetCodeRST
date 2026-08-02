0380. Insert Delete GetRandom O(1)
=================================

题目信息
--------

:题号: 0380
:难度: Medium
:主题: 设计、集合、随机返回、平均常数时间
:原题: `LeetCode 0380 <https://leetcode.com/problems/insert-delete-getrandom-o1/>`_
:重点: 集合不允许重复值、插入删除返回是否改变集合、随机返回现有元素且概率相等、三种操作平均 O(1)

题目重述
--------

实现 ``RandomizedSet`` 类。``insert(val)`` 在 ``val`` 不存在时把它加入集合并返回 ``true``，已存在时不改变集合并返回 ``false``；``remove(val)`` 在 ``val`` 存在时删除它并返回 ``true``，不存在时返回 ``false``；``getRandom()`` 从当前集合中随机返回一个元素。

``getRandom`` 调用时集合保证非空，并且当前每个元素被返回的概率必须相同。三个操作都要求平均时间复杂度为 ``O(1)``。``val`` 位于 32 位有符号整数范围内，对对象的调用总数不超过 ``2 * 10^5``；同一对象需要在连续调用之间保存集合状态。

自建示例
--------

插入、重复插入与删除：

.. code-block:: text

   调用：insert(4), insert(9), insert(4), remove(4), getRandom()
   输出：true, true, false, true, 9
   解释：第二次插入 4 不改变集合；删除 4 后只剩 9，因此随机调用必须返回 9。

随机结果必须来自现有集合：

.. code-block:: text

   调用：insert(-2), insert(7), getRandom()
   输出：前两次为 true；最后一次可以是 -2 或 7
   解释：两个现有元素应具有相同被选概率，不能返回集合之外的值。

数组负责随机，哈希表负责定位
------------------------------

用动态数组保存所有元素，用哈希表记录“值到数组下标”的映射。数组可以按下标等概率随机访问，哈希表可以平均常数时间判断存在性；删除时把末尾元素搬到待删位置，再弹出末尾，从而避免移动中间的大段元素，并同步更新搬来元素的下标。

C++ 实现
--------

.. code-block:: cpp

   class RandomizedSet {
       std::vector<int> values;
       std::unordered_map<int, int> index;
       std::mt19937 generator{std::random_device{}()};

   public:
       bool insert(int val) {
           if (index.count(val) != 0) return false;
           index[val] = static_cast<int>(values.size());
           values.push_back(val);
           return true;
       }

       bool remove(int val) {
           auto it = index.find(val);
           if (it == index.end()) return false;

           int removed = it->second;
           int last = values.back();
           values[removed] = last;
           index[last] = removed;
           values.pop_back();
           index.erase(it);
           return true;
       }

       int getRandom() {
           std::uniform_int_distribution<int> distribution(
               0, static_cast<int>(values.size()) - 1);
           return values[distribution(generator)];
       }
   };

代码分析
--------

删除末尾元素时，即使 ``last == val``，先更新再删除映射也会得到正确的空缺状态；否则则把最后一个值的映射改到被删除的位置。数组中的每个元素位置等概率，因此随机返回满足均匀性要求。三种操作平均时间为 ``O(1)``，额外空间为 ``O(m)``，其中 ``m`` 是当前元素数。
