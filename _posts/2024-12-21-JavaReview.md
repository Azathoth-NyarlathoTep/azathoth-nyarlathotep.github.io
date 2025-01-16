# Java Review

## CH 3
### 标识符
即给变量，常量，方法，类等定义的名字。需要满足规定 —— 可以由字母，数字，下划线和美元符号(\$)组合而成，但***不可以数字开头***，也***不可以是Java中的保留字***。

### 字符类型
不同于C中字符类型的***ASCII编码且占据一个字节***，Java中的字符类型编码是***Unicode编码且占据两个字节***。

### 类型转换
```
byte,short,char -->int —->long -->float -->double
```
- **显式类型转换** ：将***高级别变量赋值给低级别***时，用显式类型转换也称强制类型转换，即
    ```
    int x = 1;
    byte y = x;		//错误
    byte z = (byte)x;	//正确
    ```
- **隐式类型转换** ：与上述对应的即将***低级别赋值给高级别***，则系统会自动完成。

> 但是如果强制转换极有可能出现溢出的情况，如下
```
double velocity = 123456.789;
short convertedVelocity = (short) velocity;
```
最后得到的结果是-7616，明显不对，这是因为取整数位123456的二进制有20位`0001 1110 0010 0100 0000`，而short类型最多只有16位，因此只能**取double的前16位**即`1110 0010 0100 0000`，这些在计算机中都是以**补码形式**存储的，因而我们要转换成原码即**减一再除了符号位取反或者取反再加一(这两个过程得到结果一样，可证明)**，得到原码`1001 1101 1100 0000`，转换为十进制即-7616。

### 注释
**单行注释** ：`//注释的内容`

**多行注释** ：
```
/*
    注释的内容
*/
```

**文档注释** ：
文档注释后文件可以通过javadoc某些配置生成文档html文件，方便阅读。
```
/**
    文档注释主要是支持JDK工具javadoc，它能识别一些用@标记的特殊变量
    如：
    	@see:引用其他类
	@version：版本信息
	@author：作者信息
	@param:参数名说明
	@return：说明
	@exception：异常说明
*/
```

### switch-case 语句
case决定入口，break决定出口，如果满足一个case但是当前case没有break，则会一直执行后面的case直到下一个break或者结束。

## CH4 类，包和接口
### 构造函数
java中构造函数前也可以用public、protected和private等修饰

如果想用`this`来调用自己的构造函数，则需要**将其放在任何可执行命令前面**，即第一行
```
public class Circle{
    private double x;
    public Circle(double x) {
        this.x = x;
    }
    public Circle() {
    	this(1.0);	//如果在此之前加可执行命令则错误。
    }
}
```

### 继承extends
继承的关键字是`extends`，跟父类是***is-a***关系，能继承父类所有**可访问**的字段和方法，这个可访问即能继承`private`修饰的**以外**的字段和方法(但是不包括构造方法)

***Java只能继承一个父类，不允许多重继承***

虽然无法直接继承构造方法，但是可以通过`super()`方法来调用父类的构造函数，且这个方法也需要在首行给出，如果未显式调用，则会**默认隐式调用没有参数的构造函数**，如果有参数则必须要显式调用否则会报错。(实际上`super`就是指代父类的关键字，用法与`this`如出一辙)

由上述可知***不可能同时显式***调用`super()`和`this()`方法。

**PS ：所以一般应为每一个类提供一个无参数的构造方法，以便于继承并避免错误**

### 包
使用`package packageName;`来创建包，且此语句必须作为程序中**第一个非注释和非空白语句**，且每个源文件至多可以有一条package语句。

Java编译器会自动为每个源文件导入两个包，`java.lang`和当前文件的程序包。

### 抽象类和方法

### 接口
不同于类的继承`extends`，接口用的是实现`implements`，且一个类可以实现多个接口。

在接口中默认只有`public static final` 和 `public abstract` 两个类型，所以下面两种是等价的：
```
public interface T {
    public static final int K = 1;
    public absract void p();
}

public interface T {
    int K = 1;
    void p();
}
```

在Java8之后，还可以提供默认实现和公有静态方法：
```
public interface A {
    public default void doSomething() {
	System.out.println("Do Something.") ;
    }

    public static int getValue() {
    	return 0;
    }
}
```

还有一些常见的接口详见我的`Java Notebook`.

## CH5 深入理解Java语言
> 众所周知，面向对象语言的三大特征就是封装、继承和多态
### 多态
在Java中，存在**编译时多态和运行时多态**，其中编译时多态即指重载(overload)，同时决定编译是否通过的是其静态类型，一般`Dog dog = new ShowDog;`这样的语法，`Dog`即其静态类型，后者`ShowDog`即其动态类型，即决定其运行时的实际类型。

像上述例子中的类型转换分为两种：
- 向上转换：将子类转化为父类，如`Fruit fruit = new Apple();`，也称隐式转换。
- 向下转换：将父类转换为子类，如`Apple apple = (Apple)fruit;`，也称显式转换。

来看一种情况有助于理解静态和动态:
```
Object o3 = (Dog)o2;
o3.bark();
```
这样的语句是无法通过编译的，为什么？我们刚刚说过，**静态类型决定其能否通过编译**，这里Dog是继承Object的没错，但是Object中没有`bark()`方法，因而在执行到这的时候不会通过。但如果Object中有这个方法(不会有的)，那么就轮到动态类型的问题，即其实际上**动态类型是Dog，因而会用Dog中的方法bark出来**。

