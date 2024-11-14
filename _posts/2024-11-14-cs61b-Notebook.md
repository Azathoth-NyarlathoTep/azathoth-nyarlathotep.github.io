---
title: Java Notebook
date: 2024-11-14 20:40:00 +0800
categories: [Notebook, cs61b-Notebook]
tags: [notebook]     
description: 用于记载学习cs61b过程中的笔记
---

## git命令一览

### 用于提交到github

```java
git init //用于初始化，会产生git文件
git remote add skeleton <你的仓库地址>//远程连接github仓库
git add --all//把该文件夹的所有东西移到暂存区，也叫staging(暂存)这个文件
git commit -m" "//把暂存区的文件移到本地版本库，等待提交
git push origin master//上传到GitHub(这一步有时候会连接不上，多试几次就行)
```

### 从远程仓库拉取代码(以cs61b为例)

我们会首先有`git clone <URL>`来克隆github上的代码，在完成这一步的同时，我们应该同时完成了地址的绑定，即用`git remote -v`可以显示出这一个仓库的地址，且显示为`origin`，同时可以接受`fetch`和`push`

```java
git remote add skeleton https://github.com/Berkeley-CS61B/skeleton-sp21.git // 这一步关联了一个远程仓库并命名为skeleton
git pull skeleton master//拉取代码，这一步有时候也会显示unable to connect
```

### 版本管理

git本身就是一个版本控制系统，所以有必要学习如何管理版本

> 注意切换版本前要保证工作目录干净

我们会先用`git init`来初始化这个文件夹，经过初始化的我们一般称之为`repository`，这告诉git我们要对这个文件夹进行版本控制

我们可以通过`git log`l获得git日志，每一次commit都会被记录在log中，且每一版都会跟着一个序号用于版本控制
用`git checkout b6e49829706f52946606a786bd7fcd6eff23860c`来返回到之前的某个版本
若是要重回最新的主版本，则需要`git checkout master`来返回

### 其他

```java
git status//查看当前本地状态，会显示当前Git本地仓库和暂存区与远程仓库之间的差异情况
git remote -v//显示连接了什么仓库，怎么连接的
/*如cs61b的这次仓库
origin     https://github.com/Azathoth-NyarlathoTep/cs61b-note.git (fetch)
origin     https://github.com/Azathoth-NyarlathoTep/cs61b-note.git (push)
skeleton   https://github.com/Berkeley-CS61B/skeleton-sp21.git (fetch)
skeleton   https://github.com/Berkeley-CS61B/skeleton-sp21.git (push)
其中origin是远程仓库的默认名称，skeleton是用命令命名的名称
fetch指可以从远程仓库获取更新到本地
push指可以把本地的改动推送到远程仓库
*/
```

## P4

### 4.2 Extends,Casting,Higher Order Functions

java中用extends来直接继承另一个类作为父类的所有成员（即所有的变量以及函数等，除了构造函数）

当在子类中调用构造函数后，会默认先执行父类的构造函数，这是合理的，毕竟父类中的一些初始化设置不能忽略，即构造函数

```java
public VengefulSLList(){
    deletedItems = new SLList<Item>();
}
```

和下述调用父类构造函数的构造函数本质上是一样的

```java
public VengefulSLList(){
    super();
    deletedItems = new SLList<Item>();
}
```

### 4.3 Subtype Polymorphism vs. HoFs

下面先来看一个有关静态类型和动态类型分辨的程序

```java
Object o2 = new ShowDog();//这里o2静态类型是Object而其动态类型是ShowDog

ShowDog sdx = ((ShowDog)o2);//静态类型同为ShowDog，故编译器通过，这里(ShowDog)就是强制转换，它告诉编译器将o2当作ShowDog对待(意思就是强制转换只在这一句生效，不会发生持久性的影响)
sdx.bark();//看sdx的静态类型，判断其有无bark函数，判断有之后再以动态判断bark出去

Dog dx = ((Dog)o2);//强制转换通过静态类型编译
dx.bark();

((Dog)o2).bark();//先看Dog类型有无bark方法，看其有之后再用o2动态类型的bark方法

Object o3 = (Dog)o2;
o3.bark();//在这里编译器会报错，因为静态Object类并没有bark方法，因而不能通过编译
```

