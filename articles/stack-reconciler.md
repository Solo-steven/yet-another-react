# Stack Reconciler

這個 memo 紀錄 `packages/stack-reconciler` 的內容。

---
## Three Layer Model
在 `packages/virtual-dom` 中，我們實作出來一個 Virtual DOM，讓我們可以經由改寫 Javascript API 的方法去更動，讓我們不用實際操作 DOM API。同時，我相信也有很多人聽過 React 是用 Virtual DOM，所以可能以為 createElement 出來的 Element 就是 Virtual DOM，但其實 React 使用了兩層的 Tree Struture 去達到更複雜的 Virtual DOM。

### Element Tree
相信大家都知道 React 中的 JSX 其實就是 createElement 的存在(註一)，例如下面第一個區塊的程式碼可以經由 Babel 轉為下面第二個區塊的程式碼。轉換的方法是使用 babel playground :
```jsx
const Component = (
    <div>
        <h2> Title </h2>
        <p>
            Content
            <span color="blue"> Span One </span>
            <span> Span Two </span>
        </p>
    </div>
)
```
```js
 const Component = React.createElement(
        "div", 
        null, 
        React.createElement("h2", null, " Title "), 
        React.createElement(
            "p",
             null, "Content",
             React.createElement("span", { color: "blue"}, " Span One "),
             React.createElement("span", null, " Span Two ")
        )
    );
```
而 React.createElement 的 API 會回傳一個包含 type 跟 props 的物件(註二)，我們稱為 `Element` 詳細的 API Reference 是：

其中的 type 包含所有在 DOM 中可以使用到的 tag。props 則是在 React 中 Component 的 Props ，會包含一個 `children` 的 Array，並還有其他 Parent Component 傳進入的 data。
而 Fucntion 或是 ClassComponent 只是把 type 從字串變成 Function or Class，以下面為例子，可以看到多出的 App Function 會變成另外一個 `createElement`，
```jsx
const Component = () => (
    <div>
        <h2> Title </h2>
        <p>
            Content
            <span color="blue"> Span One </span>
            <span> Span Two </span>
        </p>
    </div>
)

const App = <Component/>
```
```js
const App = React.createElement(Component, null);
```
而我們所有寫的 React Component，最後都必須使用 render method 去渲染，而 render method 接受的參數，其實就是一個 Element。***所以我們寫的 React，其實就是一個 Element Tree*** 。

### Fiber Tree
Element Tree 是給 Develop 寫的 API，而真正處理 React 邏輯，像是跟 DOM 互動，或是 hook 跟 class instance 的邏輯 implement，都是在這層上面。

### DOM Tree
最後當然是 DOM Tree，而 Fiber Tree 跟 DOM tree 的互動並不是直接使用 DOM API，而是經過另外一層的 function 去 Wrap  DOM API，這樣的原因，是這樣可以實際 UI 的 API 不被 DOM API 綁住，讓 React 可以支援像是 Native 等等其他平台。

---
## Create A Tree


---
## Reconciler Two Tree

---
## Refererence

- https://github.com/facebook/react/blob/v18.2.0/packages/shared/ReactElementType.js



