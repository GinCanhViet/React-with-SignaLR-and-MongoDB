# React-with-SignaLR-and-MongoDB
Real-time chat demo. React with Visual Studio, SignaLR and MongoDB

Demo: http://chat.nguyencanhviet.com/

![Hình minh họa](https://i.imgur.com/dn65XcL.png)

> Đây chỉ là sản phẩm mình làm chơi để học ReactJS, có gì chưa đúng mong mọi người góp ý :D, nếu bạn nào chưa biết cách dùng signaLR thì có thể xem nó để biết cách hoạt động thôi, nó ko theo chuẩn mực nào nhé :D
>
================================
1. Cài đặt NodeJS: https://nodejs.org/en/
2. Vào đây để tạo MongoDB free: https://mlab.com/home
3. Tạo DB có tên **realtimechatdemo**, sau đó trong DB này tạo tiếp một collection tên là: **messages** (dùng để lưu trữ tin nhắn)
4. Bấm qua phần user, add user cho DB, để sau này điền vào connection string, dùng cho việc kết nối tới DB.
![Hình minh họa](https://i.imgur.com/eoLarYh.png)
![Hình minh họa](https://i.imgur.com/2FyAia1.png)
5. Copy connection string ở hình trên, thay username và password của DB vào.
6. Bỏ connection string vào `RealTimeUsingSignalR.Models.MessageModel`
```csharp
public MessageModel()
{
    //Create a mongoDB free: https://mlab.com/
    mongoUrl = new MongoUrl(@"your connection string here");
    ...
}
```
7. Clean and Rebuild project. Nếu là lần đầu, bạn cần phải đợi để tất cả các node module được tải xuống trong ít phút.
