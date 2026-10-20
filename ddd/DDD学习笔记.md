# DDD（Domain-Driven Design）学习笔记

## 一、什么是 DDD

DDD 是 Eric Evans 在 2003 年提出的一套**软件设计方法论**，核心思想是：**软件的复杂度应该来自业务领域本身，而不是技术实现**。设计软件时，应该以业务领域为中心，让代码反映真实的业务模型。

---

## 二、核心概念

### 2.1 领域（Domain）

软件要解决的业务问题空间。比如电商领域的"下单、支付、库存"，就是领域。

### 2.2 领域模型（Domain Model）

对业务概念的抽象表示。不是数据库表结构，而是业务语言中的实体和规则。

### 2.3 统一语言（Ubiquitous Language）

开发者和业务人员使用**同一套术语**来沟通。代码中的类名、方法名直接用业务术语，而非技术术语。

```java
// 反面 — 技术语言
dao.updateStatus(orderId, 3);

// 正面 — 业务语言
order.pay();
```

### 2.4 限界上下文（Bounded Context）

不同业务模块中，同一个词可能有不同含义。限界上下文划清这个边界，每个上下文有自己独立的模型。

详见下文第六节。

---

## 三、战术模式（代码层面）

| 概念 | 说明 | 代码形态 |
|---|---|---|
| **聚合根** (Aggregate Root) | 聚合的入口，负责维护内部一致性 | 实体类，如 `class Order` |
| **实体** (Entity) | 有唯一标识，生命周期可追踪 | 类，如 `class OrderItem` |
| **值对象** (Value Object) | 没有唯一标识，靠属性值判断相等，不可变 | 不可变类，如 `class Money` |
| **领域事件** (Domain Event) | 表示领域中发生的有意义的事情 | 类，如 `class OrderSubmittedEvent` |
| **仓储** (Repository) | 模拟集合的持久化接口，只暴露聚合根的存取 | 接口，如 `interface OrderRepository` |
| **领域服务** (Domain Service) | 不属于任何实体的业务逻辑 | 类，如 `class TransferService` |
| **枚举** (Enum) | 有限状态集合 | 枚举，如 `enum OrderState` |

---

## 四、分层架构

```
┌─────────────────────────┐
│   用户界面层 (UI/API)     │  ← 接收请求，返回响应
├─────────────────────────┤
│   应用层 (Application)    │  ← 编排流程，不含业务规则
├─────────────────────────┤
│   领域层 (Domain)         │  ← 核心业务逻辑，不依赖外部
├─────────────────────────┤
│   基础设施层 (Infra)       │  ← 数据库、消息队列、外部API
└─────────────────────────┘
```

关键原则：**领域层不依赖任何外层**。数据库、框架都是可替换的，业务规则才是核心。

---

## 五、聚合与聚合根

### 5.1 概念 vs 类

| 术语 | 本质 |
|---|---|
| **聚合** (Aggregate) | 概念，逻辑分组，没有对应的 class |
| **聚合根** (Aggregate Root) | 代码，具体的类，如 `class Order` |

关系：**聚合是整个家族，聚合根是族长。**

```
┌─ Order（聚合）──────────────────────────┐
│                                         │
│   Order ← 聚合根（族长）                  │
│   ├── OrderItem（实体）                  │
│   ├── OrderItem（实体）                  │
│   ├── ShippingAddress（值对象）           │
│   ├── OrderMoney（值对象）               │
│   └── OrderState（枚举）                │
│                                         │
└─────────────────────────────────────────┘
```

### 5.2 聚合内部 vs 聚合之间

```java
// 聚合内部 — 直接调用，事务一致
order.addItem(coffee, 2);

// 聚合之间 — 通过领域事件解耦
OrderSubmittedEvent event = order.submit();
// 事件驱动：
//   → CouponService 听到事件，标记优惠券已使用
//   → InventoryService 听到事件，扣减库存
```

### 5.3 一个领域模型可以有多个聚合

