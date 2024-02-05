# bedulive 后端服务
cors，把请求分为2种

简单请求（simple request）
非简单请求 （preflight request），请求方法是OPTIONS

那区分二者的标准是什么？ 如下：

请求的方法只能是GET, POST, HEAD的一种
请求的header的只能是Accept，Accept-Language, Content-Language，Content-Type这些字段，不能超出这些字段
对于请求的header的Content-Type字段，只能是以下值

text/plain
multipart/form-data
application/x-www-form-urlencoded



都满足以上条件的就是简单请求，否则就是非简单请求。
比如我们经常使用的Content-Type:application/json; charset=utf-8，这个请求就是非简单请求