### 包装类(Wrapper Classes)
> Java中通过使用包装类，可以将基本数据类型值作为对象来处理，这些包装类定义在**java.lang包**中

**装箱和拆箱** ：将基本数据类型转换为包装类对象的过程称为装箱，反之为拆箱

考虑使用场景的话，Integer出现在需要考虑对象特性的场所，如在集合类中使用或者需要表示null的情况。

**注意** ：Integer数组不能直接放入sort比较，因为其中若有**null对象**，则会出现**空指针引用的报错**。

## CH6 异常处理
**Throwable** ：属于`java.lang`包，是所有异常类的父类，在其中定义了描述异常发生的位置和所有异常类共同需要的内容。

一般java中的异常分为必检异常(Checked Exception)和免检异常(Unchecked Exception)，而平常的**RuntimeException和Error**等就属于免检异常，这类异常通常代表不可恢复的错误，是需要程序员来修改代码的内容，而必检异常一般是面向用户的，在使用时出现的问题，比如输入输出异常，其中的文件读写异常，还有网络异常等等。

**声明异常** ：Java中每个方法都必须声明其可能抛出的异常，格式如
```
public void myMethod() throws ExceptionType
```



## CH8 线程
> 进程，一般对于操作系统而言，比如同时玩游戏和收取邮件，这就是同时运行两个进程。

>线程，便是相对于同一个程序而言，一个程序在同一个时间执行多个任务，这就是不同的线程。

通过继承`java.lang.Thread`来创建一个线程，并且加入属性和方法覆盖`run()`方法，然后创建我们的类的实例化对象，调用`start()`方法启动线程。

`run()`方法称为线程体，正如上面所说线程是执行的多个任务，那么你想让这个线程做什么任务，就要写入`run()`方法中定义其行为。

**但是由于继承了`Thread`类之后便不能继承别的类，所以一般选择实现`Runnable`接口**

## CH9 流、文件
不论是**在字符流中**的**输入(Reader)和输出(Writer)**，还是**字节流**中的**输入(InputStream)和输出(OutputStream)**，都是抽象类


## CH 10 GUI
> Swing是在AWT基础上发展的一个更高级的库，更为轻量且组件丰富

### Jframe
继承自AWT中的Frame，它是Swing提供的一个顶层容器类，用于创建应用程序的主窗口

框架在构建后需要提供一些它的属性，如如何关闭窗口，是否可见、大小等、这些一般都是用其`setter`方法设置的，示例如下：
```
JFrame frame = new JFrame("Swing Example");
frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);	//设置默认的关闭方式
frame.setSize(400,300);			//设置主窗口的大小，两个参数分别为组件的宽度和高度
frame.setLayout(new BorderLayout());	//设置主窗口的布局
frame.setVisible(true);			//设置窗口可见(一般在最后设置为可见)
```
与之相应的，整体框架可以通过添加各种组件使得框架变得完整，原则上可以直接添加别的基础组件如`button`等在frame中，但是为了更好的组织建议先填入panel中再构成整体框架
```
frame.add(panel, BorderLayout.CENTER);	//在布局中心添加此面板
```

### JPanel
Swing的中间容器类，相当于在JFrame上进一步细分整个框架，并将其他组件填入这个容器

与JFrame类似，它也可以通过`setter`方法来设置其属性，如布局等

```
JPanel panel = new JPanel();
panel.setLayout(new BorderLayout());
```
与之相应的，Panel中也可加入别的组件来构成完整的panel
```
panel.add(button, BorderLayout.CENTER);	//将按钮实例以布局中心的方式添加进去
```

### 常见布局(Layout)
**GridLayout** ：将容器分为若干列和行的网格
**BorderLayout** ：将容器分为五个区域，东西南北中，每个区域只能容纳一个组件

## Hints
### Java中输出对null的引用问题
先来看看这一段代码
```
String s;
System.out.println(s);
```
这是小雅的一道题，这里因为String是引用类型，而这里s并未有对任何地方有引用，所以会编译失败。

再来看这一个
```
String s = null;
System.out.println(s);
```
这里就不会编译失败了，因为虽然声明其不指向任何东西，但确实不会是空引用了，且会输出`null`，这是因为当打印一个引用型变量时，如果没有对其`toString()`方法有所重写，则会打印其地址，而这指向`null`所以这么打印，而如果是`if(s == "null") doSomething;`，则不会dosomething。

为了验证这个想法看看下面的语句
```
Dog dog = null;
System.out.println(dog);
```
则输出`null`，good，这说明我们的想法都得到验证。

### Java中Integer和int的区别
- int ：是java中的基本数据类型，存储在栈(stack)中且效率高不需要额外的内存开销。基本数据类型不能为null，有固定的大小(32位)
- Integer ：是java中的包装类，用于包装int，其对象存储在堆(heap)中，可以为null。

**详见CH5**

对于这一点，给出下列语句 ：
```
Integer m = 127;
Integer n = 127;
System.out.println(m==n); //true

Integer p = 128;
Integer q = 128;
System.out.println(p==q); //false
```
这是因为java***对-128~127***范围内的数在装箱的时候会选择缓存这些值，使得在这个范围内的数(如127)都存在一个地址，所以即使是`==`这样比较地址的判断也是true的，而超出这个范围的(如128)，会存在两个地址，所以是false(**如果是equals判断则没有问题**)