```
order/                          ← 订单领域的领域模型
├── Order.java                  ← 聚合根（聚合1：订单）
│   ├── OrderItem.java          ← 聚合内部实体
│   └── OrderMoney.java         ← 值对象
│
├── ShoppingCart.java           ← 聚合根（聚合2：购物车）
│   └── CartItem.java           ← 聚合内部实体
│
└── Coupon.java                 ← 聚合根（聚合3：优惠券）
    └── CouponRule.java         ← 值对象
```

聚合之间**通过 ID 引用**，不直接持有对方：

```java
// Order 引用 Coupon，但不持有 Coupon 对象
private CouponId appliedCouponId;  // 值对象，只是个标识
```

### 5.4 聚合边界怎么画

| 问题 | 答案指向 |
|---|---|
| 这两个对象必须在**同一个事务**中修改吗？ | 是 → 同一个聚合 |
| 这个对象离开另一个对象能**独立存在**吗？ | 能 → 不同聚合 |
| 这个对象是被**整体替换**还是**独立生命周期**？ | 整体替换 → 值对象；独立生命 → 另一个聚合的引用 |

### 5.5 持久化也体现聚合根的门卫角色

```java
// 只有聚合根有仓储，没有 OrderItemRepository
public interface OrderRepository {
    Order findById(OrderId id);      // 查出来是整个聚合
    void save(Order order);          // 存进去也是整个聚合
}
```

---

## 六、限界上下文（Bounded Context）

### 6.1 核心思想

同一件事，在不同场景下长不同的样子。

现实中"商品"的例子：

| 场景 | 关注什么 | 不关心什么 |
|---|---|---|
| 仓库管理员 | 库位、重量、长宽高 | 价格、评价 |
| 销售 | 价格、折扣、促销 | 库位、重量 |
| 客服 | 退换货政策、保修期 | 库位、价格 |
| 物流 | 体积、重量、是否易碎 | 价格、评价 |

### 6.2 代码层面

同一个"咖啡"在不同上下文中的样子：

**菜单上下文（Menu Context）**

```java
public class Coffee {
    private String name;
    private Money price;
    private String description;
}
```

**库存上下文（Inventory Context）**

```java
public class CoffeeStock {
    private String coffeeName;
    private int quantity;
    private String warehouseLocation;
}
```

**订单上下文（Order Context）**

```java
public class CoffeeLineItem {
    private String coffeeName;
    private int quantity;
    private Money subtotal;
}
```

它们之间通过**名字或 ID** 关联，而不是共享一个类。

### 6.3 为什么不能用一个类

```java
// 大一统模型 — 反面教材
public class Coffee {
    private String name;
    private Money price;
    private String description;      // 菜单需要
    private int stock;               // 库存需要
    private String warehouse;        // 库存需要
    private String returnPolicy;     // 客服需要
    private double weight;           // 物流需要
    private double volume;           // 物流需要
    private List<Review> reviews;    // 营销需要
}
```

问题：
- 菜单团队改了 `name`，订单团队的逻辑可能挂掉
- 库存团队加个字段，要等所有团队都同意
- 一个类十几个字段，没人知道哪些跟自己有关

### 6.4 上下文之间的映射关系

| 模式 | 含义 |
|---|---|
| **共享内核** (Shared Kernel) | 两个上下文共享一小部分模型 |
| **客户-供应商** (Customer-Supplier) | 上游提供数据，下游消费 |
| **防腐层** (Anti-Corruption Layer) | 下游建一层适配器，隔离上游模型 |
| **开放主机服务** (Open Host Service) | 上游提供标准 API 供多个下游调用 |

---

## 七、完整领域模型代码示例

```
order/
├── Order.java                 ← 聚合根
├── OrderId.java               ← 值对象（标识）
├── OrderItem.java             ← 实体（聚合内部）
├── OrderState.java            ← 枚举（状态机）
├── OrderMoney.java            ← 值对象（金额计算）
├── OrderSubmittedEvent.java   ← 领域事件
├── OrderRepository.java       ← 仓储接口
└── OrderService.java          ← 领域服务
```

### 聚合根

