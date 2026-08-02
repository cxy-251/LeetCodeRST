0355. Design Twitter
====================

题目信息
--------

:题号: 0355
:难度: Medium
:主题: 设计、社交关系、时间顺序、对象状态
:原题: `LeetCode 0355 <https://leetcode.com/problems/design-twitter/>`_
:重点: 新闻流包含本人和关注者推文、最多返回十条、按发布时间倒序、关注关系与推文跨调用保存

题目重述
--------

实现 ``Twitter`` 类，支持以下操作：``postTweet(userId, tweetId)`` 由指定用户发布一条推文；``getNewsFeed(userId)`` 返回该用户本人及其当前关注对象发布的最近最多十条推文编号；``follow(followerId, followeeId)`` 建立关注关系；``unfollow(followerId, followeeId)`` 取消关注关系。

新闻流必须按发布时间从新到旧排列，而不是按推文编号排序。用户始终可以看到自己的推文，无需关注自己；取消一条不存在的关注关系不会产生额外效果。用户编号、关注双方编号位于 ``[1, 500]``，推文编号位于 ``[0, 10^4]`` 且每条推文编号唯一，对对象的调用总数不超过 ``3 * 10^4``。同一对象必须持续保存所有推文时间顺序和当前关注关系。

自建示例
--------

关注关系改变新闻流：

.. code-block:: text

   调用：postTweet(1, 20), postTweet(2, 31), follow(1, 2), getNewsFeed(1)
   输出：[31,20]
   解释：用户 1 关注用户 2 后，新闻流同时包含双方推文；31 发布得更晚，所以排在 20 前面。

取消关注只移除对方推文：

.. code-block:: text

   调用：unfollow(1, 2), postTweet(1, 44), getNewsFeed(1)
   输出：[44,20]
   解释：用户 2 的推文不再进入用户 1 的新闻流，用户 1 自己的新旧推文仍按时间倒序保留。

按用户保存推文，再合并各来源的最新位置
------------------------------------------

每个用户的推文按发布时间递增保存，关注关系用集合保存。查询用户的新闻流时，来源是“用户自己加当前关注者”；对每个来源先把其最后一条推文放入最大堆，堆顶就是所有来源中最新的一条。弹出一条后，只把同一用户的上一条推文放回堆，重复最多十次即可得到全局最新十条。

堆中记录用户和该用户推文数组中的位置，而不是只记录推文编号；这样即使编号大小与发布时间无关，也能始终按时间排序。关注或取消关注只改变集合，历史推文不需要搬移。

C++ 实现
--------

.. code-block:: cpp

   class Twitter {
       struct Tweet {
           long long time;
           int id;
       };

       struct Node {
           long long time;
           int user;
           int index;
           int id;

           bool operator<(const Node& other) const {
               return time < other.time;
           }
       };

       long long clock = 0;
       std::vector<Tweet> tweets[501];
       std::unordered_set<int> following[501];

   public:
       void postTweet(int userId, int tweetId) {
           tweets[userId].push_back({clock++, tweetId});
       }

       std::vector<int> getNewsFeed(int userId) {
           std::unordered_set<int> sources = following[userId];
           sources.insert(userId);

           std::priority_queue<Node> queue;
           for (int source : sources) {
               if (tweets[source].empty()) continue;
               int index = static_cast<int>(tweets[source].size()) - 1;
               const Tweet& tweet = tweets[source][index];
               queue.push({tweet.time, source, index, tweet.id});
           }

           std::vector<int> result;
           while (!queue.empty() && result.size() < 10) {
               Node current = queue.top();
               queue.pop();
               result.push_back(current.id);
               if (current.index == 0) continue;

               int previous = current.index - 1;
               const Tweet& tweet = tweets[current.user][previous];
               queue.push({tweet.time, current.user,
                           previous, tweet.id});
           }
           return result;
       }

       void follow(int followerId, int followeeId) {
           following[followerId].insert(followeeId);
       }

       void unfollow(int followerId, int followeeId) {
           following[followerId].erase(followeeId);
       }
   };

代码分析
--------

每个来源只把一条“当前候选”放入堆，弹出后再补该来源的上一条，因此不会漏掉时间更早但仍可能进入前十的推文；用集合并入本人也避免关注自己造成重复来源。若有 ``u`` 个来源，查询成本约为 ``O((u + 10) log u)``，发布和关系修改为平均 ``O(1)``，历史推文与关注关系占 ``O(T + F)`` 空间。
