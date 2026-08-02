0443. String Compression
========================

题目信息
--------

:题号: 0443
:难度: Medium
:主题: 字符数组、连续分组、原地写回、有效长度
:原题: `LeetCode 0443 <https://leetcode.com/problems/string-compression/>`_
:重点: 只压缩连续相同字符、单次字符不写数字、计数按十进制逐位写入、返回修改后的有效前缀长度

题目重述
--------

给定字符数组 ``chars``，把每一段连续相同字符原地压缩。每组先写入该字符；若该组长度大于 1，再把长度的十进制各位字符依次写在后面。组长度为 1 时不能附加数字 ``1``。

返回压缩结果占用的字符数量。函数必须把结果写入 ``chars`` 的前缀，返回长度之后的原数组内容不作要求。``chars.length`` 位于 ``[1, 2000]``，元素可以是英文字母、数字或符号。只能使用常数额外空间。

自建示例
--------

多个连续分组：

.. code-block:: text

   输入：chars = ["a","a","a","b","b","c"]
   返回：5
   修改后的有效前缀：["a","3","b","2","c"]
   解释：三个 a 写成 a3，两个 b 写成 b2，单个 c 只写字符本身。

计数包含多位数字：

.. code-block:: text

   输入：chars = 十二个连续的 "x"
   返回：3
   修改后的有效前缀：["x","1","2"]
   解释：组长度 12 必须拆成字符 1 和 2 写入，而不是作为一个整数槽位。

读指针扫描分组，写指针覆盖前缀
------------------------------

读指针 ``read`` 每次定位一段连续相同字符，先向右扫描得到该组的结束位置和长度，再由写指针 ``write`` 把字符写回结果前缀。长度为 1 时只写字符；长度大于 1 时把十进制字符串的每一位依次写入，因而自然支持两位及更多位的计数。

压缩结果不会比已经读过的内容更长，所以写指针不会越过读指针破坏尚未统计的分组。扫描结束后，``write`` 就是有效前缀长度。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int compress(std::vector<char>& chars) {
           int read = 0;
           int write = 0;
           while (read < static_cast<int>(chars.size())) {
               char current = chars[read];
               int begin = read;
               while (read < static_cast<int>(chars.size()) &&
                      chars[read] == current) {
                   ++read;
               }

               chars[write++] = current;
               int count = read - begin;
               if (count > 1) {
                   std::string digits = std::to_string(count);
                   for (char digit : digits) {
                       chars[write++] = digit;
                   }
               }
           }
           return write;
       }
   };

代码分析
--------

读指针只负责确认完整分组，写指针只写压缩后的有效结果；即使写入覆盖了数组前缀，也不会影响当前分组之后尚未读取的字符。每个字符最多被读写常数次，时间复杂度为 ``O(n)``；``to_string`` 产生的数字长度最多为 ``O(log n)``，除结果数组外的辅助空间为 ``O(log n)``。