```java
public class Order {
    private OrderId id;
    private String customer;
    private List<OrderItem> items = new ArrayList<>();
    private OrderState state = OrderState.DRAFT;
    private OrderMoney total;

    public void addItem(Coffee coffee, int quantity) {
        if (state != OrderState.DRAFT) {
            throw new IllegalStateException("已提交的订单不能修改");
        }
        items.add(new OrderItem(coffee, quantity));
        recalculateTotal();
    }

    public OrderSubmittedEvent submit() {
        if (items.isEmpty()) {
            throw new IllegalStateException("空订单不能提交");
        }
        this.state = OrderState.SUBMITTED;
        return new OrderSubmittedEvent(this.id, this.customer, this.total);
    }

    private void recalculateTotal() {
        this.total = items.stream()
            .map(OrderItem::subtotal)
            .reduce(OrderMoney.ZERO, OrderMoney::add);
    }
}
```

### 值对象

```java
public class OrderMoney {
    private final BigDecimal amount;
    private final Currency currency;

    public OrderMoney multiply(int factor) {
        return new OrderMoney(amount.multiply(BigDecimal.valueOf(factor)), currency);
    }

    public OrderMoney add(OrderMoney other) {
        assertSameCurrency(other);
        return new OrderMoney(amount.add(other.amount), currency);
    }
}
```

### 领域事件

```java
public class OrderSubmittedEvent {
    private final OrderId orderId;
    private final String customer;
    private final OrderMoney total;
    private final LocalDateTime occurredAt;
}
```

### 仓储接口

```java
public interface OrderRepository {
    Order findById(OrderId id);
    void save(Order order);
    List<Order> findByCustomer(String customer);
}
```

### 领域服务

```java
public class OrderService {
    private final OrderRepository repository;
    private final InventoryService inventory;

    public Order createOrder(String customer, List<OrderRequest> requests) {
        Order order = new Order(customer);
        for (OrderRequest req : requests) {
            Coffee coffee = inventory.findCoffee(req.getCoffeeName());
            if (!inventory.isAvailable(coffee, req.getQuantity())) {
                throw new OutOfStockException(coffee.getName());
            }
            order.addItem(coffee, req.getQuantity());
        }
        return order;
    }
}
```

---

## 八、各类的职责边界

| 类型 | 有 ID？ | 可变？ | 职责 |
|---|---|---|---|
| **聚合根** (Order) | 有 | 是 | 维护内部一致性，暴露行为 |
| **实体** (OrderItem) | 有 | 是 | 聚合内部的对象，通过聚合根访问 |
| **值对象** (OrderMoney, OrderId) | 无 | 不可变 | 描述属性，靠值判等 |
| **枚举** (OrderState) | 无 | 不可变 | 有限状态集合 |
| **领域事件** (OrderSubmittedEvent) | 无 | 不可变 | 记录发生了什么 |
| **仓储接口** (OrderRepository) | — | — | 持久化抽象，实现放在基础设施层 |
| **领域服务** (OrderService) | — | — | 跨实体/跨聚合的业务逻辑 |

---

## 九、什么时候用 DDD

| 适合 | 不适合 |
|---|---|
| 业务逻辑复杂（金融、电商、物流） | 简单 CRUD 应用 |
| 团队规模较大，需要统一语言 | 小型项目、原型 |
| 长期维护的核心系统 | 一次性脚本或短期项目 |

---

## 十、总结

- **概念管"怎么想"，类管"怎么写"** — 聚合、领域模型、限界上下文是脑中的画布；聚合根、实体、值对象是画布上的笔触
- **领域模型是一个团队，不是一个人** — 聚合根是队长，值对象是工具，实体是队员，事件是传话筒
- **聚合是房子，聚合根是门** — 所有人只能从门进出，内部秩序由门卫保证
- **限界上下文就是给不同场景画墙** — 同一个业务概念在不同场景下含义不同，就应该有各自的模型，各自独立演进
- **DDD 不是技术框架，而是一种思维方式** — 让代码忠实地反映业务，而不是让业务去迁就技术
