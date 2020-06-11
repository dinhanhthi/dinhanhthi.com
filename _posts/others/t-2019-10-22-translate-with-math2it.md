---
layout: post
title: "Guide to translate documents with Math2IT"
categories: [others]
icon-photo: translate.png
---

{% assign img-url = '/img/post/others/translate-with-math2it' %}

{% include toc.html %}

{:.alert.alert-success}
**To guys who don't understand Vietnamese**: This note is for Vietnamese people who join [Math2IT's translation projects](https://github.com/math2it). We translate open-source books/websites about Maths, Information Technology which are helpful for Vietnamese students to learn.

Tùy vào mục đích và bạn biết về Github nhiều hay ít mà hãy chọn mục bên dưới cho phù hợp nhé.

## Bạn chỉ muốn góp ý sửa một bài viết nào đó?

- **Dễ nhất**: Email trực tiếp [đến Math2IT](mailto:math2itblog@gmail.com) hoặc tác giả đã dịch bài đó để đề nghị sửa.
- **Sửa trực tiếp trên Github**: Bạn phải có 1 tài khoản Github, hãy [đăng nhập](https://github.com/login) sau đó:
    1. Vào ngay trang chỉnh sửa bài viết đó trên Github (đã được đề cập trong bài dịch), ví dụ bài "[Hiểu trực quan chuỗi Taylor thông qua sự liên hệ với ADN](https://github.com/math2it/BetterExplained-vn-translation/blob/master/docs/phep-tinh-vi-tich-phan-calculus/chuoi-taylor-va-adn.md)".
    2. Nhấn vào biểu tượng hình cây bút (bên phải nó là biểu tượng hình thùng rác).
    3. Tiến hành sửa theo ý bạn (bạn có thể xóa cái cũ, chúng tôi sẽ tự biết những thay đổi).
    4. Sau khi xóa xong, bạn xuống mục **Propose file change**, ghi cụ thể cái bạn vừa sửa (khung trên là tên chung - nên ghi ngắn gọn, khung dưới là miêu tả cho chỉnh sửa của bạn - bạn có thể ghi dài)
    5. Sau đó nhấn **Propose file change**, bạn sẽ chuyển sang một trang khác. Tại đây bạn nhấn vào **Create pull request**. Điền thông tin cho pull request đó (hoặc để như mặc định cũng được), sau đó nhấn **Create pull request**.
    6. Chờ chúng tôi xét duyệt và phản hồi bạn.

    {:.alert.alert-warning}
    Hãy tìm **tất cả các lỗi** cần sửa và chỉ tạo **1 pull request duy nhất**! Tránh tình trạng quá nhiều pull request cho cùng 1 bài viết.

- **Chuyên nghiệp nhưng phức tạp hơn**: Làm theo [hướng dẫn này](https://codetot.net/contribute-github/) để vừa có thể cùng dịch bài, vừa có thể tạo pull request.

## Chuẩn chung cho các bài dịch

1. **Luôn kiểm tra bài viết trước khi dịch để tránh tình trạng trùng lặp**. Bạn cần **TRÁNH** các bài **đã dịch**, **đang dịch** và **sắp dịch** của dự án. Ví dụ dự án [BetterExplained-vn-translation](https://betterexplained.math2it.com/tat-ca-bai-viet).
2. **Luôn dịch bằng file markdown** (`.md`). Nếu chưa biết nó là gì, hãy xem [ở đây](https://en.wikipedia.org/wiki/Markdown#Example) và [ví dụ ở đây](https://markdown-it.github.io/).
2. **Gõ Toán học giống gõ trong LaTeX**. Đặc biệt, ta dùng `$$a+b$$` cho các công thức trong cùng dòng văn bản (inline) thay vì `$a+b$` như trong LaTeX. Các công thức khác dòng (display), bạn hãy dùng `$$` ở đầu và cuối của block toán, kể cả khi đã dùng `\begin{align}...\end{align}`. Ví dụ,

    ~~~ latex
$$
\begin{align}
a+b &= c \\
x+y &= z
$$
    ~~~

3. **Bám sát cấu trúc của bài gốc**. Bài gốc dùng heading sao thì trong bài dịch heading y vậy (heading là các đề tựa cho mục).
4. **Chỉ dịch thuật ngữ nếu bạn chắc chắn thuật ngữ đó đã được dùng và công nhận phổ biến**. Không tự ý dịch thuật ngữ chưa bao giờ được dịch sang tiếng Việt! Hãy giữ tên gốc hoặc cùng thảo luận trên [Group Math2IT](https://www.facebook.com/groups/math2it/)!
5. Không tự ý trang trí cho bài viết mà chưa qua thảo luận với các thành viên khác! Bạn có thể [email cho Math2IT](mailto:math2itblog@gmail.com) hoặc tạo post thảo luận trên [Group Math2IT](https://www.facebook.com/groups/math2it/). 
6. **Luôn kiểm tra bài viết này thường xuyên** để biết các chuẩn mới/đã thay đổi.

## Bạn chưa biết gì về Github hay Git và chỉ muốn dịch thôi?

{:.alert.alert-warning}
Đọc mục "[Chuẩn chung cho các bài viết](#chuẩn-chung-cho-các-bài-dịch)" trước khi dịch!

Tự dịch một bài nào đó theo [chuẩn Markdown](https://markdown-it.github.io/), sau đó gởi [email cho Math2IT](mailto:math2itblog@gmail.com) đăng giúp. Chúng tôi sẽ để tên bạn (kèm website nếu bạn cung cấp) vào chỗ người dịch. 


## Bạn đã biết Github hoặc có chút kiến thức về Git?

{:.alert.alert-warning}
Đọc mục "[Chuẩn chung cho các bài viết](#chuẩn-chung-cho-các-bài-dịch)" trước khi dịch!

Làm theo hướng dẫn của [bài viết này](https://codetot.net/contribute-github/) để clone về máy và tạo các pull request. Nếu vẫn không làm được mà vẫn muốn làm theo cách này, bạn hãy [email cho Math2IT](mailto:math2itblog@gmail.com) hoặc tạo post thảo luận trên [Group Math2IT](https://www.facebook.com/groups/math2it/).