那么假设我们要完成一个max方法，它将返回一个数组中所有元素的最大值，但是如果参数为`Object`的话则无法直接进行比较，所以我们采用`Java`中自带的`Comparable`接口来完成这个操作

```
@Override
public int compareTo(Dog uddaDog) {
    return this.size - uddaDog.size;//这是在比较中常用的技巧，通过这样就不必有下面的冗长的比较语句
}
```

上述是在Dog类中继承了`Comparable`这个接口，重写了比较函数

```
public static Comparable max(Comparable[] items){
        int maxDog = 0;
        for(int i=0;i<items.length;i++){
            int cmp = items[i].compareTo(items[maxDog]);
            if(cmp>0) maxDog = i;
        }
        return items[maxDog];
    }
```

然后再在返回最大值的方法中进行调用，而`compareTo`方法是`Comparable`方法中有的，所以算是普适的，只要是继承这个接口的类都能作为参数传入这个方法

## P6

### 6.1 Lists,Sets,ArraySet

关于`Lists`和`sets`的用法较为简单，本课程中让我们自己实现一个``ArraySet``，包含``add()``,``contains()``和``size()``，这比较容易，但是当我们`add`一个`null`进去的话，可能会在后续`contains`判断的时候造成指向空指针的问题，比如

```
public boolean contains(T x){
        for(int i = 0; i < size; i++){
            if(items[i].equals(x)){     //这将直接查看二者在语义上是否相等而不会出现检查字符串而错误地去比较地址的错误
                return true;
            }
        }
        return false;
    }
```

这个时候进行到`items[i].equals(x)`，如果i指向的那个地方是个null,则它没有equal方法，会出现空指针错误，因而我们引出解决方案

```java
public void add(T x){
    if(x == null) {
        throw new IllegalArgumentException("can't add null");
    }
}
```

这是一种解决方法，这样会直接在存入`null`时隔断并报错，这样可以让用户知道为什么错误
或者

```
public boolean contains(T x){
        for(int i = 0; i < size; i++){
            if(items[i] == null){//考虑到null的情况
                return x == null;
            }
            if(items[i].equals(x)){     //这将直接查看二者在语义上是否相等而不会出现检查字符串而错误地去比较地址的错误
                return true;
            }
        }
        return false;
    }
```

这样直接判断是否出现空指针，直接将其作为一种情况考虑，也是一种解决方法

### 6.3 Iteration

我们能看到有一种迭代的方法

```
Set<String> s = new HashSet<>();
...
for (String city : s) {
    ...
}
```

这是一种迭代遍历set的一种方法，也叫`for-each`循环，这利用了迭代器，而迭代器本质上也是一个类对象，我们首先想一下一个对象如何实现这些

```
public Iterator<T> iterator(){
        return new ArraySetIterator();
    }

    private class ArraySetIterator implements Iterator<T>{//Java是强类型语言，而Iterator本质上是一个接口，若不继承会在上面iterator方法的时候因为静态类型不符合报错
        private int wizPos;
        public ArraySetIterator(){
            wizPos = 0;
        }

        @Override
        public boolean hasNext(){
            return wizPos < size;
        }
        @Override
        public T next(){
            T returnItem = items[wizPos];
            wizPos++;
            return returnItem;
        }
    }
```

java中就有Iterator这样的接口，其中`hasNext`和`next`方法是必须实现的
这样我们就有了迭代器,但是我们仍然不能用`for-each`循环来遍历,所以我们要让整个`ArraySet`实现`Iterable`接口,即`public class ArraySet<T> implements Iterable<T>`,这个接口要实现的方法是`Iterator<T> iterator()`

### 6.4 Object methods

#### toString()

在Java中，我们知道所有类都是继承自Object的，而Object中有自己的方法，它的`toString`方法是输出类似于`test.ArraySet@506e1b77`这样的十六进制地址，而如果是别的`set`或是`arrays`这样的结构实际上已经重写过`toString`方法，所以使用`System.out.println(javaset);`会输出`[5, 6, 7, 8]`这样的格式，所以当我们写自己的`arraySet`的时候也要重写toString方法

