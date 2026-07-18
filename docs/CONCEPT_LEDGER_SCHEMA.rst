知识账本结构
============

职责
----

``state/CONCEPT_LEDGER.toml`` 是活动知识账本总入口。题号按五十题范围划分，每个范围只对应一个
``state/concepts/<起点>-<终点>.toml`` 活动平面状态文件。归档只保存迁移前原件，不参与正常读取。

权威 schema
-----------

``concept_state_v1``
  每个范围文件包含 ``[meta]`` 和 ``[concepts]``。每个 concept 使用稳定 ID，并完整保存
  ``kind``、``first_problem``、``last_problem``、``occurrences``、``teaching_state``、
  ``difficult`` 与 ``note``。

``fifty_problem_ranges``
  总入口的 ``[records]`` 按题号顺序列出各范围文件，``[schemas]`` 声明其 schema。
  读取器依次合并 ``[concepts]``；同一稳定 ID 在后续范围再次出现时，以后续完整状态覆盖早期状态。

活动数据规则
------------

#. 总入口列出的范围文件必须全部位于 ``state/concepts/``，正常读取不得依赖 ``archive/``；
#. 每个五十题范围只有一个活动 TOML，不创建单题、小批次、manifest、catalog 或 shard；
#. 新题首次引入 concept 时，在题号所属范围文件写入完整状态；
#. 后续题强化既有 concept 时，沿用原稳定 ID，在当前题所属范围写入包含历史累计值的完整覆盖状态；
#. 禁止为同一概念新造近义 ID；发现近义重复时保留较早的稳定 ID并合并累计状态；
#. ``first_problem`` 保持首次出现题号，``last_problem`` 更新为最近题号，
   ``occurrences`` 反映累计出现次数；
#. ``teaching_state`` 只能使用 ``introduced``、``reinforcing``、``familiar``、``refresh`` 或
   ``mastered``；
#. ``state/CONCEPT_LEDGER.toml`` 的 ``last_problem`` 和 ``version`` 与活动范围状态同步；
#. 迁移前文件、manifest 和 shard 只可保存在 ``archive/state/concepts/``，不得重新接入活动解析链。

维护规则
--------

``0201-0250`` 当前仍是开放范围。后续题直接更新 ``state/concepts/0201-0250.toml`` 和总入口；
跨过 0250 后创建 ``state/concepts/0251-0300.toml``，并在总入口按题号顺序登记。

任何表示方式迁移必须在一个原子提交中同时更新总入口、全部活动数据、本文、根 README、
``PROGRESS.toml`` 和漂移回归，不能让 manifest/shard 与平面文件两套活动描述并存。
