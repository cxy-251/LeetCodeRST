0609. Find Duplicate File in System
===================================

题目信息
--------

:题号: 0609
:难度: Medium
:主题: 文件描述字符串、内容分组、完整路径、哈希归类
:原题: `LeetCode 0609 <https://leetcode.com/problems/find-duplicate-file-in-system/>`_
:重点: 每条输入同时描述目录与多个文件、重复依据是文件内容而非文件名、只返回至少含两个文件的内容组、组间和组内顺序均不限

题目重述
--------

给定字符串数组 ``paths``。每个字符串先给出一个目录路径，随后以空格分隔该目录中的若干文件；每个文件写成 ``file_name(content)``。需要根据文件内容找出所有重复文件，并返回它们的完整路径。

内容完全相同的文件属于同一组，文件名是否相同不影响判断。只返回至少包含两个文件的组；每个完整路径写成 ``directory_path/file_name``，各组及组内路径可以按任意顺序返回。``paths.length`` 位于 ``[1, 2 * 10^4]``，单条字符串长度不超过 ``3000``，全部字符串总长度不超过 ``5 * 10^5``；每条目录描述都是唯一的，同一目录中不会出现重名文件或子目录。

自建示例
--------

只有一种内容重复：

.. code-block:: text

   输入：paths = ["root/x a.txt(red) b.txt(blue)", "root/y c.txt(red)", "root/z d.txt(green)"]
   输出：[["root/x/a.txt","root/y/c.txt"]]
   解释：a.txt 与 c.txt 的内容都是 red；blue 和 green 各只出现一次，因此不形成重复组。

文件名相同但内容不同：

.. code-block:: text

   输入：paths = ["data/a note.txt(one)", "data/b note.txt(two)"]
   输出：[]
   解释：两个文件虽然同名，但内容不同；重复判断只比较括号中的内容。