```java
@Override
    public String toString(){
        String returnString = "{";
        for(T item:this)
        {
            returnString += item + ",";
        }
        returnString += "}";
        return returnString;
    }
```

这样就可以输出形如`{1,2,3,}`这样的格式，但这有一个问题，在Java中，为了保证某种安全性，我们的String类型变量在设置之后是不可变的，因而每次加一个字符串进去都会复制一遍自己，这个复杂度是O($n^2$)的，所以我们选择线性的StringBuilder，这是可变的

```
@Override
    public String toString() {
        StringBuilder returnSB = new StringBuilder("{");
        for (int i = 0; i < size - 1; i += 1) {
            returnSB.append(items[i].toString());
            returnSB.append(", ");
        }
        returnSB.append(items[size - 1]);
        returnSB.append("}");
        return returnSB.toString();
    }
```

如上所示利用`StringBuilder`进行中间的加法操作

#### equals()

`equals()`和`==`是不一样的，`==`检查的是二者在内存中存储的东西是否相同，这对于基本类型来说是检查值是否相等，而对于对象来说，检查的是地址是否相同，举例来看的话

```
Doge fido = new Doge(5, "Fido");
Doge fidoTwin = new Doge(5, "Fido");
```

这创建了两个对象，他们里面的所有属性都是相同的，但若是用`==`检查的话，会返回`false`,这是因为二者存储的内存地址不一样
而对于默认类`Object`来说，`equals()`和`==`并无二致，都是判断的内存地址是否相同，但是很多类如`String`都重写了这个方法，而我们也可以重写它在我们自己的类中

## P8

### 8.2 Asymptotics I: An Introduction to Asymptotic Analysis

这一小节是对复杂度的一种分析，非常详细，首先引出题目如下

```
Determine if a sorted array contains any duplicates.
//即确定排序数组是否包含任何可重复项
```

这里有两种方法，一种是暴力的遍历，每一对间判断，另一种是利用排序特性依次判断，具体实现如下，但如何分析出第二种确实更优呢？

```
//Silly Duplicate: compare everything
public static boolean dup1(int[] A) {  
  for (int i = 0; i < A.length; i += 1) {
    for (int j = i + 1; j < A.length; j += 1) {
      if (A[i] == A[j]) {
         return true;
      }
    }
  }
  return false;
}

//Better Duplicate: compare only neighbors
public static boolean dup2(int[] A) {
  for (int i = 0; i < A.length - 1; i += 1) {
    if (A[i] == A[i + 1]) { 
      return true; 
    }
  }
  return false;
}
```

下面是两种算法的时间复杂度分析
`dup1`

| **operation**       | **symbolic count**  | **count, N=10000** |
| ------------------- | ------------------- | ------------------ |
| **i = 0**           | 1                   | 1                  |
| **j = i + 1**       | 1 to N              | 1 to 10000         |
| **less than (<)**   | 2 to ($N^2+3N+2)/2$ | 2 to 50,015,001    |
| **increment (+=1)** | 0 to $(N^2 +N)/2$   | 0 to 50,005,000    |
| **equals (==)**     | 1 to $(N^2-N)/2$    | 1 to 49,995,000    |
| **array accesses**  | 2 to $N^2-N$        | 2 to 99,990,000    |

`dup2`

| **operation**       | **symbolic count** | **count, N=10000** |
| ------------------- | ------------------ | ------------------ |
| **i = 0**           | 1                  | 1                  |
| **less than (<)**   | 0 to N             | 0 to 10000         |
| **increment (+=1)** | 0 to N - 1         | 0 to 9999          |
| **equals (==)**     | 1 to N - 1         | 1 to 9999          |
| **array accesses**  | 2 to 2N - 2        | 2 to 19998         |

我们会发现方法一是二次方的增长，所以几何直觉上我们知道法二的线性增长更好
现在用四个简化来正式解释其含义

### 1.只考虑最坏的情况

| **operation 操作**              | **count 计数** |
| ------------------------------- | -------------- |
| **less than (<) 小于 （<）**    | $100N^2 + 3N$  |
| **greater than (>) 大于 （>）** | $N^3 + 1$      |
| **and (&&) 和 （&&）**          | 5000           |
那么预计的增长顺序是什么？

