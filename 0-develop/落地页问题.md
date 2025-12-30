### 一、所有模板的时间范围都是从8:00~16:00，这是为什么？

- 不同模板，根据计划的不同，应该有区分度
- 就比如`Workout Schedule Builder`和`Employee Schedule Builder`时间范围的设定可能就是不一样的

### 二、预览图上的事件卡片超出了正常的时间范围，所以导致事件卡片显示不全

- 所以模板上的事件卡片，应该根据模板上的时间轴上的时间进行合理规划。

![image-20251217124543777](./assets/image-20251217124543777.png)

### 三、每个事件模板除了附带事件卡片的信息

也应该附带`sidebar.tsx`里的`SettingsDialog.tsx`的信息：

- 是否`Start week on Sunday`，不同模板是不是可以有不同的设置？
- 是否`12-hour format (AM/PM)`，不同模板是不是可以有不同的设置？
- `Time increment`是多少，不同模板是不是可以有不同的设置？
- `Working hours`从几点到几点，不同模板是不是可以有不同的设置？

### 四、该模板下的事件卡片的`Json`信息里

- `builderType`的值要正确，比如模板是`College Class Schedule Builder`，那么该模板下的所有事件卡片的`Json`信息里的`builderType`的值也是`College Class Schedule Builder`

### 四、当我使用该模板时，把这些信息带入到日历视图中，同时修改`SettingsDialog.tsx`成对应的设置。