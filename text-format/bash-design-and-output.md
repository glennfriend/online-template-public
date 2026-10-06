
# 界面優美 簡單易懂 邊界清楚

## 常用參數設計
--help          不執行程式, 顯示有什麼參數
--real-run      預設是 dry run, 下 --real-run 才是真正執行


## 每個指令顯示清楚各自的輸出邊界
> bash 連續的指令串.sh
```text
## ls
>>>>
cdrom   etc   home    lost+found  mnt
proc    tmp   var     bin         boot
lib     media opt     root        sys
usr
<<<<

## tail /var/log/kern.log
>>>>
2000-01-02T23:59:59.215638+08:00 hello kernel: eth0: renamed from veth8248650
<<<<
```