> ​**Answer**​: It’s cubic($N^3$)

因为当N接近无穷大的时候$N^3$是占主导地位的，其他的远小于它，所以忽略

#### 2.选择代表性操作

#### 3.忽略低阶项

#### 4.忽略乘法常数

现在有了这些简化标准，我们可以重新分析dup1：
首先我们会先选择一个代表性的操作即我们的成本模型，而在这一个算法中我们选取的是`A[i] == A[j]`这个算式
经过计算这个算式最坏情况会执行`N(N-1)/2`次，而拆开来再舍弃最大的增长率之外的所有项和乘法常数之后，得出复杂度为$N^2$

对于这种增长的阶数，我们用`Order`即大$O$来表示，实例如下：

| function R(N)     | Order of growth |
| ----------------- | --------------- |
| $N^3 + 3N^4$      | $Θ(N^4)$        |
| $N^3 + 1/N$       | $Θ(N^3)$        |
| $5 + 1/N$         | $Θ(1)$          |
| $Ne^N + N$        | $Θ(Ne^N)$       |
| $40sin(N) + 4N^2$ | $O(N^2)$        |

> 注意当我们用$O$来表示一个算法的话，这个指的是一个上限，并不是所谓的最坏情况，即$O(N)$也属于$O(n^2)$，$O$只是一个范围

## P9 Disjoint Sets 并查集

由于本章内容不是很多，因此直接总的来写了
我们发现，并查集并不关心内部之间是怎么具体连接的，因此我们只要考虑不同点之间是否存在于同一个集合即可

## P11 Balanced Trees

当数据是随机插入的时候，可以证明最终形成的数是浓密的，即用二叉搜索树可以实现$logn$的复杂度搜索，且其深度和高度都是$Θ(logn)$的，但实际情况的数据并不往往都是随机插入的，比如如果是实时插入的话我们将被迫按照数据到达时间的顺序来存储，这就引出平衡树

如果想看b-tree具体的插入过程详见[https://tinyurl.com/balanceYD](https://tinyurl.com/balanceYD)

### B-Trees

BST之所以会有问题是因为我们总是在叶子节点添加新的节点，因而会出现高度不断增加的情况，如果我们只添加到当前节点就可以维持高度不变
但是如果只一味添加在某个节点，那么在查询该节点的时候还是$N$的，所以我们想到在单个节点中的元素数量设置限制，比如如果限制为4的话，就要在当前节点达到4个元素的时候把中间偏左的节点向上凸起，这个相较于BST而言有凸起的这个操作，就能保证动态的维护整个数据结构
注意B-tree中添加值的时候都是遍历到叶子节点再添加，判断完是否凸起之后再进行更新
B-tree始终能保证以下两点不变

#### 1.所有叶子节点到根节点的距离都是相同的

#### 2.所有有k个元素的非叶子节点都有k+1个子节点

这些不变点使得整个B-tree一直是茂密的，因而在搜索时能保证$logN$的复杂度
虽然我们同时给每个节点设置了一个限制元素上限L，这个L通常称之为阶，但是如果加进去也是$LlogN$的，这只是加了个乘法常数的复杂度，因而算不得什么

> 总结：B-tree可以帮你有效处理任何插入顺序，因而在数据库的应用中极为广泛

### LLRB

但因为B-Tree的实现非常困难，因而引出红黑树，而在本节中讨论的是左倾红黑树(LLRB)，抽象代码如下

```
private Node put(Node h, Key key, Value val) {
    if (h == null) { return new Node(key, val, RED); }
    int cmp = key.compareTo(h.key);
    if (cmp < 0)      { h.left  = put(h.left,  key, val); }
    else if (cmp > 0) { h.right = put(h.right, key, val); }
    else              { h.val   = val;                    }

    if (isRed(h.right) && !isRed(h.left))      { h = rotateLeft(h);  }
    if (isRed(h.left)  &&  isRed(h.left.left)) { h = rotateRight(h); }
    if (isRed(h.left)  &&  isRed(h.right))     { flipColors(h);      } 

    return h;
}
```
