# nodejs 获取 主板信息
> 支持windows、mac、Linux 
> 注意Linux非root权限可能会导致获取信息不全 

## 示例
```javascript
import {baseboard} from "baseboard";

console.log(baseboard());

// 输出主板信息
// {
//   manufacturer: 'ASUSTeK COMPUTER INC.',
//   product: 'FA506II',
//   version: '1.0',
//   serial: 'L313NRCX007930MB'
// }
```