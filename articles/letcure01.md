* frist reason about virtual dom
  * problem it solve: update logic
* build a virtual dom
  * step 01 → createVDomElement and transform to dom, then mount it.
  * step 02 → diff two VDom and return a patch
  * step 03 → forrmat it’s api.

---

# Update Your UI Logic

假如今天有一隻 api GET `http://localhost:3000/fake` 會傳傳下面的資料，而你需要根據下面的資料做出一個簡易的 UI。再來，因為 data 可能改變，需要有一個 refresh button 給 user，讓使用者可以重新發起 api-call。


上面的例子中，每當有一個新的 api call 完成，我們就重新創造一次 UI。這樣的方法看起來沒問題，但其實我們不用每一次都創造一次新的 UI，也可以經由比對的方式減少對 DOM 的操作。所以，我們改寫部分的 `renderUIByCallAPI` function 中的邏輯。

[](https://codesandbox.io/embed/update-ui-logic-9hgngo?fontsize=14&hidenavigation=1&theme=dark)[https://codesandbox.io/embed/update-ui-logic-9hgngo?fontsize=14&amp;hidenavigation=1&amp;theme=dark](https://codesandbox.io/embed/update-ui-logic-9hgngo?fontsize=14&hidenavigation=1&theme=dark)

這樣的方法有什麼差別？我們可以由打開 devtool 中的 performance tab 去看清楚，這兩中方法的差別，

---

# Build a Virtual DOM

* init
  * **create** VDom
  * **transform** into DOM
  * **mount** it to root
* update
  * **create** VDOM
  * **diff** with old VDOM
  * **apply** patch to root

首先，我們必須完成 createElement, transform and mount it.三個步驟，

```tsx
type VirtualNode = {
	type: string;
	props: {}
}

type CreateElement = (type: string, props: {}) => VirtualNode;
type Transform = (VDOM: VirtualNode) => Node;
type Mount =  (dom: Node, replacedDOM: Node ) => void;
```

---

# Refactor API

---
