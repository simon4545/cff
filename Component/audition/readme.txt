
------------------------------------------------------------------------------------------------------------------------

组件功能说明：

    该组件主要实现试音功能的整体流程，主要有：耳机选择、耳机正确佩戴、flash安全面板设置、试音、试音结果展示；

组件引用说明：

    （1）下载最新组件：

         引用 Component 和 Build 文件  （文件最好放在相对网站访问的根路径下）

    （2）配置引用文件路径（Build/config.js）

         例如：在 template/audition/audition.html文件中引用该组件（template和引用文件同级目录）配置如下：
            则：
            exports.config={
                'templates':'template/audition/audition.html'    //相对于根路径
            };
            exports.baseUrl='/'; // 项目的相对URL,一般情况下为/,如果项目不是在网站根目录，如sns目录下，则改为/sns/

     （4）调用组件

         a:引用界面添加div承载该组件：<div id="audition"></div> ；

         b:组件调用：<@tagLib::Component name="audition" imagePath="./images" callback="CallBack" output="link"></@tagLib>

         注：
            a:承载div放在调用之前；
            b:output: 1、link 外联形式；2、html 嵌入引用界面形式；
            c:name: 调用组件名（与Composition目录下的组件文件夹名称一致）

     （3）build文件 （Build/build.bat）

         执行build.bat文件，如果第二步配置正确会自动编译调用组件的文件，从而生成最新的文件引用；

         注：
            每次修改组件或调用组件方法后都需要重新build一次，这样保证编译生成最新修改；

组件引用注意点：

      （1）该组件应用了语音评测功能，所以在您的项目中需要引入相关引擎评测文件；
      （2）引用Jquery框架（最好是v1.10.2版本）；
      （3）由于当前图片没有上传统一资源平台，所以在引用是可能需要将组件中图片文件夹Copy到项目中，在组件调用时传入  imagePath="./images"
           用于获取图片路径，该路径为调用组件页面相对路径；
      （4）由于用到引擎评测所以需要将你的项目部署，不然在调用SpeechJs无法加载相关播放器；

------------------------------------------------------------------------------------------------------------------------

///////////////////////////

如有疑问可联系：

Email: hlwang3@iflytek.com

//////////////////////////