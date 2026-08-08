0170. Two Sum III - Data structure design
=========================================

题目信息
--------

:题号: 0170. 两数之和 III - 数据结构设计
:难度: Easy
:主题: 数据结构设计、哈希表、补数查询
:原题: `LeetCode 0170 <https://leetcode.com/problems/two-sum-iii-data-structure-design/>`_
:重点: 在多次 add/find 操作间分配工作，用频次而非存在性处理两个相同加数

题目重述
--------

设计 ``TwoSum`` 数据结构，支持两种操作：

* ``add(number)``：把整数 ``number`` 加入数据结构；同一个值可以加入多次；
* ``find(value)``：判断当前已加入的数中，是否存在两个不同的加入记录，其和等于
  ``value``。

``find`` 只返回是否存在，不需要返回下标或删除元素。若答案使用两个相同数值，该数值
必须至少被加入两次。

自建示例
--------

.. code-block:: text

   TwoSum two_sum;
   two_sum.add(1);
   two_sum.add(3);
   two_sum.add(5);
   two_sum.find(4);   // true，1 + 3 = 4
   two_sum.find(7);   // false
   two_sum.add(3);
   two_sum.find(6);   // true，两个独立加入的 3

.. code-block:: text

   TwoSum two_sum;
   two_sum.add(-4);
   two_sum.add(10);
   two_sum.find(6);   // true，-4 + 10 = 6
   two_sum.find(-8);  // false，-4 只加入了一次

C++ 实现
--------

.. code-block:: cpp

   #include <unordered_map>

   class TwoSum {
   private:
       std::unordered_map<long long, int> frequency_;

   public:
       TwoSum() = default;

       void add(int number) {
           ++frequency_[number];
       }

       bool find(int value) {
           for (const auto& [number, count] : frequency_) {
               long long complement =
                   static_cast<long long>(value) - number;
               auto found = frequency_.find(complement);
               if (found == frequency_.end()) {
                   continue;
               }

               if (complement != number || count >= 2) {
                   return true;
               }
           }
           return false;
       }
   };

题解
----

从一次性问题到操作序列
~~~~~~~~~~~~~~~~~~~~~~

一次性“两数之和”可以扫描数组并维护已见补数；本题没有固定数组，而是让 ``add`` 与
``find`` 任意交错。每次 ``find`` 都重新枚举全部加入记录的数对当然正确，但若已经加入
``n`` 个数，一次查询就可能检查 ``O(n²)`` 对。多次查询还会重复验证完全相同的数对。

数据结构设计的核心不是寻找另一个公式，而是决定哪些工作在 ``add`` 时完成、哪些留给
``find``：

* 保存全部数值列表：``add`` 为 ``O(1)``；``find`` 可以临时建立已见集合，用一次扫描
  查补数，时间 ``O(n)``，但每次查询都会重新处理重复值；
* 保存数值频次：``add`` 期望 ``O(1)``；``find`` 只扫描 ``u`` 个不同值，空间
  ``O(u)``，其中 ``u`` 是不同值数量；
* 预先保存所有可形成的两数之和：每次加入新数时与已有不同值组合，``add`` 为
  ``O(u)``、空间最坏 ``O(u²)``，但 ``find`` 可变成一次期望 ``O(1)`` 查询。

主解采用频次表：它没有二次空间，在 ``add`` 和 ``find`` 之间保持较均衡的代价；大量
重复输入还会被压缩成一个键和一个计数。

补数查询与重复值陷阱
~~~~~~~~~~~~~~~~~~~~

扫描某个已加入值 ``number`` 时，另一个数必须是：

.. code-block:: text

   complement = value - number

若补数与 ``number`` 不同，频次表中存在该键就说明有两种不同数值，它们自然对应两条
加入记录。若两者相同，键存在只说明至少加入过一次；必须要求 ``count >= 2``，才能使用
两个不同记录。

这正是集合无法完整表达的地方。集合能回答“3 是否出现过”，却无法区分一次还是两次，
因而会把只加入一个 3 的 ``find(6)`` 误判为真。频次是本题相对于普通存在性查询必须保留
的新信息。

状态走读
~~~~~~~~

执行示例中的前五个操作后，状态为：

.. code-block:: text

   frequency = {1: 1, 3: 1, 5: 1}

``find(4)`` 扫描到 1 时计算补数 3，两个键不同且 3 存在，立即返回真。
``find(7)`` 的候选补数依次为 6、4、2，都不存在，所以返回假。

再次执行 ``add(3)`` 后，只有已有键的计数从 1 变成 2：

.. code-block:: text

   frequency = {1: 1, 3: 2, 5: 1}

此时 ``find(6)`` 扫描到 3，补数仍为 3；相同键分支检查计数 2，确认存在两条独立记录后
返回真。``find`` 不修改频次，因此任意次数的查询都不会消耗数据。

为何不需要去重数对
~~~~~~~~~~~~~~~~~~

扫描 1 时可能检查 ``1 + 3``，以后扫描 3 又可能检查 ``3 + 1``。这会让某些失败查询
做常数倍重复工作，但不会影响 ``O(u)`` 复杂度；成功查询在第一次命中时立即返回。

若强行只检查 ``number <= complement`` 可以减少重复，却会增加边界分支，且无法改变
渐近复杂度。主解保持“每个不同值查询一次补数”的直接不变量，代码与正确性更清晰。

数值边界与复杂度
~~~~~~~~~~~~~~~~

``value - number`` 在 32 位整数上可能溢出，所以哈希键和补数计算使用 ``long long``。
加入的输入仍由题目接口提供 ``int``，提升后不会改变其值；超出输入范围的补数只会自然
查询失败。

设当前有 ``u`` 个不同值。``add`` 的期望时间为 ``O(1)``；``find`` 扫描频次表，期望
时间为 ``O(u)``；空间为 ``O(u)``。这些是哈希表平均情况下的复杂度，极端冲突下的最坏
时间取决于具体容器实现。若使用场景中查询远多于加入，并能接受二次空间，才值得改用
预计算所有两数之和的设计。
