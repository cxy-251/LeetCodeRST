知识账本结构
============

职责
----

``state/CONCEPT_LEDGER.toml`` 是活动知识账本总入口。每个五十题范围由一个稳定 manifest 和零个或多个
``state/concepts/ranges/<范围>/`` 活动数据分片组成。归档只保存迁移前原件，不参与正常读取。

权威 schema
-----------

``concept_state_v1``
  ``0001-0050`` 使用的历史平面状态文件。

``range_manifest_v1``
  manifest 直接声明范围、父范围、活动数据完整性和有序 ``shards``。读取器按顺序合并每个分片中的
  ``updates``、``concepts``、``problems`` 与 ``skipped``；同名键以后出现的值为准。manifest 可以通过 shard ``role`` 区分完整状态分片、旧题号记录和规范化补充分片。

活动数据规则
------------

#. manifest 与全部 shard 都必须位于 ``state/concepts/``；
#. 正常生成、审查和修复不得读取 ``archive/`` 才能恢复有效状态；
#. shard 中迁移前留下的 ``meta``、``inherits``、``batch`` 与 ``resolution`` 只作来源记录；当前继承顺序只由 manifest 定义；
#. 历史 shard 的 ``updates`` 若值本身包含完整 ``kind/introduced/last/occurrences/teaching_state/note``，按完整 concept 状态参与覆盖；
#. concept 状态必须保留 ``kind``、``introduced``、``last``、``occurrences``、``teaching_state`` 和 ``note``；
#. 缺少完整元数据的历史题必须由同范围的 ``normalized-concepts.toml`` 补齐，且注明来源；
#. ``problems`` 只提供题目到 concept ID 的辅助映射，不能替代 ``updates`` 或 ``concepts``；
#. 新题必须同时写入完整知识状态和题目映射，禁止只追加 ID；
#. composite 壳与 archive manifest 不属于活动解析链。

维护规则
--------

``0201-0250`` 仍是开放范围。后续题在该范围目录新增活动数据分片，并更新范围 manifest、problem index、
总索引和进度。跨过 0250 后创建 ``0251-0300.toml`` 与对应 ranges 目录。
