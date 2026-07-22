0388. Longest Absolute File Path
================================

题目信息
--------

:题号: 0388
:难度: Medium
:主题: 栈、深度优先搜索、字符串
:原题: `LeetCode 388 <https://leetcode.com/problems/longest-absolute-file-path/>`_
:教学重点: 根据制表符确定目录深度，并维护每层路径的累计长度。

题目重述
--------

文件系统用字符串表示：换行分隔条目，前导制表符数量表示层级，名称中包含点号的条目视为文件。返回其中最长文件绝对路径的字符长度，目录之间用 ``/`` 分隔；没有文件时返回 ``0``。

自建示例
--------

输入 ``"dir\n\tsubdir1\n\tsubdir2\n\t\tfile.ext"``，最长路径为 ``"dir/subdir2/file.ext"``，长度为 ``20``。
